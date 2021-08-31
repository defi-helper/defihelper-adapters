// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

import "../Automate.sol";

// solhint-disable no-empty-blocks
// solhint-disable avoid-tx-origin
contract AutomateMock is Automate {
  address public staking;

  constructor(address _info) Automate(_info) {}

  function init(address _staking) public initializer {
    staking = _staking;
    _owner = tx.origin;
  }

  function run(
    uint256 gasFee,
    uint256 x,
    uint256 y
  ) external bill(gasFee, "AutomateMock.run") returns (uint256) {
    return x + y;
  }
}
