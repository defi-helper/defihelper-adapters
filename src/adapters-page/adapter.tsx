import {
  Button,
  FormControl,
  FormHelperText,
  makeStyles,
  Paper,
  TextareaAutosize,
  TextField
} from '@material-ui/core'
import React, { useMemo } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import ReactJson from 'react-json-view'
import { MainLayout } from '~/layouts'
import adapters from '~/adapters'
import { networkModel } from '~/wallets/wallet-networks'
import { AdapterStep } from '~/adapters-page/adapter-call-step'
import { findMethods } from '~/adapters-page/helper'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    padding: '10px 15px 10px 10px'
  },

  selectEmpty: {
    marginTop: theme.spacing(2)
  },

  fullWidth: {
    width: '100%'
  },

  card: {
    padding: '10px 15px 10px 10px',
    display: 'flex',
    alignItems: 'center',
    margin: '10px 15px 10px 10px'
  }
}))

export const Adapter: React.VFC = () => {
  const classes = useStyles()

  const { networkProvider } = networkModel.useNetworkProvider()

  const [adapter, setAdapter] = React.useState('' as keyof typeof adapters)
  const [implementation, setImplementation] = React.useState('')
  const [contractAddress, setContractAddress] = React.useState('')
  const [additionalConfigs, setAdditionalConfigs] = React.useState('')
  const [callRes, setCallRes] = React.useState({})
  const [callError, setCallError] = React.useState('')

  const handleChangeAdapter = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setAdapter(event.target.value as keyof typeof adapters)
    setImplementation('')
  }

  const handleChangeImplementation = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setImplementation(event.target.value as string)
  }

  const handleChangeContractAddress = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setContractAddress(event.target.value as string)
  }

  const handleChangeAdditionalConfigs = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setAdditionalConfigs(event.target.value as string)
  }

  const adaptersNames = Object.keys(adapters).filter((name) => name !== 'utils')

  const implementations = useMemo(() => {
    const adapterObject = adapters[adapter]
    if (!adapterObject) {
      return []
    }

    return Object.keys(adapterObject)
  }, [adapter])

  const callInit = async () => {
    setCallError('')
    setCallRes({})
    const adapterObject = adapters[adapter] as any
    if (
      !adapterObject ||
      !implementation ||
      !contractAddress ||
      !networkProvider
    ) {
      return
    }

    const signer = networkProvider.getSigner()

    try {
      const res = await adapterObject[implementation as any](
        networkProvider,
        contractAddress,
        additionalConfigs
          ? {
              ...JSON.parse(additionalConfigs),
              signer
            }
          : { signer }
      )

      if (res instanceof Error) {
        console.error(res)
        setCallError(res.message.toString())
        return
      }

      setCallRes(JSON.stringify(res) === '{}' ? { res: res.toString() } : res)
    } catch (e) {
      console.error(e)
      setCallError(e.message)
    }
  }

  return (
    <MainLayout>
      <Paper className={classes.card}>
        <div className={classes.formControl}>
          <Select
            value={adapter}
            onChange={handleChangeAdapter}
            className={classes.fullWidth}
          >
            {adaptersNames.map((adapterId) => (
              <MenuItem value={adapterId}>{adapterId}</MenuItem>
            ))}
          </Select>
          <FormHelperText>Adapter</FormHelperText>
          <Select
            value={implementation}
            onChange={handleChangeImplementation}
            className={classes.fullWidth}
          >
            {implementations.map((implementationName) => (
              <MenuItem value={implementationName}>
                {implementationName}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Implementation</FormHelperText>
          <TextField
            value={contractAddress}
            onChange={handleChangeContractAddress}
            className={classes.fullWidth}
          />
          <FormHelperText>Contract Address</FormHelperText>
          <TextareaAutosize
            value={additionalConfigs}
            onChange={handleChangeAdditionalConfigs}
            minRows={3}
          />
          <FormHelperText>Options (JSON)</FormHelperText>
          <Button onClick={callInit} variant="contained" color="primary">
            Call
          </Button>
        </div>
        <div className={`${classes.formControl} ${classes.fullWidth}`}>
          <ReactJson src={callRes} />
          {callError ? (
            <TextareaAutosize
              style={{ width: '100%' }}
              value={callError}
              minRows={1}
              maxRows={3}
            />
          ) : null}
        </div>
      </Paper>
      {findMethods(callRes).length > 0 ? (
        <AdapterStep resultObject={callRes} />
      ) : null}
    </MainLayout>
  )
}
