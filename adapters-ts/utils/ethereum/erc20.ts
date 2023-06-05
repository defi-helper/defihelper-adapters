import * as ethersType from "ethers";
import BigNumber from "bignumber.js";
import type { Provider } from "@defihelper/ethers-multicall";
import * as base from "./base";
import type BN from "bignumber.js";
import { bignumber as bn } from "../../lib";
import abi from "./abi/erc20.json";
import * as ethereum from "./base";
import * as dfh from "../dfh";
import { debug, debugo } from "../base";
import { bridgeWrapperBuild } from "../coingecko";

export { abi };

export const contract = base.contract(abi);

export const multicallContract = base.multicallContract(abi);

export async function info(
  multicall: Provider,
  address: string,
  options = ethereum.defaultOptions()
) {
  const token = multicallContract(address);
  const [name, symbol, decimals, totalSupply] = await multicall.all(
    [token.name(), token.symbol(), token.decimals(), token.totalSupply()],
    { blockTag: options.blockNumber }
  );

  return {
    name,
    symbol,
    decimals: decimals.toString(),
    totalSupply: totalSupply.toString(),
  };
}

export type TokenAmountValue = BigNumber | string | number;

export class Token {
  constructor(
    public readonly name: string,
    public readonly symbol: string,
    public readonly decimals: number
  ) {}

  connect(contract: ethereum.Contract) {
    return ConnectedToken.fromToken(this, contract);
  }

  amountInt(value: TokenAmountValue) {
    return TokenAmount.fromInt(this, value);
  }

  amountFloat(value: TokenAmountValue) {
    return TokenAmount.fromFloat(this, value);
  }
}

export class ConnectedToken extends Token {
  static fromToken(
    { name, symbol, decimals }: Token,
    contract: ethereum.Contract
  ) {
    return new ConnectedToken(name, symbol, decimals, contract);
  }

  static async fromContract(contract: ethereum.Contract) {
    const multicall = await contract.node.multicall;
    const [name, symbol, decimals] = await multicall.all([
      contract.multicall.name(),
      contract.multicall.symbol(),
      contract.multicall.decimals(),
    ]);

    return new ConnectedToken(
      name,
      symbol,
      Number(decimals.toString()),
      contract
    );
  }

  static fromAddress(node: ethereum.Node, address: string) {
    return ConnectedToken.fromContract(node.contract(abi, address));
  }

  constructor(
    name: string,
    symbol: string,
    decimals: number,
    public readonly contract: ethereum.Contract
  ) {
    super(name, symbol, decimals);
  }

  sign(signer: ethereum.Signer) {
    return new SignedToken(
      this.name,
      this.symbol,
      this.decimals,
      this.contract.sign(signer)
    );
  }

  get address() {
    return this.contract.contract.address;
  }

  async balanceOf(address: string) {
    return TokenAmount.fromInt(
      this,
      await this.contract.contract
        .balanceOf(address, { blockTag: this.contract.node.blockNumber })
        .then((v: ethersType.BigNumber) => v.toString())
    );
  }

  async allowance(spender: string, recipient: string) {
    return TokenAmount.fromInt(
      this,
      await this.contract.contract
        .allowance(spender, recipient, {
          blockTag: this.contract.node.blockNumber,
        })
        .then((v: ethersType.BigNumber) => v.toString())
    );
  }
}

export class SignedToken extends ConnectedToken {
  static async fromAddress(signer: ethereum.Signer, address: string) {
    const token = await ConnectedToken.fromContract(
      signer.contract(abi, address)
    );
    return token.sign(signer);
  }

  constructor(
    name: string,
    symbol: string,
    decimals: number,
    public readonly contract: ethereum.SignedContract
  ) {
    super(name, symbol, decimals, contract);
  }

  async approve(recipient: string, value: TokenAmount | string | number) {
    return this.contract.contract.approve(
      recipient,
      value instanceof TokenAmount ? value.toFixed() : `${value}`
    );
  }

  async approveMax(recipient: string) {
    return this.approve(recipient, new bn(2).pow(256).minus(1).toFixed(0));
  }
}

export class TokenAmount {
  static fromFloat(token: Token, value: TokenAmountValue) {
    return new TokenAmount(
      token,
      new BigNumber(value).multipliedBy(`1e${token.decimals}`)
    );
  }

  static fromInt(token: Token, value: TokenAmountValue) {
    return new TokenAmount(token, value);
  }

  public readonly value: BigNumber;

  constructor(
    public readonly token: Token,
    value: TokenAmountValue // Stored int value
  ) {
    this.value = new BigNumber(value);
  }

