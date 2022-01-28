// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../utils/DFH/Automate.sol";
import "../utils/DFH/IStorage.sol";
import "../utils/Uniswap/IUniswapV2Router02.sol";
import "./IMasterChefV2.sol";
import {ERC20Tools} from "../utils/ERC20Tools.sol";

/**
 * @notice Use with simple token only.
 */
contract MasterChefV2SingleRestake is Automate {
  using ERC20Tools for IERC20;

  struct Swap {
    address[] path;
    uint256 outMin;
  }

  IMasterChefV2 public staking;

  address public liquidityRouter;

  uint256 public pool;

  uint16 public slippage;

  uint16 public deadline;

  IERC20 public stakingToken;

  IERC20 public rewardToken;

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
      "MasterChefV2SingleRestake::init: reinitialize staking address forbidden"
    );
    staking = IMasterChefV2(_staking);
    require(
      !_initialized || liquidityRouter == _liquidityRouter,
      "MasterChefV2SingleRestake::init: reinitialize liquidity router address forbidden"
    );
    liquidityRouter = _liquidityRouter;
    require(!_initialized || pool == _pool, "MasterChefV2SingleRestake::init: reinitialize pool index forbidden");
    pool = _pool;
    slippage = _slippage;
    deadline = _deadline;

    if (!_initialized) {
      IMasterChefV2.PoolInfo memory poolInfo = staking.poolInfo(pool);
      stakingToken = IERC20(poolInfo.lpToken);
      rewardToken = IERC20(staking.joe());
    }
  }

  function deposit() external onlyOwner {
    IERC20 _stakingToken = stakingToken; // gas optimisation
    uint256 balance = _stakingToken.balanceOf(address(this));
    _stakingToken.safeApprove(address(staking), balance);
    staking.deposit(pool, balance);
  }

  function refund() external onlyOwner {
    IMasterChefV2 _staking = staking; // gas optimisation
    address __owner = owner(); // gas optimisation
    IMasterChefV2.UserInfo memory userInfo = _staking.userInfo(pool, address(this));
    _staking.withdraw(pool, userInfo.amount);
    stakingToken.transfer(__owner, stakingToken.balanceOf(address(this)));
    rewardToken.transfer(__owner, rewardToken.balanceOf(address(this)));
  }

  function emergencyWithdraw() external onlyOwner {
    address __owner = owner(); // gas optimisation
    staking.emergencyWithdraw(pool);
    stakingToken.transfer(__owner, stakingToken.balanceOf(address(this)));
    rewardToken.transfer(__owner, rewardToken.balanceOf(address(this)));
  }

  function _swap(
    address[] memory path,
    uint256[2] memory amount,
    uint256 _deadline
  ) internal {
    if (path[0] == path[path.length - 1]) return;

    IUniswapV2Router02(liquidityRouter).swapExactTokensForTokens(amount[0], amount[1], path, address(this), _deadline);
  }

  function run(
    uint256 gasFee,
    uint256 _deadline,
    Swap memory swap
  ) external bill(gasFee, "AvaxTraderjoeMasterChefV2SingleRestake") {
    IMasterChefV2 _staking = staking; // gas optimization
    IERC20 _stakingToken = stakingToken;
    (uint256 earned, , , ) = _staking.pendingTokens(pool, address(this));
    require(earned > 0, "MasterChefV2SingleRestake::run: no earned");

    _staking.deposit(pool, 0); // get all reward
    uint256 rewardAmount = rewardToken.balanceOf(address(this));
    rewardToken.safeApprove(liquidityRouter, rewardAmount);
    _swap(swap.path, [rewardAmount, swap.outMin], _deadline);

    uint256 stakingAmount = _stakingToken.balanceOf(address(this));
    _stakingToken.safeApprove(address(_staking), stakingAmount);
    _staking.deposit(pool, stakingAmount);
  }
}
