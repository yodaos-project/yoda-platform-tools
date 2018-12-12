import * as minimist from 'minimist'
// eslint-disable-next-line no-unused-vars
import { IDBusConnection, PlatformClient, PlatformSelector } from 'yoda-platform-lib'
import { omit, printResult } from './util'

export interface IConnection {
  type: 'dbus'
}

export type TConnection = IConnection | IDBusConnection

export function isDBusConnection (connection: TConnection): connection is IDBusConnection {
  if ((connection as IConnection).type === 'dbus') {
    return true
  }
  return false
}

export async function main (connection: IConnection, args: string[]) {
  const devices = await PlatformSelector.listDevices()
  if (devices.length === 0) {
    throw new Error('No device connected')
  }
  if (!isDBusConnection(connection)) {
    throw new Error('Not supported connection')
  }
  const options = minimist(args)
  const client = new PlatformClient(devices[0].id, connection)
  await client.init()
  const command = options._[0]
  const arg = omit(options, '_', '__')
  const commandArgs: any[] = options._.slice(1)
  if (Object.keys(arg).length > 0) {
    commandArgs.push(arg)
  }
  const result = await client.jsonCommand(command, commandArgs)
  printResult(result.result)
}
