// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../utils/DFH/Automate.sol";
import "../utils/Curve/IRegistry.sol";
import "../utils/Curve/IGauge.sol";
import "../utils/Curve/IMinter.sol";
import "../utils/Curve/IPlainPool.sol";
import "../utils/Curve/IMetaPool.sol";
import "../utils/Uniswap/IUniswapV2Router02.sol";
import {ERC20Tools} from "../utils/ERC20Tools.sol";

// solhint-disable not-rely-on-time
contract SynthetixUniswapLpRestake is Automate {
  using ERC20Tools for IERC20;

  IGauge public staking;

  address public swapToken;

  uint16 public slippage;

  uint16 public deadline;

  IRegistry internal _registry;

  IERC20 internal _lpToken;

  address internal _pool;

  // solhint-disable-next-line no-empty-blocks
  constructor(address _info) Automate(_info) {}

  function init(
    address _staking,
    address _swapToken,
    uint16 _slippage,
    uint16 _deadline
  ) external initializer {
    staking = IGauge(_staking);
    swapToken = _swapToken;
    slippage = _slippage;
    deadline = _deadline;
    _registry = IRegistry(0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5);
    _lpToken = IERC20(staking.lp_token());
    _pool = _registry.get_pool_from_lp_token(address(_lpToken));
  }

  function deposit() external onlyOwner {
    IGauge _staking = staking; // gas optimisation
    IERC20 stakingToken = IERC20(_staking.lp_token());
    stakingToken.safeApproveAll(address(_staking));
    _staking.deposit(stakingToken.balanceOf(address(this)));
  }

  function refund() external onlyOwner {
    address __owner = owner(); // gas optimisation

    IGauge _staking = staking; // gas optimisation
    _staking.withdraw(_staking.balanceOf(address(this)));
    IERC20 stakingToken = IERC20(_staking.lp_token());
    stakingToken.transfer(__owner, stakingToken.balanceOf(address(this)));

    IMinter _minter = IMinter(staking.minter());
    _minter.mint(address(_staking));
    IERC20 rewardToken = IERC20(_staking.crv_token());
    rewardToken.transfer(__owner, rewardToken.balanceOf(address(this)));
  }

  function _swap(
    address router,
    address[2] memory path,
    uint256 amount,
    uint256 minOut,
    uint256 _deadline
  ) internal returns (uint256) {
    address[] memory _path = new address[](2);
    _path[0] = path[0];
    _path[1] = path[1];

    return IUniswapV2Router02(router).swapExactTokensForTokens(amount, minOut, _path, address(this), _deadline)[1];
  }

  function _addLiquidity(
    address pool,
    uint256 amount,
    uint256 minOut
  ) internal {
    address[8] memory coins = _registry.get_coins(pool);
    uint8 n;
    for (; n < 8; n++) {
      if (coins[n] == swapToken) break;
    }

    if (_registry.get_n_coins(pool) == 3) {
      uint256[3] memory amountIn;
      amountIn[n] = amount;
      IPlainPool(pool).add_liquidity(amountIn, minOut);
    } else {
      uint256[2] memory amountIn;
      amountIn[n] = amount;
      IMetaPool(pool).add_liquidity(amountIn, minOut);
    }
  }

  function run(
    uint256 gasFee,
    uint256 _deadline,
    uint256 swapOutMin,
    uint256 lpOutMin
  ) external bill(gasFee, "CurveGaugeUniswapRestake") {
    IGauge _staking = staking; // gas optimization
    IMinter _minter = IMinter(staking.minter());
    require(_minter.minted(address(this), address(_staking)) > 0, "GaugeUniswapRestake::run: no earned");
    address router = IStorage(info()).getAddress(keccak256("UniswapV2:Contract:Router2"));
    require(router != address(0), "GaugeUniswapRestake::run: uniswap router contract not found");

    _minter.mint(address(staking));
    address rewardToken = _staking.crv_token();
    uint256 rewardAmount = IERC20(rewardToken).balanceOf(address(this));
    IERC20(rewardToken).safeApproveAll(router);

    uint256 amount = _swap(router, [rewardToken, swapToken], rewardAmount, swapOutMin, _deadline);
    _addLiquidity(_pool, amount, lpOutMin);

    _lpToken.safeApproveAll(address(_staking));
    _staking.deposit(_lpToken.balanceOf(address(this)));
  }
}
