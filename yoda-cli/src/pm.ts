import * as program from 'commander'
import { printResult, getClient } from './util'

const DBusConnection = {
  service: 'com.rokid.AmsExport',
  objectPath: '/rokid/openvoice',
  interface: 'rokid.openvoice.AmsExport'
}

program
  .option('-s, --serial <sn>', 'use device with given serial')

program
  .command('list')
  .action(async (cmd) => {
    const client = await getClient(DBusConnection, cmd.serial)
    const result = await client.list()
    printResult(result)
  })

program
  .command('path <package-name>')
  .action(async (packageName, cmd) => {
    const client = await getClient(DBusConnection, cmd.serial)
    await client.init()
    const result = await client.path(packageName)
    console.log(result)
  })

program
  .command('install <package-path>')
  .option('--package-name <name>', 'use package name instead of name in package.json')
  .option('--install-path <path>', 'use path instead of default /opt/apps')
  .option('--install-name <name>', 'use name instead of package name on installation')
  .action(async (packagePath, cmd) => {
    const client = await getClient(DBusConnection, cmd.serial)
    await client.init()
    const result = await client.install(packagePath, cmd)
    printResult(result)
  })

program.parse(process.argv)
