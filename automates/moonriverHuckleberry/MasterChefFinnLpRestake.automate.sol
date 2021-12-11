// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../utils/DFH/Automate.sol";
import "../utils/DFH/IStorage.sol";
import "../utils/Uniswap/IUniswapV2Router02.sol";
import "../utils/Uniswap/IUniswapV2Pair.sol";
import "./IMasterChefFinnV2.sol";
import {ERC20Tools} from "../utils/ERC20Tools.sol";

contract MasterChefFinnLpRestake is Automate {
  using ERC20Tools for IERC20;

  IMasterChefFinnV2 public staking;

  uint256 public pool;

  uint16 public slippage;

  uint16 public deadline;

  IERC20 public stakingToken;

  IERC20 public rewardToken;

  // solhint-disable-next-line no-empty-blocks
  constructor(address _info) Automate(_info) {}

  function init(
    address _staking,
    uint256 _pool,
    uint16 _slippage,
    uint16 _deadline
  ) external initializer {
    staking = IMasterChefFinnV2(_staking);
    pool = _pool;
    slippage = _slippage;
    deadline = _deadline;

    IMasterChefFinnV2.PoolInfo memory poolInfo = staking.poolInfo(pool);
    stakingToken = IERC20(poolInfo.lpToken);
    rewardToken = IERC20(staking.finn());
  }

  function deposit() external onlyOwner {
    stakingToken.safeApproveAll(address(staking));
    staking.deposit(pool, stakingToken.balanceOf(address(this)));
  }

  function refund() external onlyOwner {
    IMasterChefFinnV2 _staking = staking; // gas optimisation
    address __owner = owner(); // gas optimisation
    IMasterChefFinnV2.UserInfo memory userInfo = staking.userInfo(pool, address(this));
    _staking.withdraw(pool, userInfo.amount);
    stakingToken.transfer(__owner, stakingToken.balanceOf(address(this)));
    rewardToken.transfer(__owner, rewardToken.balanceOf(address(this)));
  }

  function _swap(
    address[3] memory path,
    uint256[2] memory amount,
    uint256 _deadline
  ) internal returns (uint256) {
    if (path[1] == path[2]) return amount[0];

    address[] memory _path = new address[](2);
    _path[0] = path[1];
    _path[1] = path[2];

    IERC20(path[2]).safeApproveAll(path[0]); // For add liquidity call
    return
      IUniswapV2Router02(path[0]).swapExactTokensForTokens(amount[0], amount[1], _path, address(this), _deadline)[1];
  }

  function _addLiquidity(
    address[3] memory path,
    uint256[2] memory amountIn,
    uint256[2] memory amountOutMin,
    uint256 _deadline
  ) internal {
    IUniswapV2Router02(path[0]).addLiquidity(
      path[1],
      path[2],
      amountIn[0],
      amountIn[1],
      amountOutMin[0],
      amountOutMin[1],
      address(this),
      _deadline
    );
  }

  function run(
    uint256 gasFee,
    uint256 _deadline,
    uint256[2] memory _outMin
  ) external bill(gasFee, "AvaxSmartcoinMasterChefFinnLPRestake") {
    IMasterChefFinnV2 _staking = staking; // gas optimization
    IMasterChefFinnV2.UserInfo memory userInfo = staking.userInfo(pool, address(this));
    require(userInfo.rewardDebt > 0, "MasterChefFinnLpRestake::run: no earned");
    address router = IStorage(info()).getAddress(keccak256("Finn:Contract:Router2"));
    require(router != address(0), "MasterChefFinnLpRestake::run: finn router contract not found");

    _staking.deposit(pool, 0); // get all reward
    uint256 rewardAmount = rewardToken.balanceOf(address(this));
    rewardToken.safeApproveAll(router);

    IUniswapV2Pair _stakingToken = IUniswapV2Pair(address(stakingToken));
    address[2] memory tokens = [_stakingToken.token0(), _stakingToken.token1()];
    uint256[2] memory amountIn = [
      _swap([router, address(rewardToken), tokens[0]], [rewardAmount / 2, _outMin[0]], _deadline),
      _swap([router, address(rewardToken), tokens[1]], [rewardAmount - rewardAmount / 2, _outMin[1]], _deadline)
    ];
    uint256[2] memory amountOutMin = [uint256(0), uint256(0)];

    _addLiquidity([router, tokens[0], tokens[1]], amountIn, amountOutMin, _deadline);
    stakingToken.safeApproveAll(address(_staking));
    _staking.deposit(pool, stakingToken.balanceOf(address(this)));
  }
}
