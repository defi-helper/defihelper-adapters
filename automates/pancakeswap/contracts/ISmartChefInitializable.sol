// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

interface ISmartChefInitializable {
  struct UserInfo {
    uint256 amount;
    uint256 rewardDebt;
  }

  function rewardToken() external view returns (address);

  function stakedToken() external view returns (address);

  function userInfo(address user) external view returns (UserInfo memory);

  function pendingReward(address user) external view returns (uint256);

  function deposit(uint256 amount) external;

  function withdraw(uint256 amount) external;

  function emergencyWithdraw() external;
}
