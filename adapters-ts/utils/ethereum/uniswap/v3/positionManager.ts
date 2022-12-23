import type ethersType from "ethers";
import type uniswap3Type from "@uniswap/v3-sdk";
import type {
  Provider as MulticallProvider,
  Contract as MulticallContract,
} from "@defihelper/ethers-multicall";
import BN from "bignumber.js";
import { ethers, uniswap3 } from "../../../../lib";
import * as ethereum from "../../../ethereum/base";
import * as erc20 from "../../../ethereum/erc20";
import { toBN } from "../../base";
import positionManagerABI from "./abi/nonfungiblePositionManager.json";
import factoryABI from "./abi/factory.json";
import { getPool } from "./pool";

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

export class Position {
  static fromResponse(id: number, r: PositionResponse) {
    return new Position(
      id,
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
      r.tokensOwed1.toString()
    );
  }

  constructor(
    public readonly id: number,
    public readonly nonce: number,
    public readonly operator: string,
    public readonly token0: string,
    public readonly token1: string,
    public readonly fee: number,
    public readonly tickLower: number,
    public readonly tickUpper: number,
    public readonly liquidity: string,
    public readonly feeGrowthInside0LastX128: string,
    public readonly feeGrowthInside1LastX128: string,
    public readonly tokensOwed0: string,
    public readonly tokensOwed1: string
  ) {}

  connect(manager: ethereum.Contract) {
    return ConnectedPosition.fromPosition(this, manager);
  }
}

export class ConnectedPosition extends Position {
  static fromPosition(
    {
      id,
      nonce,
      operator,
      token0,
      token1,
      fee,
      tickLower,
      tickUpper,
      liquidity,
      feeGrowthInside0LastX128,
      feeGrowthInside1LastX128,
      tokensOwed0,
      tokensOwed1,
    }: Position,
    manager: ethereum.Contract
  ) {
    return new ConnectedPosition(
      id,
      nonce,
      operator,
      token0,
      token1,
      fee,
      tickLower,
      tickUpper,
      liquidity,
      feeGrowthInside0LastX128,
      feeGrowthInside1LastX128,
      tokensOwed0,
      tokensOwed1,
      manager
    );
  }

  constructor(
    id: number,
    nonce: number,
    operator: string,
    token0: string,
    token1: string,
    fee: number,
    tickLower: number,
    tickUpper: number,
    liquidity: string,
    feeGrowthInside0LastX128: string,
    feeGrowthInside1LastX128: string,
    tokensOwed0: string,
    tokensOwed1: string,
    public readonly manager: ethereum.Contract
  ) {
    super(
      id,
      nonce,
      operator,
      token0,
      token1,
      fee,
      tickLower,
      tickUpper,
      liquidity,
      feeGrowthInside0LastX128,
      feeGrowthInside1LastX128,
      tokensOwed0,
      tokensOwed1
    );
  }
}

export function isPoolPosition(position: Position, pool: uniswap3Type.Pool) {
  return (
    position.token0 === pool.token0.address &&
    position.token1 === pool.token1.address &&
    position.fee === Number(pool.fee.toFixed())
  );
}

export interface PositionsListOptions {
  pool?: uniswap3Type.Pool;
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

  async positionsInfo(owner: string, options?: PositionsListOptions) {
    const _options = {
      pool: undefined,
      ...options,
    };

    const [tokensId, multicall] = await Promise.all([
      this.tokensIdList(owner),
      this.contract.node.multicall,
    ]);

    const positions: PositionResponse[] = await multicall.all(
      tokensId.map((tokenId) => this.contract.multicall.positions(tokenId))
    );

    return positions.reduce<Position[]>((res, positionResponse, i) => {
      const position = Position.fromResponse(tokensId[i], positionResponse);
      if (_options.pool) {
        if (!isPoolPosition(position, _options.pool)) {
          return res;
        }
      }

      return [...res, position];
    }, []);
  }

  async positions(owner: string, options?: PositionsListOptions) {
    const [positionsInfo, multicall] = await Promise.all([
      this.positionsInfo(owner, options),
      this.contract.node.multicall,
    ]);

    const pools: string[] = await multicall.all(
      positionsInfo.map(({ token0, token1, fee }) =>
        this.factory.multicall.getPool(token0, token1, fee)
      )
    );

    return Promise.all(
      pools.map(async (poolAddress, i) => {
        const pool = await getPool(
          await this.contract.node.chainId,
          multicall,
          poolAddress
        );

        return new uniswap3.sdk.Position({
          pool,
          liquidity: positionsInfo[i].liquidity,
          tickLower: positionsInfo[i].tickLower,
          tickUpper: positionsInfo[i].tickUpper,
        });
      })
    );
  }
}
