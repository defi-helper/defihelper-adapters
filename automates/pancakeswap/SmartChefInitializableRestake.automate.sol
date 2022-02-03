// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../utils/DFH/Automate.sol";
import "../utils/DFH/IStorage.sol";
import "../utils/Uniswap/IUniswapV2Router02.sol";
import "./ISmartChefInitializable.sol";
import {ERC20Tools} from "../utils/ERC20Tools.sol";

/**
 * @notice Use with simple token only.
 */
contract SmartChefInitializableRestake is Automate {
  using ERC20Tools for IERC20;

  struct Swap {
    address[] path;
    uint256 outMin;
  }

  ISmartChefInitializable public staking;

  address public liquidityRouter;

  uint16 public slippage;

  uint16 public deadline;

  IERC20 public stakingToken;

  IERC20 public rewardToken;

  // solhint-disable-next-line no-empty-blocks
  constructor(address _info) Automate(_info) {}

  function init(
    address _staking,
    address _liquidityRouter,
    uint16 _slippage,
    uint16 _deadline
  ) external initializer {
    require(
      !_initialized || address(staking) == _staking,
      "SmartChefInitializableRestake::init: reinitialize staking address forbidden"
    );
    staking = ISmartChefInitializable(_staking);
    require(
      !_initialized || liquidityRouter == _liquidityRouter,
      "SmartChefInitializableRestake::init: reinitialize liquidity router address forbidden"
    );
    liquidityRouter = _liquidityRouter;
    slippage = _slippage;
    deadline = _deadline;

    if (!_initialized) {
      stakingToken = IERC20(staking.stakedToken());
      rewardToken = IERC20(staking.rewardToken());
    }
  }

  function deposit() external onlyOwner {
    IERC20 _stakingToken = stakingToken; // gas optimisation
    uint256 balance = _stakingToken.balanceOf(address(this));
    _stakingToken.safeApprove(address(staking), balance);
    staking.deposit(balance);
  }

  function refund() external onlyOwner {
    ISmartChefInitializable _staking = staking; // gas optimisation
    address __owner = owner(); // gas optimisation
    ISmartChefInitializable.UserInfo memory userInfo = _staking.userInfo(address(this));
    _staking.withdraw(userInfo.amount);
    stakingToken.transfer(__owner, stakingToken.balanceOf(address(this)));
    rewardToken.transfer(__owner, rewardToken.balanceOf(address(this)));
  }

  function emergencyWithdraw() external onlyOwner {
    address __owner = owner(); // gas optimisation
    staking.emergencyWithdraw();
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
  ) external bill(gasFee, "PancakeSwapSmartChefInitializable") {
    ISmartChefInitializable _staking = staking; // gas optimization
    IERC20 _stakingToken = stakingToken;
    require(_staking.pendingReward(address(this)) > 0, "SmartChefInitializableRestake::run: no earned");

    _staking.deposit(0); // get all reward
    uint256 rewardAmount = rewardToken.balanceOf(address(this));
    rewardToken.safeApprove(liquidityRouter, rewardAmount);
    _swap(swap.path, [rewardAmount, swap.outMin], _deadline);

    uint256 stakingAmount = _stakingToken.balanceOf(address(this));
    _stakingToken.safeApprove(address(_staking), stakingAmount);
    _staking.deposit(stakingAmount);
  }
}
