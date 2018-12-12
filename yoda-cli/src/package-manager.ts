import * as minimist from 'minimist'
import * as pick from 'lodash/pick'
import { PlatformSelector, PackageManager } from 'yoda-platform-lib'
import { camelCaseKeys, printResult } from './util'

export async function main (argv: string[]) {
  const devices = await PlatformSelector.listDevices()
  if (devices.length === 0) {
    throw new Error('No device connected')
  }
  const client = new PackageManager(devices[0].id, {
    service: 'com.rokid.AmsExport',
    objectPath: '/rokid/openvoice',
    interface: 'rokid.openvoice.AmsExport'
  })
  await client.init()
  let options: any = minimist(argv)
  options = Object.assign(camelCaseKeys(options), pick(options, '_', '__'))
  switch (options._[0]) {
    case 'list': {
      const result = await client.list()
      printResult(result)
      break
    }
    case 'path': {
      const result = await client.path(options._[1])
      console.log(result)
      break
    }
    case 'install': {
      const result = await client.install(options._[1], options as any)
      printResult(result)
      break
    }
    case 'uninstall': {
      const result = await client.uninstall(options._[1])
      printResult(result)
      break
    }
    default:
      throw new Error(`Unknown command ${options._[0]}`)
  }
}
