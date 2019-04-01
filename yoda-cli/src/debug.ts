import program from './program'
import Command from './cmd'
import { printResult, sleep, getDevice } from './util'
import { FloraClient } from 'yoda-platform-lib'

const DBusConnection = {
  service: 'com.rokid.AmsExport',
  objectPath: '/rokid/yoda/debug',
  interface: 'rokid.yoda.Debug'
}

program
  .command('get-lifetime')
  .description('Get YodaOS lifetime stats.')
  .action(async (cmd) => {
    const result = await Command('GetLifetime', [], DBusConnection, cmd.parent)
    printResult(result, 'get-lifetime')
  })

program
  .command('get-turen-state')
  .description('Get YodaOS wake up stats.')
  .action(async (cmd) => {
    const result = await Command('GetTurenState', [], DBusConnection, cmd.parent)
    printResult(result, 'get-turen-state')
  })

program
  .command('get-loader')
  .description('Get YodaOS application loader stats.')
  .action(async (cmd) => {
    const result = await Command('GetLoader', [], DBusConnection, cmd.parent)
    printResult(result, 'get-loader')
  })

program
  .command('inspect [component]')
  .description('Dump YodaRuntime component.')
  .action(async (name, cmd) => {
    const result = await Command('InspectComponent', [name].filter(it => !!it), DBusConnection, cmd.parent)
    printResult(result, 'inspect-component')
  })

program
  .command('mock-asr [text]')
  .description('Mock a voice command.')
  .action(async (text, cmd) => {
    const result = await Command('mockAsr', [text], DBusConnection, cmd.parent)
    printResult(result, 'mock-asr')
  })

program
  .command('mock-key <event> <key-code>')
  .description('Mock a key event.')
  .action(async (event, keyCode, cmd) => {
    keyCode = Number.parseInt(keyCode)
    if (!Number.isInteger(keyCode)) {
      throw new Error('Expect an integer keyCode.')
    }
    const result = await Command('mockKeyboard', [
      JSON.stringify({ event, keyCode, keyTime: Date.now() })
    ], DBusConnection, cmd.parent)
    printResult(result, 'mock-key')
  })

program
  .command('mock-key-longpress <key-code> <press-time> [event-window]')
  .description('Mock a key longpress gesture.')
  .action(async (keyCode, pressTime, eventWindow, cmd) => {
    if (!eventWindow) {
      eventWindow = 500
    }
    var times = pressTime / eventWindow
    if (!Number.isInteger(times)) {
      throw new Error('pressTime / eventWindow is not a integer.')
    }

    await Command('mockKeyboard', [
      JSON.stringify({ event: 'keydown', keyCode, keyTime: 0 })
    ], DBusConnection, cmd.parent)

    for (let idx = 0; idx < times; ++idx) {
      await sleep(eventWindow)
      await Command('mockKeyboard', [
        JSON.stringify({ event: 'longpress', keyCode, keyTime: (idx + 1) * eventWindow })
      ], DBusConnection, cmd.parent)
    }

    await Command('mockKeyboard', [
      JSON.stringify({ event: 'keyup', keyCode, keyTime: (times + 1) * eventWindow })
    ], DBusConnection, cmd.parent)

    printResult(null, 'mock-key')
  })

program
  .command('subscribe <name>')
  .description('Subscribe a flora event.')
  .action(async (name, cmd) => {
    const device = await getDevice(cmd.serial)
    if (device == null) {
      throw new Error('No requested device connected')
    }
    const cli = new FloraClient(device.id)
    await cli.init()
    printResult(undefined, name)
    cli.subscribe(name, (msg: any[], type: number) => {
      printResult(msg)
    })
  })

program
  .command('post <name> <msg>')
  .description('Post a flora message.')
  .action(async (name, msg, cmd) => {
    if (msg) {
      msg = JSON.parse(msg)
      if (!Array.isArray(msg)) {
        throw new Error('msg is not an array')
      }
    }
    msg = msg || []

    const device = await getDevice(cmd.serial)
    if (device == null) {
      throw new Error('No requested device connected')
    }
    const cli = new FloraClient(device.id)
    await cli.init()
    cli.post(name, msg)
    cli.deinit()
  })

program
  .command('invoke <name> <msg> <target>')
  .description('Invoke a flora remote method.')
  .action(async (name, msg, target, cmd) => {
    if (msg) {
      msg = JSON.parse(msg)
      if (!Array.isArray(msg)) {
        throw new Error('msg is not an array')
      }
    }
    msg = msg || []

    const device = await getDevice(cmd.serial)
    if (device == null) {
      throw new Error('No requested device connected')
    }
    const cli = new FloraClient(device.id)
    await cli.init()
    cli.call(name, msg, target)
      .then((res: any) => {
        printResult(res, 'invoke')
        cli.deinit()
      })
  })

export default program
