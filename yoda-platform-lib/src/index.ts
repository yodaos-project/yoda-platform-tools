import * as adb from 'adbkit'

interface DBusConnection {
  service: string
  objectPath: string
  interface: string
}

function generateDBusCommand (session: string, connection: DBusConnection, methodName: string, args: any[]) {
  let cmd = [
    `dbus-send --print-reply=literal`,
    `--bus=${session}`,
    `--dest=${connection.service}`,
    `${connection.objectPath}`,
    `${connection.interface}.${methodName}`
  ]
  cmd = cmd.concat(args.map((arg: any) => {
    switch (typeof arg) {
      case 'number':
        return `double:${arg}`
      case 'string':
      case 'object':
        return `string:${JSON.stringify(arg)}`
      default:
        throw new Error(`Undefined transform of argument type ${typeof arg}`)
    }
  }))
  return cmd.join(' ')
}

export class PlatformClient {
  client = adb.createClient()
  sessionAddress?: string

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private deviceId: string,
    private connection: DBusConnection
  ) {}

  async init () {
    await this.checkAvailability()
    this.sessionAddress = await this.getDBusSession()
  }

  async checkAvailability () {
    const version = await this.client.version()
    return version >= 40
  }

  async getDBusSession () {
    const output: Buffer = await this.client.shell(this.deviceId, 'cat /var/run/dbus/session')
      .then(adb.util.readAll)
    const match = output.toString().match(/DBUS_SESSION_BUS_ADDRESS=(.+)/)
    if (match == null) {
      throw new Error('Cannot determine dbus session address.')
    }
    return match[1]
  }

  async command (command: string, args: any[]) {
    const cmd = generateDBusCommand(this.sessionAddress!, this.connection, command, args)
    const output: Buffer = await this.client.shell(this.deviceId, cmd)
      .then(adb.util.readAll)
    const result = JSON.parse(output.toString())
    return result
  }
}
