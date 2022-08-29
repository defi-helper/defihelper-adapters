// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./utils/DFH/Automate.sol";
import "./utils/DFH/IStorage.sol";
import "./utils/Uniswap/IUniswapV2Router02.sol";
import "./utils/Uniswap/SafeUniswapV2Router.sol";
import "./utils/Uniswap/StopLoss.sol";
import "./IMasterChef2.sol";

/**
 * @notice Use with simple token only.
 */
contract MasterChef2SingleRestake is Automate {
  using SafeERC20 for IERC20;
  using SafeUniswapV2Router for IUniswapV2Router02;
  using StopLoss for StopLoss.Order;

  struct Swap {
    address[] path;
    uint256 outMin;
  }

  IMasterChef2 public staking;

  address public liquidityRouter;

  uint256 public pool;

  uint16 public slippage;

  uint16 public deadline;

  IERC20 public stakingToken;

  IERC20 public rewardToken;

  StopLoss.Order public stopLoss;

  // solhint-disable-next-line no-empty-blocks
  constructor(address _info) Automate(_info) {}

  function init(
    address _staking,
    address _liquidityRouter,
    uint256 _pool,
    uint16 _slippage,
    uint16 _deadline
  ) external initializer {
    require(
      !_initialized || address(staking) == _staking,
      "MasterChef2SingleRestake::init: reinitialize staking address forbidden"
    );
    staking = IMasterChef2(_staking);
    require(
      !_initialized || liquidityRouter == _liquidityRouter,
      "MasterChef2SingleRestake::init: reinitialize liquidity router address forbidden"
    );
    liquidityRouter = _liquidityRouter;
    require(!_initialized || pool == _pool, "MasterChef2SingleRestake::init: reinitialize pool index forbidden");
    pool = _pool;
    slippage = _slippage;
    deadline = _deadline;

    if (!_initialized) {
      address lpToken = staking.lpToken(pool);
      stakingToken = IERC20(lpToken);
      rewardToken = IERC20(staking.CAKE());
    }
  }

  function deposit() external onlyOwner {
    IERC20 _stakingToken = stakingToken; // gas optimisation
    uint256 balance = _stakingToken.balanceOf(address(this));
    _stakingToken.safeApprove(address(staking), balance);
    staking.deposit(pool, balance);
  }

  function refund() external onlyOwner {
    IMasterChef2 _staking = staking; // gas optimisation
    address __owner = owner(); // gas optimisation
    IMasterChef2.UserInfo memory userInfo = _staking.userInfo(pool, address(this));
    _staking.withdraw(pool, userInfo.amount);
    stakingToken.safeTransfer(__owner, stakingToken.balanceOf(address(this)));
    rewardToken.safeTransfer(__owner, rewardToken.balanceOf(address(this)));
  }

  function emergencyWithdraw() external onlyOwner {
    address __owner = owner(); // gas optimisation
    staking.emergencyWithdraw(pool);
    stakingToken.safeTransfer(__owner, stakingToken.balanceOf(address(this)));
    rewardToken.safeTransfer(__owner, rewardToken.balanceOf(address(this)));
  }

  function run(
    uint256 gasFee,
    uint256 _deadline,
    Swap memory swap
  ) external bill(gasFee, "PancakeSwapMasterChef2SingleRestake") {
    IMasterChef2 _staking = staking; // gas optimization
    IUniswapV2Router02 _liquidityRouter = IUniswapV2Router02(liquidityRouter);
    require(_staking.pendingCake(pool, address(this)) > 0, "MasterChef2SingleRestake::run: no earned");

    _staking.deposit(pool, 0); // get all reward
    uint256 rewardAmount = rewardToken.balanceOf(address(this));
    rewardToken.safeApprove(address(_liquidityRouter), rewardAmount);
    _liquidityRouter.safeSwapExactTokensForTokens(rewardAmount, swap.outMin, swap.path, address(this), _deadline);

    IERC20 _stakingToken = stakingToken;
    uint256 stakingAmount = _stakingToken.balanceOf(address(this));
    _stakingToken.safeApprove(address(_staking), stakingAmount);
    _staking.deposit(pool, stakingAmount);
  }

  function setStopLoss(
    address[] calldata path,
    uint256 amountOut,
    uint256 amountOutMin
  ) external onlyOwner {
    stopLoss = StopLoss.Order(path, amountOut, amountOutMin);
  }

  function runStopLoss(uint256 gasFee, uint256 _deadline)
    external
    bill(gasFee, "PancakeSwapMasterChef2SingleStopLoss")
  {
    staking.withdraw(pool, staking.userInfo(pool, address(this)).amount);
    address[] memory inTokens = new address[](1);
    inTokens[0] = address(stakingToken);

    stopLoss.run(liquidityRouter, inTokens, _deadline);
    address __owner = owner();
    IERC20 exitToken = IERC20(stopLoss.path[stopLoss.path.length - 1]);
    exitToken.safeTransfer(__owner, exitToken.balanceOf(address(this)));
    if (rewardToken != exitToken) {
      rewardToken.safeTransfer(__owner, rewardToken.balanceOf(address(this)));
    }
  }
}
