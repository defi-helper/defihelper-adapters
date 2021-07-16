import { useNetwork } from './wallets/wallet-networks'
import { Router } from './router'
import { DialogProvider } from './common/dialog'
import { NotificationsProvider } from './notifications'

export const App: React.VFC = () => {
  useNetwork()

  return (
    <DialogProvider>
      <NotificationsProvider maxItems={6}>
        <Router />
      </NotificationsProvider>
    </DialogProvider>
  )
}
