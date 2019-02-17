import program from './program'
import Command from './cmd'
import { printResult, sleep } from './util'

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

export default program
