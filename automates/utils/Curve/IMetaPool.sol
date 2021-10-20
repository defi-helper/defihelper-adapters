// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

// solhint-disable func-name-mixedcase
interface IMetaPool {
  function add_liquidity(uint256[2] memory amounts, uint256 minMint) external returns (uint256);
}
