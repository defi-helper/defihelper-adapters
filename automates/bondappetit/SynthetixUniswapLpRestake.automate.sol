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

  // solhint-disable-next-line no-empty-blocks
  constructor(address _info) Automate(_info) {}

  function init(address _staking) public initializer {
    staking = IStaking(_staking);
    // solhint-disable-next-line avoid-tx-origin
    _owner = tx.origin;
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

  function run(uint256 gasFee) external bill(gasFee, "BondappetitSynthetixLPRestake") {
    require(staking.earned(address(this)) > 0, "SynthetixUniswapLpRestake::run: no earned");
    address router = IStorage(info()).getAddress(keccak256("UniswapV2:Contract:Router2"));
    require(router != address(0), "SynthetixUniswapLpRestake::run: uniswap router contract not found");

    staking.getReward();
    address rewardToken = staking.rewardsToken();
    uint256 rewardAmount = IERC20(rewardToken).balanceOf(address(this));
    uint256 half0 = rewardAmount / 2;
    uint256 half1 = rewardAmount - half0;
    IERC20(rewardToken).safeApproveAll(router);

    IUniswapV2Pair stakingToken = IUniswapV2Pair(staking.stakingToken());
    address token0 = stakingToken.token0();
    uint256 token0Amount;
    if (token0 != rewardToken) {
      address[] memory path = new address[](2);
      path[0] = rewardToken;
      path[1] = token0;
      uint256 amountOut = IUniswapV2Router02(router).getAmountsOut(half0, path)[path.length - 1];
      require(amountOut > 0, "SynthetixUniswapLpRestake::run: empty liquidity for token0 swap");

      token0Amount = IUniswapV2Router02(router).swapExactTokensForTokens(
        half0,
        amountOut,
        path,
        address(this),
        block.timestamp
      )[path.length - 1];
      IERC20(token0).safeApproveAll(router);
    } else {
      token0Amount = half0;
    }
    address token1 = stakingToken.token1();
    uint256 token1Amount;
    if (token1 != rewardToken) {
      address[] memory path = new address[](2);
      path[0] = rewardToken;
      path[1] = token1;
      uint256 amountOut = IUniswapV2Router02(router).getAmountsOut(half1, path)[path.length - 1];
      require(amountOut > 0, "SynthetixUniswapLpRestake::run: empty liquidity for token1 swap");

      token1Amount = IUniswapV2Router02(router).swapExactTokensForTokens(
        half1,
        amountOut,
        path,
        address(this),
        block.timestamp
      )[path.length - 1];
      IERC20(token1).safeApproveAll(router);
    } else {
      token1Amount = half1;
    }

    IUniswapV2Router02(router).addLiquidity(
      token0,
      token1,
      token0Amount,
      token1Amount,
      0,
      0,
      address(this),
      block.timestamp
    );
    IERC20(stakingToken).safeApproveAll(address(staking));
    staking.stake(IERC20(stakingToken).balanceOf(address(this)));
  }
}
