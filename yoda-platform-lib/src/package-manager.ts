import * as glob from 'glob'
import { promisify } from 'util'
import { join, relative } from 'path'
import * as fs from 'fs'
// eslint-disable-next-line no-unused-vars
import { PlatformClient } from './command'

const globAsync = promisify(glob)
const readFileAsync = promisify(fs.readFile)

export interface IInstallOptions {
  packageName?: string
  installName?: string
  installPath?: string
}

export class PackageManager {
  // eslint-disable-next-line no-useless-constructor
  constructor (public client: PlatformClient) {}

  async list () {
    return this.client.jsonCommand('ListPackages', [])
  }

  async path (packageName: string): Promise<string> {
    const data = await this.client.jsonCommand('ListPackages', [ { packageName } ])
    const appHome = data.appHome
    return appHome
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
      return this.client.client.push(this.client.deviceId, file, remotePath)
    }))
    return this.client.jsonCommand('Reload', [packageName])
  }

  async uninstall (packageName: string) {

  }
}
