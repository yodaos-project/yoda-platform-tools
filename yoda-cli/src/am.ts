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
  .description('Open a url on device. The url would be dispatched to an app registered for the hostname.')
  .action(async (url, cmd) => {
    const result = await Command('OpenUrl', [url], DBusConnection, cmd.parent.serial)
    printResult(result, 'open-url')
  })

program
  .command('launch <package-name>')
  .description('Launch an app on device.')
  .action(async (packageName, cmd) => {
    const result = await Command('LaunchApp', [packageName], DBusConnection, cmd.parent.serial)
    printResult(result, 'launch')
  })

program
  .command('force-stop <package-name>')
  .description('Force stop an app on device.')
  .action(async (packageName, cmd) => {
    const result = await Command('ForceStop', [packageName], DBusConnection, cmd.parent.serial)
    printResult(result, 'force-stop')
  })

program.parse(process.argv)
