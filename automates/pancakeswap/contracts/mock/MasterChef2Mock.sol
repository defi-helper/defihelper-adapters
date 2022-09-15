// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../IMasterChef2.sol";

// solhint-disable var-name-mixedcase
// solhint-disable func-param-name-mixedcase
contract MasterChef2Mock is IMasterChef2, Ownable {
  using SafeERC20 for IERC20;

  address public override CAKE;

  uint256 public override poolLength;

  uint256 public override totalRegularAllocPoint;

  uint256 public override totalSpecialAllocPoint;

  mapping(uint256 => IMasterChef2.PoolInfo) internal _pools;

  mapping(uint256 => address) internal _lpTokens;

  mapping(uint256 => mapping(address => IMasterChef2.UserInfo)) internal _usersInfo;

  constructor(address _CAKE) {
    CAKE = _CAKE;
  }

  function cakePerBlock(bool) override external pure returns (uint256) {
    return 0;
  }

  function setPool(uint256 pool, address _lpToken) external onlyOwner {
    require(_lpToken != address(0), "MasterChef2Mock::setPool: invalid lp token address");
    if (_lpTokens[pool] == address(0)) {
      poolLength++;
    }
    _lpTokens[pool] = _lpToken;
  }

  function setReward(
    uint256 pool,
    address user,
    uint256 amount
  ) external onlyOwner {
    _usersInfo[pool][user].rewardDebt = amount;
  }

  function poolInfo(uint256 pool) external view override returns (PoolInfo memory) {
    return _pools[pool];
  }

  function lpToken(uint256 pool) public view override returns (address) {
    return _lpTokens[pool];
  }

  function userInfo(uint256 pool, address user) public view override returns (UserInfo memory) {
    return _usersInfo[pool][user];
  }

  function pendingCake(uint256 pool, address user) public view override returns (uint256) {
    return _usersInfo[pool][user].rewardDebt;
  }

  function _withdrawReward(uint256 pool, address recipient) internal {
    uint256 amount = pendingCake(pool, recipient);
    _usersInfo[pool][recipient].rewardDebt = 0;
    IERC20(CAKE).safeTransfer(recipient, amount);
  }

  function deposit(uint256 pool, uint256 amount) external override {
    address _lpToken = lpToken(pool);
    require(_lpToken != address(0), "MasterChef2Mock::deposit: pool not found");
    IERC20(_lpToken).safeTransferFrom(msg.sender, address(this), amount);
    _usersInfo[pool][msg.sender].amount += amount;
    _withdrawReward(pool, msg.sender);
  }

  function withdraw(uint256 pool, uint256 amount) public override {
    address _lpToken = lpToken(pool);
    require(_lpToken != address(0), "MasterChef2Mock::withdraw: pool not found");
    require(amount <= _usersInfo[pool][msg.sender].amount, "MasterChef2Mock::withdraw: insufficient funds");
    _usersInfo[pool][msg.sender].amount -= amount;
    IERC20(_lpToken).safeTransfer(msg.sender, amount);
    _withdrawReward(pool, msg.sender);
  }

  function emergencyWithdraw(uint256 pool) external override {
    withdraw(pool, _usersInfo[pool][msg.sender].amount);
  }
}
