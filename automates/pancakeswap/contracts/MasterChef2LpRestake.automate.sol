// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./utils/DFH/Automate.sol";
import "./utils/DFH/IStorage.sol";
import "./utils/Uniswap/IUniswapV2Router02.sol";
import "./utils/Uniswap/IUniswapV2Pair.sol";
import "./utils/Uniswap/SafeUniswapV2Router.sol";
import "./utils/Uniswap/StopLoss.sol";
import "./IMasterChef2.sol";

/**
 * @notice Use with LP token only.
 */
contract MasterChef2LpRestake is Automate {
  using SafeERC20 for IERC20;
  using SafeUniswapV2Router for IUniswapV2Router02;
  using StopLoss for StopLoss.Order;

  struct Swap {
    address[] path;
    uint256 outMin;
  }

  address public liquidityRouter;

  IMasterChef2 public staking;

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
      "MasterChef2LpRestake::init: reinitialize staking address forbidden"
    );
    staking = IMasterChef2(_staking);
    require(
      !_initialized || liquidityRouter == _liquidityRouter,
      "MasterChef2LpRestake::init: reinitialize liquidity router address forbidden"
    );
    liquidityRouter = _liquidityRouter;
    require(!_initialized || pool == _pool, "MasterChef2LpRestake::init: reinitialize pool index forbidden");
    pool = _pool;
    slippage = _slippage;
    deadline = _deadline;

    if (!_initialized) {
      address lpToken = staking.lpToken(pool);
      stakingToken = IERC20(lpToken);
      rewardToken = IERC20(staking.CAKE());
    }
  }

  function deposit(uint256 amount) external onlyOwner {
    IERC20 _stakingToken = stakingToken; // gas optimisation
    _stakingToken.safeTransferFrom(msg.sender, address(this), amount);
    _stakingToken.safeApprove(address(staking), amount);
    staking.deposit(pool, amount);
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
    Swap memory swap0,
    Swap memory swap1
  ) external bill(gasFee, "PancakeSwapMasterChef2LpRestake") {
    IMasterChef2 _staking = staking; // gas optimization
    IUniswapV2Router02 _liquidityRouter = IUniswapV2Router02(liquidityRouter);
    require(_staking.pendingCake(pool, address(this)) > 0, "MasterChef2LpRestake::run: no earned");

    _staking.deposit(pool, 0); // get all reward
    uint256 rewardAmount = rewardToken.balanceOf(address(this));
    rewardToken.safeApprove(address(_liquidityRouter), rewardAmount);
    _liquidityRouter.safeSwapExactTokensForTokens(rewardAmount / 2, swap0.outMin, swap0.path, address(this), _deadline);
    _liquidityRouter.safeSwapExactTokensForTokens(
      rewardAmount - rewardAmount / 2,
      swap1.outMin,
      swap1.path,
      address(this),
      _deadline
    );

    IUniswapV2Pair _stakingToken = IUniswapV2Pair(address(stakingToken));
    _liquidityRouter.addAllLiquidity(_stakingToken.token0(), _stakingToken.token1(), address(this), _deadline);
    uint256 stakingAmount = _stakingToken.balanceOf(address(this));
    stakingToken.safeApprove(address(_staking), stakingAmount);
    _staking.deposit(pool, stakingAmount);
  }

  function setStopLoss(
    address[] calldata path,
    uint256 amountOut,
    uint256 amountOutMin
  ) external onlyOwner {
    stopLoss = StopLoss.Order(path, amountOut, amountOutMin);
  }

  function runStopLoss(uint256 gasFee, uint256 _deadline) external bill(gasFee, "PancakeSwapMasterChef2LpStopLoss") {
    staking.withdraw(pool, staking.userInfo(pool, address(this)).amount);
    (address token0, address token1, , ) = IUniswapV2Router02(liquidityRouter).removeAllLiquidity(
      address(stakingToken),
      address(this),
      _deadline
    );
    address[] memory inTokens = new address[](2);
    inTokens[0] = token0;
    inTokens[1] = token1;

    stopLoss.run(liquidityRouter, inTokens, _deadline);
    address __owner = owner();
    IERC20 exitToken = IERC20(stopLoss.path[stopLoss.path.length - 1]);
    exitToken.safeTransfer(__owner, exitToken.balanceOf(address(this)));
    if (rewardToken != exitToken) {
      rewardToken.safeTransfer(__owner, rewardToken.balanceOf(address(this)));
    }
  }
}
