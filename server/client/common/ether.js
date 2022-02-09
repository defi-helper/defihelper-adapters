import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

if (window.ethereum === undefined) {
  throw new Error('MetaMask not found');
}

/**
 *
 * @returns {[ethers.providers.Web3Provider, ethers.providers.JsonRpcSigner]}
 */
export function useProvider() {
  ethereum.request({ method: 'eth_requestAccounts' });

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const onReloadProvider = () => setProvider(new ethers.providers.Web3Provider(window.ethereum));

  useEffect(() => {
    if (provider === null) return;
    setSigner(provider.getSigner());
  }, [provider]);

  useEffect(() => {
    window.ethereum.on('chainChanged', onReloadProvider);
    onReloadProvider();
  }, []);

  return [provider, signer];
}
