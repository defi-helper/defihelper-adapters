import { useState, useEffect } from 'react';
import { Signer } from '@waves/signer';
import { ProviderKeeper } from '@defihelper/provider-keeper';

let address;
export const createWavesProvider = async () => {
  if (!address) {
    const state = await window.WavesKeeper.auth({
      data: 'Auth on site',
    });
    address = state.address;
  }
  return window.WavesKeeper;
};

/**
 *
 * @returns {[window.WavesKeeper, Signer]}
 */
export function useProvider() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const onReloadProvider = () => window.WavesKeeper.initialPromise.then(setProvider);

  const onReloadSigner = () => {
    provider.publicState().then(async ({ network: { server } }) => {
      const signer = new Signer({ NODE_URL: server });
      signer.setProvider(new ProviderKeeper());
      signer.on('login', () => setSigner(signer));
    });
  };

  useEffect(() => {
    if (!provider) return;
    onReloadSigner();
  }, [provider]);

  useEffect(() => {
    window.WavesKeeper.on('update', onReloadProvider);
    onReloadProvider();
  }, []);

  return [provider, signer];
}
