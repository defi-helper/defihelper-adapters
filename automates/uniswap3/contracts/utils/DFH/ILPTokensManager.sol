// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

interface ILPTokensManager {
  struct Swap {
    bytes path;
    uint256 outMin;
  }

  struct BuyLiquidityParams {
    address positionManager;
    address router;
    address from;
    uint256 amount;
    Swap swap;
    address to;
    int24 tickLower;
    int24 tickUpper;
    uint256 deadline;
  }

  struct SellLiquidityParams {
    address positionManager;
    address router;
    uint256 from;
    Swap swap;
    address to;
    uint256 deadline;
  }

  event BuyLiquidity(address buyer, address pool, uint128 liquidity, uint256 tokenId);

  event SellLiquidity(address seller, address pool, uint128 liquidity);

  function fee() external view returns (uint256);

  function buyLiquidity(BuyLiquidityParams calldata params) external payable;

  function buyLiquidityETH(BuyLiquidityParams calldata params) external payable;

  function sellLiquidity(SellLiquidityParams calldata params) external payable;

  function sellLiquidityETH(SellLiquidityParams calldata params) external payable;
}