  get float() {
    return this.value.div(`1e${this.token.decimals}`);
  }

  get int() {
    return this.value;
  }

  gt(amount: TokenAmount) {
    return this.int.gt(amount.int);
  }

  gte(amount: TokenAmount) {
    return this.int.gte(amount.int);
  }

  lt(amount: TokenAmount) {
    return this.int.lt(amount.int);
  }

  lte(amount: TokenAmount) {
    return this.int.lte(amount.int);
  }

  eq(amount: TokenAmount) {
    return this.int.eq(amount.int);
  }

  plus(amount: TokenAmount) {
    return TokenAmount.fromInt(this.token, this.int.plus(amount.int));
  }

  minus(amount: TokenAmount) {
    return TokenAmount.fromInt(this.token, this.int.minus(amount.int));
  }

  toString() {
    return this.float.toString(10);
  }

  toFixed() {
    return this.int.toFixed(0);
  }
}

export async function approveAll(
  erc20: ethersType.Contract,
  owner: string,
  spender: string,
  value: BN | number | string
): Promise<ethersType.ContractTransaction | null> {
  const allowance = await erc20.allowance(owner, spender).then(base.toBN);
  if (new bn(allowance).isGreaterThanOrEqualTo(value)) return null;
  if (new bn(allowance).isGreaterThan(0)) {
    await erc20
      .approve(spender, "0")
      .then((tx: ethersType.ContractTransaction) => tx.wait());
  }

  return erc20.approve(spender, new bn(2).pow(256).minus(1).toFixed(0));
}

export const useBalanceOf =
  ({ node, account }: { node: ethereum.Node; account: string }) =>
  async (tokenAddress: string) => {
    debugo({ _prefix: "balanceOf", account, tokenAddress });
    if (tokenAddress === "0x0000000000000000000000000000000000000000") {
      return node.provider
        .getBalance(account)
        .then((v) => new bn(v.toString()).div("1e18").toString());
    }

    const token = await ConnectedToken.fromAddress(node, tokenAddress);
    const balance = await token.balanceOf(account);
    debugo({
      _prefix: "balanceOf",
      balance,
    });

    return balance.toString();
  };

export const useIsApproved =
  ({
    node,
    spender,
    recipient,
  }: {
    node: ethereum.Node;
    spender: string;
    recipient: string;
  }) =>
  async (tokenAddress: string, amount: string) => {
    debugo({ _prefix: "isApproved", spender, recipient, tokenAddress, amount });
    const token = await ConnectedToken.fromAddress(node, tokenAddress);
    const tokenAmount = token.amountFloat(amount);
    if (tokenAmount.int.lte(0)) return new Error("Invalid amount");

    const allowance = await token.allowance(spender, recipient);
    debugo({ _prefix: "isApproved", allowance });

    return allowance.gte(tokenAmount);
  };

export const useApprove =
  ({
    signer,
    spender,
    recipient,
  }: {
    signer: ethereum.Signer;
    spender: string;
    recipient: string;
  }) =>
  async (tokenAddress: string, amount: string) => {
    debugo({ _prefix: "approve", spender, recipient, tokenAddress, amount });
    const token = await SignedToken.fromAddress(signer, tokenAddress);
    const allowance = await token.allowance(spender, recipient);
    debugo({ _prefix: "approve", allowance });
    const targetAmount = token.amountFloat(amount);
    if (targetAmount.int.lte(0)) return new Error("Invalid amount");

    if (allowance.lt(targetAmount)) {
      if (allowance.int.gt(0)) {
        debug("approve: reset allowance value");
        const resetApproveTx = await token.approve(recipient, 0);
        await resetApproveTx.wait();
        debugo({
          _prefix: "approve",
          resetApproveTx: JSON.stringify(resetApproveTx),
        });
      }

      debug("approve: approve max allowance value");
      const approveTx = await token.approveMax(recipient);
      debugo({
        _prefix: "approve",
        approveTx: JSON.stringify(approveTx),
      });
      return { tx: approveTx };
    }

    debug("approve: skip approve");
    return {};
  };

export const usePriceUSD =
  ({ tokenAddress, network }: { tokenAddress: string; network: number }) =>
  async () => {
    debugo({
      _prefix: "usePriceUSD",
      tokenAddress,
      network,
    });
    const priceFeed = bridgeWrapperBuild(
      await dfh.getPriceFeeds(network),
      "latest",
      { timestamp: 0 },
      network
    );
    return priceFeed(tokenAddress).then((v) => v.toString(10));
  };
