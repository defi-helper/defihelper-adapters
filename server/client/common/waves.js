import { useState, useEffect } from 'react';

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

export function useProvider() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const onReloadProvider = () => window.WavesKeeper.initialPromise.then(setProvider);

  const onReloadSigner = () => provider.publicState().then(setSigner);

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
