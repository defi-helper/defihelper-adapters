// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./SafeUniswapV2Router.sol";
import "./IUniswapV2Router02.sol";

library StopLoss {
  using SafeERC20 for IERC20;
  using SafeUniswapV2Router for IUniswapV2Router02;

  struct Order {
    address[] path;
    uint256 amountOut;
    uint256 amountOutMin;
  }

  event StopLossOrderCompleted(uint256 amountOut);

  function run(
    Order storage order,
    address liquidityRouter,
    address[] memory inTokens,
    uint256 _deadline
  ) internal {
    require(order.path.length > 1 && order.amountOut > 0, "StopLoss::run: stop loss disabled");
    require(inTokens.length <= 256, "StopLoss::run: too many in tokens");
    for (uint8 i = 0; i < inTokens.length; i++) {
      address token = inTokens[i];
      if (token == order.path[0]) continue;
      uint256 balance = IERC20(token).balanceOf(address(this));
      if (balance == 0) continue;
      address[] memory path = new address[](2);
      path[0] = token;
      path[1] = order.path[0];
      IERC20(token).safeApprove(liquidityRouter, balance);
      IUniswapV2Router02(liquidityRouter).safeSwapExactTokensForTokens(balance, 0, path, address(this), _deadline);
    }

    address baseToken = order.path[0];
    uint256 baseBalance = IERC20(baseToken).balanceOf(address(this));
    uint256 amountOut;
    if (baseToken != order.path[order.path.length - 1]) {
      require(baseBalance > 0, "StopLoss::run: insufficient balance of base token");
      IERC20(baseToken).safeApprove(liquidityRouter, baseBalance);
      uint256[] memory amountsOut = IUniswapV2Router02(liquidityRouter).safeSwapExactTokensForTokens(
        baseBalance,
        order.amountOutMin,
        order.path,
        address(this),
        _deadline
      );
      amountOut = amountsOut[amountsOut.length - 1];
      require(amountOut <= order.amountOut, "StopLoss::run: invalid output amount");
    } else {
      amountOut = baseBalance;
      require(amountOut <= order.amountOut, "StopLoss::run: invalid output amount");
    }
    emit StopLossOrderCompleted(amountOut);
  }
}
