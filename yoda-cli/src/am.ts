import program from './program'
import Command from './cmd'
import { printResult } from './util'

const DBusConnection = {
  service: 'com.rokid.AmsExport',
  objectPath: '/rokid/openvoice',
  interface: 'rokid.openvoice.AmsExport'
}

program
  .command('open-url <url>')
  .action(async (url, cmd) => {
    const result = await Command('OpenUrl', [url], DBusConnection, cmd.parent.serial)
    printResult(result)
  })

program
  .command('launch <package-name>')
  .action(async (packageName, cmd) => {
    const result = await Command('LaunchApp', [packageName], DBusConnection, cmd.parent.serial)
    printResult(result)
  })

program
  .command('force-stop <package-name>')
  .action(async (packageName, cmd) => {
    const result = await Command('ForceStop', [packageName], DBusConnection, cmd.parent.serial)
    printResult(result)
  })

program.parse(process.argv)
