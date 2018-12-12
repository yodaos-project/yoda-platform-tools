import * as glob from 'glob'
import { promisify } from 'util'
import { join, relative } from 'path'
import * as fs from 'fs'
import { PlatformClient } from './command'

const globAsync = promisify(glob)
const readFileAsync = promisify(fs.readFile)

export interface IInstallOptions {
  packageName?: string
  installName?: string
  installPath?: string
}

export class PackageManager extends PlatformClient {
  async list () {
    return this.jsonCommand('ListPackages', [])
  }

  async path (packageName: string): Promise<string> {
    const data = await this.jsonCommand('ListPackages', [ { packageName } ])
    if (data.ok !== true) {
      const error = new Error('Unsuccessful command `ListPackages`')
      ;(error as any).data = data
      throw error
    }
    const appHome = data.result.appHome
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
      return this.client.push(this.deviceId, file, remotePath)
    }))
    return this.jsonCommand('Reload', [packageName])
  }

  async uninstall (packageName: string) {

  }
}
