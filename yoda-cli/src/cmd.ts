// eslint-disable-next-line no-unused-vars
import { IDBusConnection } from 'yoda-platform-lib'
import { getClient } from './util'

export default async function cmd (command: string, args: any[], connection: IDBusConnection, serial?: string) {
  const client = await getClient(connection, serial)
  return client.jsonCommand(command, args)
}
