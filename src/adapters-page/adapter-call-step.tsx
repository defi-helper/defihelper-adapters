import {
  Button,
  FormHelperText,
  makeStyles,
  Paper,
  TextareaAutosize
} from '@material-ui/core'
import React, { useMemo } from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ReactJson from 'react-json-view'
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

interface Params {
  resultObject: any
}

export const AdapterStep: React.VFC<Params> = ({ resultObject }: Params) => {
  const classes = useStyles()

  const [selectedMethodPath, setSelectedMethodPath] = React.useState('')
  const [selectedArguments, setSelectedArguments] = React.useState('[]')
  const [callRes, setCallRes] = React.useState({})
  const [callError, setCallError] = React.useState('')

  const handleChangeMethodPath = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedMethodPath(event.target.value as string)
  }

  const handleChangeArguments = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedArguments(event.target.value as string)
  }

  const methods = useMemo(() => findMethods(resultObject), [resultObject])

  const call = async () => {
    setCallError('')
    setCallRes({})
    const method = methods.find((m) => m.path === selectedMethodPath)
    if (!method) {
      return
    }

    let args: any[]
    try {
      args = JSON.parse(selectedArguments)
    } catch {
      args = []
    }

    try {
      const res = method.fn(...args)
      if (res.then) {
        await res.then((promiseRes: any) => {
          if (promiseRes instanceof Error) {
            setCallError(promiseRes.message)
            console.error(promiseRes)
            return
          }

          setCallRes(
            JSON.stringify(promiseRes) === '{}'
              ? {
                  res: promiseRes.toString()
                }
              : {
                  res: promiseRes
                }
          )
        })
      } else {
        if (res instanceof Error) {
          setCallError(res.message)
          console.error(res)
          return
        }

        setCallRes(JSON.stringify(res) === '{}' ? { res: res.toString() } : res)
      }
    } catch (e) {
      setCallError(e.toString())
      console.error(e)
    }
  }

  const stringifiedMethod: string = useMemo(() => {
    const method = methods.find((m) => m.path === selectedMethodPath)
    if (!method) {
      return ''
    }

    return method.fn.toString()
  }, [methods, selectedMethodPath])

  return (
    <div>
      <Paper className={classes.card}>
        <div className={classes.formControl}>
          <Select
            value={selectedMethodPath}
            onChange={handleChangeMethodPath}
            className={classes.fullWidth}
          >
            {methods.map((name) => (
              <MenuItem value={name.path}>{name.path}</MenuItem>
            ))}
          </Select>
          <FormHelperText>Methods</FormHelperText>
          <TextareaAutosize
            value={selectedArguments}
            onChange={handleChangeArguments}
            minRows={3}
            className={classes.fullWidth}
          />
          <FormHelperText>Arguments (JSON array)</FormHelperText>
          <Button onClick={call} variant="contained" color="primary">
            Call
          </Button>
        </div>
        <div className={`${classes.formControl} ${classes.fullWidth}`}>
          <TextareaAutosize
            style={{ width: '100%' }}
            value={stringifiedMethod}
            minRows={5}
            maxRows={10}
          />
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
      {callRes && findMethods(callRes).length > 0 ? (
        <AdapterStep resultObject={callRes} />
      ) : null}
    </div>
  )
}
