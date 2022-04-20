import type {
  Contract,
  providers,
  Signer,
  BigNumber as EthersBN,
  ContractTransaction,
} from "ethers";
import BN from "bignumber.js";
import { ethers } from "../../../../lib";
import { toBN } from "../../base";
import poolABI from "./abi/pool.json";

export class Pool {
  public static MIN_TICK: number = -887272;

  public static MAX_TICK: number = -Pool.MIN_TICK;

  public readonly contract: Contract;

  static nearestUsableTick(tick: BN, tickSpacing: BN) {
    if (tick.lt(Pool.MIN_TICK) || tick.gt(Pool.MAX_TICK)) {
      throw new Error(`Invalid tick "${tick.toString(10)}"`);
    }
    if (tickSpacing.lte(0)) {
      throw new Error(`Invalid tick spacing "${tickSpacing.toString(10)}"`);
    }

    const rounded = tick
      .div(tickSpacing)
      .integerValue(BN.ROUND_HALF_UP)
      .multipliedBy(tickSpacing);

    if (rounded.lt(Pool.MIN_TICK)) return rounded.plus(tickSpacing);
    else if (rounded.gt(Pool.MAX_TICK)) return rounded.minus(tickSpacing);
    else return rounded;
  }

  constructor(address: string, provider: providers.Provider | Signer) {
    this.contract = new ethers.Contract(address, poolABI, provider);
  }

  // token1Price = priceFloat * 10 ^ (token1.decimals - token0.decimals)
  async init(token1Price: BN) {
    const { unlocked } = await this.contract.slot0();
    if (unlocked) {
      throw new Error(`Pool "${this.contract.address}" already initialized`);
    }

    return this.contract.initialize(
      token1Price.sqrt().multipliedBy(toBN(2).pow(96)).toFixed(0)
    );
  }

  async position(owner: string, tickLower: BN, tickUpper: BN) {

  }

  async buy(recipient: string, amount: BN, sqrtPriceLimitX96: BN) {
    const { amount0, amount1 } = await this.contract.swap(
      recipient,
      true,
      amount.toFixed(0),
      sqrtPriceLimitX96,
      "0x00"
    );

    return { amount0: toBN(amount0), amount1: toBN(amount1) };
  }

  async sell(recipient: string, amount: BN, sqrtPriceLimitX96: BN) {
    const { amount0, amount1 } = await this.contract.swap(
      recipient,
      false,
      amount.toFixed(0),
      sqrtPriceLimitX96,
      "0x00"
    );

    return { amount0: toBN(amount0), amount1: toBN(amount1) };
  }

  async mint(recipient: string, ticksDown: BN, ticksUp: BN, amount: BN) {
    const [tick, tickSpacing] = await Promise.all([
      this.contract.slot0().then(({ tick }: { tick: EthersBN }) => toBN(tick)),
      this.contract.tickSpacing().then(toBN),
    ]);

    const nearestUsableTick = Pool.nearestUsableTick(tick, tickSpacing);

    const receipt = await this.contract
      .mint(
        recipient,
        nearestUsableTick.minus(tickSpacing.multipliedBy(ticksDown)).toFixed(0),
        nearestUsableTick.plus(tickSpacing.multipliedBy(ticksUp)).toFixed(0),
        amount.toFixed(0),
        "0x00"
      )
      .then((tx: ContractTransaction) => tx.wait());

    console.log(receipt.logs[0]);
    //return { amount0: toBN(amount0), amount1: toBN(amount1) };
  }

  async burn(tickLower: BN, tickUpper: BN, amount: BN) {
    const { amount0, amount1 } = await this.contract.burn(
      tickLower.toFixed(0),
      tickUpper.toFixed(0),
      amount.toFixed(0),
      "0x00"
    );

    return { amount0: toBN(amount0), amount1: toBN(amount1) };
  }

  async buyPrice(amount: BN) {
    const sqrtPriceX96 = await this.contract
      .slot0()
      .then(({ sqrtPriceX96 }: { sqrtPriceX96: EthersBN }) =>
        toBN(sqrtPriceX96)
      );

    return sqrtPriceX96.pow(2).div(toBN(2).pow(192)).multipliedBy(amount);
  }

  async sellPrice(amount: BN) {
    const sqrtPriceX96 = await this.contract
      .slot0()
      .then(({ sqrtPriceX96 }: { sqrtPriceX96: EthersBN }) =>
        toBN(sqrtPriceX96)
      );

    return toBN(2).pow(192).div(sqrtPriceX96.pow(2)).multipliedBy(amount);
  }
}
