import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import Button from '@material-ui/core/Button'

import { paths } from '~/paths'
import { useDialog } from '~/common/dialog'
import { WalletList } from '~/wallets/wallet-list'
import { cutAccount } from '~/common/cut-account'
import { WalletDetail } from '~/wallets/wallet-detail'
import { networkModel } from '~/wallets/wallet-networks'
import { WalletNetworkSwitcher } from '~/wallets/wallet-network-switcher/wallet-network-switcher'

export type MainLayoutProps = unknown

const drawerWidth = 340

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerContainer: {
    overflow: 'auto'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  logo: {
    color: 'inherit',
    textDecoration: 'none'
  },
  actions: {
    marginLeft: 'auto'
  }
}))

export const MainLayout: React.FC<MainLayoutProps> = (props) => {
  const { account } = networkModel.useNetworkProvider()

  const classes = useStyles()

  const history = useHistory()

  const [openWalletList, closeWalletList] = useDialog(WalletList)
  const [openChangeWallet] = useDialog(WalletDetail)

  const handleOpenWalletList = () =>
    openWalletList({ onClick: closeWalletList }).catch((error: Error) =>
      console.error(error.message)
    )

  const handleChangeWallet = () =>
    openChangeWallet({ onChange: handleOpenWalletList }).catch((error: Error) =>
      console.error(error.message)
    )

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography
            className={classes.logo}
            variant="h6"
            noWrap
            component={Link}
            to={paths.main}
          >
            DefiHelper.io
          </Typography>
          <div className={classes.actions}>
            {account ? (
              <Button color="inherit" onClick={handleChangeWallet}>
                {cutAccount(account)}
              </Button>
            ) : (
              <Button color="inherit" onClick={handleOpenWalletList}>
                Connect wallet
              </Button>
            )}
            <WalletNetworkSwitcher />
          </div>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <Toolbar />
        <Container maxWidth="md">
          <Box my={2}>{props.children}</Box>
        </Container>
      </main>
    </div>
  )
}
