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
  .description('Get YodaOS lifetime stats.')
  .action(async (cmd) => {
    const result = await Command('GetLifetime', [], DBusConnection, cmd.parent.serial)
    printResult(result, 'get-lifetime')
  })

program
  .command('get-turen-state')
  .description('Get YodaOS wake up stats.')
  .action(async (cmd) => {
    const result = await Command('GetTurenState', [], DBusConnection, cmd.parent.serial)
    printResult(result, 'get-turen-state')
  })

program
  .command('get-loader')
  .description('Get YodaOS application loader stats.')
  .action(async (cmd) => {
    const result = await Command('GetLoader', [], DBusConnection, cmd.parent.serial)
    printResult(result, 'get-loader')
  })

program
  .command('mock-asr <text>')
  .description('Mock a voice command.')
  .action(async (text, cmd) => {
    const result = await Command('mockAsr', [text], DBusConnection, cmd.parent.serial)
    printResult(result, 'mock-asr')
  })

program
  .command('mock-key <event> <key-code>')
  .description('Mock a key event.')
  .action(async (event, keyCode, cmd) => {
    const result = await Command('mockKeyboard', [
      JSON.stringify({ event, keyCode, keyTime: Date.now() })
    ], DBusConnection, cmd.parent.serial)
    printResult(result, 'mock-key')
  })

program.parse(process.argv)
