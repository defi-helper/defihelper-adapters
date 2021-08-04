// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface Balance {
  function claim(
    address account,
    uint256 gasFee,
    uint256 protocolFee,
    string memory description
  ) external returns (uint256);
}

abstract contract Automate is Ownable, Pausable {
  /// @notice Balance contract address.
  Balance public balance;

  constructor(address _balance) {
    balance = Balance(_balance);
  }

  /**
   * @dev Claim fees from owner.
   * @param gasFee Claim gas fee.
   * @param protocolFee Claim protocol fee.
   * @param operation Claim description.
   */
  function _bill(
    uint256 gasFee,
    uint256 protocolFee,
    string memory operation
  ) internal whenNotPaused returns (uint256) {
    return balance.claim(owner(), gasFee, protocolFee, operation);
  }

  /**
   * @notice Pause bill maker.
   */
  function pause() external onlyOwner {
    _pause();
  }

  /**
   * @notice Unpause bill maker.
   */
  function unpause() external onlyOwner {
    _unpause();
  }
}
