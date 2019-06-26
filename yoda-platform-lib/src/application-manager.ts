// eslint-disable-next-line no-unused-vars
import { PlatformClient } from './platform-client'

export interface IOpenUrlOptions {
  form?: 'cut' | 'scene'
  preemptive?: boolean
}

export interface ILaunchOptions {
  mode?: string
  type?: string
  stopBeforeLaunch?: boolean
  args?: string[]
  environs?: { [name: string]: string }
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
    return this.client.jsonCommand('TextNLP', [ text ])
  }

  async nlpIntent (text: string, nlp: object, action: object) {
    return this.client.jsonCommand('NLPIntent', [ JSON.stringify({ text, nlp, action }) ])
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
