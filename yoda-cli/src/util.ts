import { inspect } from 'util'
// eslint-disable-next-line no-unused-vars
import { PlatformSelector, PackageManager, IDBusConnection } from 'yoda-platform-lib'

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

export async function getClient (connection: IDBusConnection, serial?: string) {
  const devices = await PlatformSelector.listDevices()
  if (devices.length === 0) {
    throw new Error('No device connected')
  }
  const client = new PackageManager(devices[0].id, connection)
  await client.init()
  return client
}

export function printResult (data: any, command?: string) {
  if (data.ok !== true) {
    console.error(`Unexpected error on requesting YodaRuntime`, command || '')
    console.error(data.message || 'No message.', '\n', data.stack || '')
    process.exit(1)
  }
  console.log(inspect(data.result, false, null, true))
}
