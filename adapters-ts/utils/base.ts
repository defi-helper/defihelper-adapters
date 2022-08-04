import { mode, ethers, bignumber } from "../lib";

export class Builder<C, M extends {}> {
  protected parts: { [k in keyof M]: M[k] };

  constructor(def: { [k in keyof M]: M[k] }) {
    this.parts = def;
  }

  part<N extends keyof M>(name: N, v: M[N]) {
    this.parts[name] = v;

    return this;
  }

  build(context: C): M & C {
    return { ...context, ...this.parts };
  }
}

export function debug(msg: string) {
  mode === "prod" || console.debug(msg);
}

export function debugo(obj: Record<string, any>) {
  const prefix = typeof obj._prefix === "string" ? `${obj._prefix}: ` : "";
  const msg = Object.entries(obj)
    .filter(
      ([name, value]) => name !== "_prefix" && typeof value !== "function"
    )
    .map(([name, value]) => {
      let stringifyValue = "";
      if (
        Array.isArray(value) ||
        (typeof value === "object" &&
          value !== null &&
          !(value instanceof ethers.BigNumber) &&
          !(value instanceof bignumber))
      ) {
        stringifyValue = JSON.stringify(value);
      } else {
        stringifyValue = value.toString();
      }

      return `${name}: "${stringifyValue}"`;
    })
    .join("; ");
  debug(`${prefix}${msg}`);
}
