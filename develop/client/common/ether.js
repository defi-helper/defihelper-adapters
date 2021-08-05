import { ethers } from 'ethers';

if (window.ethereum === undefined) {
  throw new Error('MetaMask not found');
}

ethereum.request({ method: 'eth_requestAccounts' });

export const provider = new ethers.providers.Web3Provider(window.ethereum);
export const signer = provider.getSigner();
