import * as adb from 'adbkit'
import * as path from 'path'
import * as flora from 'flora'

export class FloraClient {
  adbCli = adb.createClient()
  sessionAddress?: string
  floraCli?: any

  // eslint-disable-next-line no-useless-constructor
  constructor (
    public deviceId: string
  ) {}

  async init () {
    if (this.floraCli != null) {
      return
    }
    await this.assertAvailability()
    this.sessionAddress = await this.getDeviceAddress()
    this.floraCli = new flora.Agent(this.sessionAddress)
    this.floraCli.start()
  }

  async deinit () {
    if (this.floraCli == null) {
      return
    }
    this.floraCli.close()
    this.floraCli = null
  }

  async assertAvailability () {
    const version = await this.adbCli.version()
    if (version < 40) {
      throw new Error(`Requires adb version >= 40, got ${version}`)
    }
    const dbusSendPath = await this.adbCli.shell(this.deviceId, '/usr/bin/which dbus-send')
      .then(adb.util.readAll)
      .then((it: Buffer) => it.toString().trim())
    if (!path.isAbsolute(dbusSendPath)) {
      throw new Error('dbus-send is not available on device')
    }
  }

  async getDeviceAddress () {
    const output: Buffer = await this.adbCli.shell(this.deviceId, "ifconfig wlan0 | grep inet | grep -v inet6 | awk '{print $2}' | cut -d: -f 2")
      .then(adb.util.readAll)
    const match = output.toString().trim()
    if (match == null) {
      throw new Error('Cannot determine dbus session address.')
    }
    return `tcp://${match}:37800/`
  }

  subscribe (name: string, handler: Function) {
    return this.floraCli.subscribe(name, handler)
  }

  post (name: string, msg: any[], type?: number) {
    return this.floraCli.post(name, msg, type)
  }

  call (name: string, msg: any[], target: string, timeout?: number) {
    return this.floraCli.call(name, msg, target, timeout)
  }
}
