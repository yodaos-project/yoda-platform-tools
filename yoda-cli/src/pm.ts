import program from './program'
import { printResult, getClient } from './util'
import { PackageManager } from 'yoda-platform-lib'

const DBusConnection = {
  service: 'com.rokid.AmsExport',
  objectPath: '/rokid/openvoice',
  interface: 'rokid.openvoice.AmsExport'
}

program
  .command('list')
  .description('Get info of all packages on device.')
  .action(async (cmd) => {
    const client = await getClient(DBusConnection, cmd.parent.serial)
    const pm = new PackageManager(client)
    const result = await pm.list()
    printResult(result, 'list')
  })

program
  .command('path <package-name>')
  .description('Get package directory on device.')
  .action(async (packageName, cmd) => {
    const client = await getClient(DBusConnection, cmd.parent.serial)
    const pm = new PackageManager(client)
    const result = await pm.path(packageName)
    printResult(result, 'path')
  })

program
  .command('install <package-path>')
  .description('Install an app from local package path.')
  .option('--package-name <name>', 'use package name instead of name in package.json')
  .option('--install-path <path>', 'use path instead of default /opt/apps')
  .option('--install-name <name>', 'use name instead of package name on installation')
  .action(async (packagePath, cmd) => {
    const client = await getClient(DBusConnection, cmd.parent.serial)
    const pm = new PackageManager(client)
    const result = await pm.install(packagePath, cmd)
    printResult(result, 'install')
  })

export default program
