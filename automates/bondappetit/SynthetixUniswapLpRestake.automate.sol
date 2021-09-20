// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../utils/DFH/Automate.sol";
import "../utils/DFH/IStorage.sol";
import "../utils/Uniswap/IUniswapV2Router02.sol";
import "../utils/Uniswap/IUniswapV2Pair.sol";
import "../utils/Synthetix/IStaking.sol";
import {ERC20Tools} from "../utils/ERC20Tools.sol";

// solhint-disable not-rely-on-time
contract SynthetixUniswapLpRestake is Automate {
  using ERC20Tools for IERC20;

  IStaking public staking;

  uint16 public slippage;

  uint16 public deadline;

  // solhint-disable-next-line no-empty-blocks
  constructor(address _info) Automate(_info) {}

  function init(
    address _staking,
    uint16 _slippage,
    uint16 _deadline
  ) external initializer {
    staking = IStaking(_staking);
    slippage = _slippage;
    deadline = _deadline;
  }

  function deposit() external onlyOwner {
    IStaking _staking = staking; // gas optimisation
    address stakingToken = _staking.stakingToken();
    IERC20(stakingToken).safeApproveAll(address(_staking));
    _staking.stake(IERC20(stakingToken).balanceOf(address(this)));
  }

  function refund() external onlyOwner {
    IStaking _staking = staking; // gas optimisation
    _staking.exit();

    address __owner = owner(); // gas optimisation
    IERC20 stakingToken = IERC20(_staking.stakingToken());
    stakingToken.transfer(__owner, stakingToken.balanceOf(address(this)));

    IERC20 rewardToken = IERC20(_staking.rewardsToken());
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
    uint256[4] memory amount,
    uint256 _deadline
  ) internal {
    IUniswapV2Router02(path[0]).addLiquidity(
      path[1],
      path[2],
      amount[0],
      amount[1],
      amount[2],
      amount[3],
      address(this),
      _deadline
    );
  }

  function run(
    uint256 gasFee,
    uint256 _deadline,
    uint256[2] memory _outMin
  ) external bill(gasFee, "BondappetitSynthetixLPRestake") {
    IStaking _staking = staking; // gas optimization
    require(_staking.earned(address(this)) > 0, "SynthetixUniswapLpRestake::run: no earned");
    address router = IStorage(info()).getAddress(keccak256("UniswapV2:Contract:Router2"));
    require(router != address(0), "SynthetixUniswapLpRestake::run: uniswap router contract not found");

    _staking.getReward();
    address rewardToken = _staking.rewardsToken();
    uint256 rewardAmount = IERC20(rewardToken).balanceOf(address(this));
    IERC20(rewardToken).safeApproveAll(router);

    IUniswapV2Pair stakingToken = IUniswapV2Pair(_staking.stakingToken());
    address[2] memory tokens = [stakingToken.token0(), stakingToken.token1()];
    uint256[4] memory amount = [
      _swap([router, rewardToken, tokens[0]], [rewardAmount / 2, _outMin[0]], _deadline),
      _swap([router, rewardToken, tokens[1]], [rewardAmount - rewardAmount / 2, _outMin[1]], _deadline),
      0,
      0
    ];

    _addLiquidity([router, tokens[0], tokens[1]], amount, _deadline);
    IERC20(stakingToken).safeApproveAll(address(_staking));
    _staking.stake(IERC20(stakingToken).balanceOf(address(this)));
  }
}
