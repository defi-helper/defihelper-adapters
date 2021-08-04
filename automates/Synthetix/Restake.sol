// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

import "../utils/Automate.sol";

contract Restake is Automate {
  constructor(address _balance) Automate(_balance) {}

  function deposit() external onlyOwner {}

  function refund() external onlyOwner {}

  function run() external {}
}
