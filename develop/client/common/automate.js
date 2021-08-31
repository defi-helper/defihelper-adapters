import { ethers } from "ethers";

export class Automate {
  constructor(protocol, contract) {
    this.protocol = protocol;
    this.contract = contract;
  }

  static fromString(str) {
    const [protocol, ...path] = str.split('/');

    return new Automate(protocol, path.join('/'));
  }

  toString() {
    return `${this.protocol}/${this.contract}`;
  }
}

export async function ethereumList() {
  return fetch('/automates/ethereum')
    .then((res) => res.json())
    .then((automates) => automates.map(Automate.fromString));
}

export async function load(automate) {
  return fetch(`/automates/ethereum/${automate}`)
    .then((res) => res.json())
    .then(({ contractName, abi, bytecode, linkReferences }) => ({ contractName, bytecode, abi, linkReferences }));
}

export function linkLibraries({ bytecode, linkReferences }, libraries) {
  Object.keys(linkReferences).forEach((fileName) => {
    Object.keys(linkReferences[fileName]).forEach((contractName) => {
      if (!libraries.hasOwnProperty(contractName)) {
        throw new Error(`Missing link library name ${contractName}`);
      }
      const address = ethers.utils.getAddress(libraries[contractName]).toLowerCase().slice(2);
      linkReferences[fileName][contractName].forEach(({ start: byteStart, length: byteLength }) => {
        const start = 2 + byteStart * 2;
        const length = byteLength * 2;
        bytecode = bytecode
          .slice(0, start)
          .concat(address)
          .concat(bytecode.slice(start + length, bytecode.length));
      });
    });
  });

  return bytecode;
}
