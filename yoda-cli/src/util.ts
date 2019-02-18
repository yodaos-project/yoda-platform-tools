import * as fs from 'fs'
import * as path from 'path'
import { inspect } from 'util'
import { Signale } from 'signale'
// eslint-disable-next-line no-unused-vars
import { PlatformSelector, IDBusConnection, PlatformClient } from 'yoda-platform-lib'

export const signale = new Signale({
  types: {
    verbose: {
      badge: '> ',
      color: 'grey',
      label: 'verbose'
    }
  }
})

export function omit (object: object, ...keys: string[]) {
  if (object == null) {
    return object
  }
  var ret = {}
  Object.keys(object).forEach(key => {
    if (keys.indexOf(key) >= 0) {
      return
    }
    const desc = Object.getOwnPropertyDescriptor(object, key)
    if (desc == null) {
      return
    }
    Object.defineProperty(ret, key, desc)
  })
  return ret
}

export function any <T> (arr: T[], ...items: T[]) {
  for (const item of items) {
    const include = arr.indexOf(item) >= 0
    if (include) {
      return true
    }
  }
  return false
}

export async function getClient (connection: IDBusConnection, serial?: string) {
  const devices: any[] = await PlatformSelector.listDevices()
  let device: any
  if (serial) {
    device = devices.find(it => {
      return it.id === serial
    })
  } else {
    device = devices[0]
  }
  if (device == null) {
    throw new Error('No requested device connected')
  }
  const client = new PlatformClient(device.id, connection)
  await client.init()
  return client
}

export function printResult (data: any, command?: string) {
  if (data instanceof Error) {
    signale.error(...[command, data].filter(it => it !== undefined))
    return
  }
  signale.success(command, '\n' + inspect(data, { colors: true, depth: null }))
}

export function mkdirp (dir: string, callback: (error: Error | null) => void) {
  fs.mkdir(dir, (err) => {
    if (err == null) {
      return callback(null)
    }
    if (err.code === 'ENOENT') {
      mkdirp(path.dirname(dir), (err) => {
        if (err) {
          return callback(err)
        }
        mkdirp(dir, callback)
      }) /** mkdirp */
      return
    }
    fs.stat(dir, (err, stat) => {
      if (err) {
        return callback(err)
      }
      if (!stat.isDirectory()) {
        var eexist = new Error(`Target ${dir} exists yet is not a directory`)
        ;(eexist as any).path = dir
        ;(eexist as any).code = 'EEXIST'
        return callback(eexist)
      }
      return callback(null)
    }) /** fs.stat */
  }) /** fs.mkdir */
}

export function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
