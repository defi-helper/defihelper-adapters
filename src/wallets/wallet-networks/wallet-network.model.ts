import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorUpdate } from '@web3-react/types'
import { createDomain } from 'effector-logger'
import { useStore } from 'effector-react'
import { useMemo } from 'react'

import {
  augmentConnectorUpdate,
  createEthereumProvider,
  connectors
} from '~/wallets/common'
import { config } from '~/config'

const networks = new Map<number | undefined, typeof createEthereumProvider>()

;[...config.CHAIN_BINANCE_IDS, ...config.CHAIN_ETHEREUM_IDS].forEach((num) =>
  networks.set(num, createEthereumProvider)
)

export const networkDomain = createDomain('network')

export const activateWalletFx = networkDomain.createEffect({
  name: 'activateWallet',
  handler: async (params: {
    connector: AbstractConnector
    update?: ConnectorUpdate<number>
  }) => {
    const updateData = await params.connector.activate()

    return augmentConnectorUpdate(params.connector, params.update ?? updateData)
  }
})

export const updateWalletFx = networkDomain.createEffect({
  name: 'updateWallet',
  handler: async (params: {
    connector: AbstractConnector
    update: ConnectorUpdate<number>
  }) => {
    return augmentConnectorUpdate(params.connector, params.update)
  }
})

export type WalletStore = ConnectorUpdate<number> & {
  connector?: AbstractConnector
}

export const diactivateWalletFx = networkDomain.createEffect({
  name: 'diactivateWalletFx',
  handler: async () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const { connector } = getNetwork()

    connector?.deactivate()
  }
})

export const $wallet = networkDomain
  .createStore<WalletStore>(
    {
      chainId: config.CHAIN_ETHEREUM_IDS[0],
      account: null,
      provider: window.ethereum,
      connector: connectors.injected
    },
    {
      name: '$wallet'
    }
  )
  .on(activateWalletFx.doneData, (_, payload) => payload)
  .on(updateWalletFx.doneData, (_, payload) => payload)
  .reset(diactivateWalletFx.done)

export const getNetwork = () => {
  const wallet = $wallet.getState()

  const createProvider = networks.get(wallet.chainId)

  return {
    ...wallet,
    networkProvider: createProvider?.(wallet.provider)
  }
}

export const useNetworkProvider = () => {
  const wallet = useStore($wallet)

  return useMemo(() => {
    const createProvider = networks.get(wallet.chainId)

    return {
      ...wallet,
      networkProvider: createProvider?.(wallet.provider)
    }
  }, [wallet])
}
