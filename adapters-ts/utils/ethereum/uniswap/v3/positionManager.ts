import type ethersType from "ethers";
import uniswap3Type from "@uniswap/v3-sdk";
import { uniswap3 } from "../../../../lib";
import * as ethereum from "../../../ethereum/base";
import * as erc20 from "../../../ethereum/erc20";
import positionManagerABI from "./abi/nonfungiblePositionManager.json";
import factoryABI from "./abi/factory.json";
import { getPool } from "./pool";

export { positionManagerABI };

export interface PositionResponse {
  nonce: ethersType.BigNumber;
  operator: string;
  token0: string;
  token1: string;
  fee: ethersType.BigNumber;
  tickLower: ethersType.BigNumber;
  tickUpper: ethersType.BigNumber;
  liquidity: ethersType.BigNumber;
  feeGrowthInside0LastX128: ethersType.BigNumber;
  feeGrowthInside1LastX128: ethersType.BigNumber;
  tokensOwed0: ethersType.BigNumber;
  tokensOwed1: ethersType.BigNumber;
}

const MAX_UINT128 = "340282366920938463463374607431768211455";

export class Position {
  static fromResponse(
    manager: ethereum.Contract,
    id: number,
    poolAddress: string,
    owner: string,
    r: PositionResponse
  ) {
    return new Position(
      id,
      poolAddress,
      owner,
      Number(r.nonce.toString()),
      r.operator,
      r.token0,
      r.token1,
      Number(r.fee.toString()),
      Number(r.tickLower.toString()),
      Number(r.tickUpper.toString()),
      r.liquidity.toString(),
      r.feeGrowthInside0LastX128.toString(),
      r.feeGrowthInside1LastX128.toString(),
      r.tokensOwed0.toString(),
      r.tokensOwed1.toString(),
      manager
    );
  }

  public readonly poolSDK = new Promise<uniswap3Type.Pool>((resolve) => {
    Promise.all([this.manager.node.chainId, this.manager.node.multicall])
      .then(([chainId, multicall]) =>
        getPool(chainId, multicall, this.poolAddress)
      )
      .then(resolve);
  });

  public readonly positionSDK = new Promise<uniswap3Type.Position>(
    (resolve) => {
      this.poolSDK.then((pool) =>
        resolve(
          new uniswap3.sdk.Position({
            pool,
            liquidity: this.liquidity,
            tickLower: this.tickLower,
            tickUpper: this.tickUpper,
          })
        )
      );
    }
  );

  public readonly token0 = new Promise<erc20.ConnectedToken>((resolve) =>
    erc20.ConnectedToken.fromAddress(
      this.manager.node,
      this.token0Address
    ).then(resolve)
  );

  public readonly token1 = new Promise<erc20.ConnectedToken>((resolve) =>
    erc20.ConnectedToken.fromAddress(
      this.manager.node,
      this.token1Address
    ).then(resolve)
  );

  constructor(
    public readonly id: number,
    public readonly poolAddress: string,
    public readonly owner: string,
    public readonly nonce: number,
    public readonly operator: string,
    public readonly token0Address: string,
    public readonly token1Address: string,
    public readonly fee: number,
    public readonly tickLower: number,
    public readonly tickUpper: number,
    public readonly liquidity: string,
    public readonly feeGrowthInside0LastX128: string,
    public readonly feeGrowthInside1LastX128: string,
    public readonly tokensOwed0: string,
    public readonly tokensOwed1: string,
    public readonly manager: ethereum.Contract
  ) {}

  inPool({ token0, token1, fee }: uniswap3Type.Pool) {
    return (
      this.token0Address === token0.address &&
      this.token1Address === token1.address &&
      this.fee === Number(fee.toFixed())
    );
  }

  async staked() {
    const [token0, token1, { amount0, amount1 }] = await Promise.all([
      this.token0,
      this.token1,
      this.positionSDK,
    ]);

    return {
      amount0: token0.amountFloat(amount0.toFixed()),
      amount1: token1.amountFloat(amount1.toFixed()),
    };
  }

  async earned() {
    const [token0, token1] = await Promise.all([this.token0, this.token1]);
    const { amount0, amount1 } = await this.manager.contract.callStatic.collect(
      {
        tokenId: this.id,
        recipient: this.owner,
        amount0Max: MAX_UINT128,
        amount1Max: MAX_UINT128,
      }
    );

    return {
      amount0: token0.amountInt(amount0.toString()),
      amount1: token1.amountInt(amount1.toString()),
    };
  }
}

export class PositionManager {
  static async fromContract(contract: ethereum.Contract) {
    return new PositionManager(
      contract,
      contract.node.contract(factoryABI, await contract.contract.factory())
    );
  }

  static fromAddress(node: ethereum.Node, address: string) {
    return PositionManager.fromContract(
      node.contract(positionManagerABI, address)
    );
  }

  constructor(
    public readonly contract: ethereum.Contract,
    public readonly factory: ethereum.Contract
  ) {}

  balanceOf(owner: string): Promise<number> {
    return this.contract.contract
      .balanceOf(owner)
      .then((v: ethersType.BigNumber) => Number(v.toString()));
  }

  async tokensIdList(owner: string) {
    const [tokensCount, multicall] = await Promise.all([
      this.balanceOf(owner),
      this.contract.node.multicall,
    ]);
    const indexes = Array.from(new Array(tokensCount).keys());
    const tokensId: ethersType.BigNumber[] = await multicall.all(
      indexes.map((index) =>
        this.contract.multicall.tokenOfOwnerByIndex(owner, index)
      )
    );

    return tokensId.map((tokenId) => Number(tokenId.toString()));
  }

  async positions(owner: string) {
    const [tokensId, multicall] = await Promise.all([
      this.tokensIdList(owner),
      this.contract.node.multicall,
    ]);
    const positions: PositionResponse[] = await multicall.all(
      tokensId.map((tokenId) => this.contract.multicall.positions(tokenId))
    );
    const pools: string[] = await multicall.all(
      positions.map(({ token0, token1, fee }) =>
        this.factory.multicall.getPool(token0, token1, fee.toString())
      )
    );

    return positions.reduce<Position[]>(
      (res, positionResponse, i) => [
        ...res,
        Position.fromResponse(
          this.contract,
          tokensId[i],
          pools[i],
          owner,
          positionResponse
        ),
      ],
      []
    );
  }
}