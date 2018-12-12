import program from './program'
import Command from './cmd'
import { printResult } from './util'

const DBusConnection = {
  service: 'com.rokid.AmsExport',
  objectPath: '/rokid/yoda/debug',
  interface: 'rokid.yoda.Debug'
}

program
  .command('get-lifetime')
  .action(async (cmd) => {
    const result = await Command('GetLifetime', [], DBusConnection, cmd.parent.serial)
    printResult(result)
  })

program
  .command('get-turen-state')
  .action(async (cmd) => {
    const result = await Command('GetTurenState', [], DBusConnection, cmd.parent.serial)
    printResult(result)
  })

program
  .command('get-loader')
  .action(async (cmd) => {
    const result = await Command('GetLoader', [], DBusConnection, cmd.parent.serial)
    printResult(result)
  })

program
  .command('mock-asr <text>')
  .action(async (text, cmd) => {
    const result = await Command('mockAsr', [text], DBusConnection, cmd.parent.serial)
    printResult(result)
  })

program
  .command('mock-key <event> <key-code>')
  .action(async (event, keyCode, cmd) => {
    const result = await Command('mockKeyboard', [
      JSON.stringify({ event, keyCode, keyTime: Date.now() })
    ], DBusConnection, cmd.parent.serial)
    printResult(result)
  })

program.parse(process.argv)
