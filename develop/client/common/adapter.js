import dayjs from 'dayjs';
import { BigNumber } from 'bignumber.js';
import axios from 'axios';
import { ethers } from 'ethers';

// For adapters
window.dayjs = dayjs;
window.bignumber = BigNumber;
window.axios = axios;
window.ethers = ethers;

export async function list() {
  return fetch('/').then((res) => res.json());
}

const adapters = {};

export function load(name) {
  if (adapters[name]) return adapters[name];

  window.module = {
    exports: new Error('AdapterFn not loaded'),
  };
  return import(`/${name}.js`).then(() => {
    adapters[name] = window.module.exports;
    return window.module.exports;
  });
}
