import * as minimist from 'minimist'
import * as glob from 'glob'
import { promisify } from 'util'
import { join, relative } from 'path'
import * as fs from 'fs'
import * as pick from 'lodash/pick'
// eslint-disable-next-line no-unused-vars
import { PlatformClient, PlatformSelector } from 'yoda-platform-lib'
import { camelCaseKeys } from './util'

const globAsync = promisify(glob)
const readFileAsync = promisify(fs.readFile)

interface IInstallOptions {
  packageName?: string
  installName?: string
  installPath?: string
}

export class PackageManager extends PlatformClient {
  async list () {
    return this.jsonCommand('ListPackages', [])
  }

  async path (packageName: string) {

  }

  async install (packageLocalPath: string, options?: IInstallOptions) {
    const packageJsonStr = await readFileAsync(join(packageLocalPath, 'package.json'), 'utf8')
    const packageJson = JSON.parse(packageJsonStr)
    if (options == null) {
      options = {}
    }
    let packageName = options.packageName
    const installPath = options.installPath || '/opt/apps'
    if (packageName == null) {
      packageName = packageJson.name
    }
    if (packageName == null) {
      throw new Error('Could not determine package name.')
    }
    const installName = options.installName || packageName
    const files = await globAsync(join(packageLocalPath, '**', '*'))
    await Promise.all(files.map(file => {
      const remotePath = join(installPath, installName, relative(packageLocalPath, file))
      return this.client.push(this.deviceId, file, remotePath)
    }))
    return this.jsonCommand('Reload', [packageName])
  }

  async uninstall (packageName: string) {

  }
}

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
    case 'list':
      client.list()
      break
    case 'path':
      client.path(options._[1])
      break
    case 'install':
      client.install(options._[1], options as any)
      break
    case 'uninstall':
      client.uninstall(options._[1])
      break
    default:
      throw new Error(`Unknown command ${options._[0]}`)
  }
}
