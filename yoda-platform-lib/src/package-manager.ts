import * as glob from 'glob'
import { promisify } from 'util'
import { join, relative } from 'path'
import * as fs from 'fs'
// eslint-disable-next-line no-unused-vars
import { PlatformClient } from './command'

const globAsync = promisify(glob)
const readFileAsync = promisify(fs.readFile)
const statAsync = promisify(fs.stat)

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

  async resolvePackage (packageLocalPath: string) {
    const packageJsonStr = await readFileAsync(join(packageLocalPath, 'package.json'), 'utf8')
    return JSON.parse(packageJsonStr)
  }

  async install (packageLocalPath: string, options?: IInstallOptions) {
    if (options == null) {
      options = {}
    }
    const packageJson = await this.resolvePackage(packageLocalPath)
    const installPath = options.installPath || '/opt/apps'
    let packageName = options.packageName
    if (packageName == null) {
      packageName = packageJson.name
    }
    if (packageName == null) {
      throw new Error('Could not determine package name.')
    }
    const installName = options.installName || packageName
    let files: string[]
    if (Array.isArray(packageJson.files)) {
      const res = await Promise.all(
        (packageJson.files as string[]).map(it => globAsync(join(packageLocalPath, it)))
      )
      files = res.reduce((accu, it) => accu.concat(it), [])
    } else {
      files = await globAsync(join(packageLocalPath, '**', '*'))
    }
    const packageJsonPath = join(packageLocalPath, 'package.json')
    if (files.indexOf(packageJsonPath) < 0) {
      files = files.concat(packageJsonPath)
    }
    await Promise.all(files.map(async file => {
      const stat = await statAsync(file)
      const remotePath = join(installPath, installName, relative(packageLocalPath, file))
      await this.client.client.shell(this.client.deviceId, `rm -rf ${remotePath}`)
        .catch(() => {})
      switch (true) {
        case stat.isDirectory(): {
          console.log(`installing directory(${file})`)
          await this.client.client.shell(this.client.deviceId, `mkdir -p ${remotePath}`)
            .catch((err: Error) => {
              throw new Error(`Failed to install directory(${file}: ${err.message}`)
            })
          break
        }
        case stat.isFile(): {
          console.log(`installing file(${file})`)
          await this.client.client.push(this.client.deviceId, file, remotePath)
            .catch((err: Error) => {
              throw new Error(`Failed to install file(${file}: ${err.message}`)
            })
          break
        }
        default: {
          console.log(`Unknown file type '${file}'`)
        }
      }
    }))
    return this.client.jsonCommand('Reload', [packageName])
  }

  async uninstall (packageName: string) {

  }
}
