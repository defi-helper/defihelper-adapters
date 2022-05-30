import type BigNumber from "bignumber.js";
import type Dayjs from "dayjs";
import type Axios from "axios";
import type Ethers from "ethers";
import type EthersMulticall from "@defihelper/ethers-multicall";
import type * as Uniswap3Core from "@uniswap/sdk-core";
import type * as Uniswap3SDK from "@uniswap/v3-sdk";
import type WavesSigner from "@waves/signer";
import type WavesProviderSeed from "@waves/provider-seed";
import type WavesTransaction from "@waves/waves-transactions";

const commonjsGlobal =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : typeof self !== "undefined"
    ? self
    : ({} as any);

export const env = process.env as {
  DFH_HOST: string;
  CACHE_HOST: string;
  CACHE_AUTH: string;
};
export const bignumber = commonjsGlobal.bignumber as BigNumber.Constructor;
export const dayjs = commonjsGlobal.dayjs as typeof Dayjs;
export const axios = commonjsGlobal.axios as typeof Axios;
export const ethers = commonjsGlobal.ethers as typeof Ethers.ethers;
export const ethersMulticall =
  commonjsGlobal.ethersMulticall as typeof EthersMulticall;
export const uniswap3 = {
  core: commonjsGlobal.uniswap3.core as typeof Uniswap3Core,
  sdk: commonjsGlobal.uniswap3.sdk as typeof Uniswap3SDK,
};
export const wavesSigner =
  commonjsGlobal.wavesSigner as typeof WavesSigner.Signer;
export const wavesSeedProvider =
  commonjsGlobal.wavesSeedProvider as typeof WavesProviderSeed;
export const wavesTransaction =
  commonjsGlobal.wavesTransaction as typeof WavesTransaction;
