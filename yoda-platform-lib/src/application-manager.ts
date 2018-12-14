// eslint-disable-next-line no-unused-vars
import { PlatformClient } from './command'

export interface IOpenUrlOptions {
  form?: 'cut' | 'scene'
  preemptive?: boolean
}

export interface ILaunchOptions {
  stopBeforeLaunch?: boolean
}

export class ApplicationManager {
  // eslint-disable-next-line no-useless-constructor
  constructor (public client: PlatformClient) {}

  async openUrl (url: string, options?: IOpenUrlOptions) {
    const args: any[] = [ url ]
    if (options) {
      args.push(options)
    }
    return this.client.jsonCommand('OpenUrl', args)
  }

  async textNlp (text: string) {
    return this.client.jsonCommand('TextNlp', [ text ])
  }

  async launch (packageName: string, options?: ILaunchOptions) {
    const args: any[] = [ packageName ]
    if (options) {
      args.push(options)
    }
    return this.client.jsonCommand('LaunchApp', args)
  }

  async forceStop (packageName: string) {
    return this.client.jsonCommand('ForceStop', [ packageName ])
  }
}
