// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

// solhint-disable func-name-mixedcase
interface IApeRewardV4 {
  struct UserInfo {
    uint256 amount;
    uint256 rewardDebt;
  }

  struct PoolInfo {
    address lpToken;
    uint256 allocPoint;
    uint256 lastRewardBlock;
    uint256 accRewardTokenPerShare;
  }

  function STAKE_TOKEN() external view returns (address);

  function REWARD_TOKEN() external view returns (address);

  function poolInfo() external view returns (PoolInfo memory);

  function userInfo(address user) external view returns (UserInfo memory);

  function pendingReward(address user) external view returns (uint256);

  function deposit(uint256 amount) external;

  function withdraw(uint256 amount) external;

  function emergencyWithdraw() external;
}
