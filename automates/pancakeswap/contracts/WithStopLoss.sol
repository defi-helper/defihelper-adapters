// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./utils/Uniswap/IUniswapV2Router02.sol";

abstract contract WithStopLoss {
  using SafeERC20 for IERC20;

  struct StopLoss {
    address[] path;
    uint256 amountOut;
    uint256 amountOutMin;
  }

  StopLoss public stopLoss;

  function _swap(
    address liquidityRouter,
    address[] memory path,
    uint256[2] memory amount,
    uint256 _deadline
  ) internal returns (uint256[] memory amounts) {
    if (path[0] == path[path.length - 1]) return amounts;

    return
      IUniswapV2Router02(liquidityRouter).swapExactTokensForTokens(
        amount[0],
        amount[1],
        path,
        address(this),
        _deadline
      );
  }

  function _runStopLoss(
    address liquidityRouter,
    address[] memory inTokens,
    address recipient,
    uint256 _deadline
  ) internal {
    for (uint8 i = 0; i < 256 && i < inTokens.length; i++) {
      address token = inTokens[i];
      if (token == stopLoss.path[0]) continue;
      uint256 balance = IERC20(token).balanceOf(address(this));
      if (balance == 0) continue;
      address[] memory path;
      path[0] = token;
      path[1] = stopLoss.path[0];
      IERC20(token).safeApprove(liquidityRouter, balance);
      _swap(liquidityRouter, path, [balance, 0], _deadline);
    }

    address baseToken = stopLoss.path[0];
    uint256 baseBalance = IERC20(baseToken).balanceOf(address(this));
    require(baseBalance > 0, "WithStopLoss::_runStopLoss: insufficient balance of base token");
    IERC20(baseToken).safeApprove(liquidityRouter, baseBalance);
    uint256[] memory amountsOut = _swap(
      liquidityRouter,
      stopLoss.path,
      [baseBalance, stopLoss.amountOutMin],
      _deadline
    );
    require(
      amountsOut[amountsOut.length - 1] <= stopLoss.amountOut,
      "WithStopLoss::_runStopLoss: invalid output amount"
    );

    address exitToken = stopLoss.path[stopLoss.path.length - 1];
    uint256 exitBalance = IERC20(exitToken).balanceOf(address(this));
    IERC20(exitToken).safeTransfer(recipient, exitBalance);
  }
}
