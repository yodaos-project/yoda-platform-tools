// eslint-disable-next-line no-unused-vars
import { IDBusConnection } from 'yoda-platform-lib'
import { getClient, signale } from './util'

export interface ICommandOptions {
  serial?: string
  verbose?: boolean
}

export default async function cmd (command: string, args: any[], connection: IDBusConnection, options: ICommandOptions) {
  const client = await getClient(connection, options.serial)
  if (options.verbose) {
    signale.verbose(client.generateCommand(command, args))
  }
  return client.jsonCommand(command, args)
}
