import * as fs from 'fs'
import { promisify } from 'util'
import program from './program'
import { printResult, getClient } from './util'
import { ApplicationManager, PackageManager } from 'yoda-platform-lib'
import { pick } from 'lodash'

const readFileAsync = promisify(fs.readFile)

const DBusConnection = {
  service: 'com.rokid.AmsExport',
  objectPath: '/rokid/openvoice',
  interface: 'rokid.openvoice.AmsExport'
}

program
  .command('nlp <text>')
  .description('Parse the text and open appropriate app to handle parsed intent.')
  .action(async (text, cmd) => {
    const client = await getClient(DBusConnection, cmd.parent.serial)
    const am = new ApplicationManager(client)
    const result = await am.textNlp(text)
    printResult(result, 'text-nlp')
  })

program
  .command('intent <file>')
  .description('Send parsed NLP intent to device.')
  .action(async (file, cmd) => {
    const content = await readFileAsync(file, 'utf8')
    const obj = JSON.parse(content)

    if (typeof obj.text !== 'string') {
      throw new Error('Expect `text` field in JSON to be a string.')
    }
    if (typeof obj.nlp !== 'object') {
      throw new Error('Expect `text` field in JSON to be an object.')
    }
    if (typeof obj.text !== 'object') {
      throw new Error('Expect `text` field in JSON to be an object.')
    }

    const client = await getClient(DBusConnection, cmd.parent.serial)
    const am = new ApplicationManager(client)
    const result = await am.nlpIntent(obj.text, obj.nlp, obj.action)
    printResult(result, 'nlp-intent')
  })

program
  .command('open-url <url>')
  .description('Open a url on device. The url would be dispatched to an app registered for the hostname.')
  .option('--form <form>')
  .action(async (url, cmd) => {
    const client = await getClient(DBusConnection, cmd.parent.serial)
    const am = new ApplicationManager(client)
    const result = await am.openUrl(url, pick(cmd, 'form'))
    printResult(result, 'open-url')
  })

program
  .command('launch <package-name>')
  .description('Launch an app on device.')
  .option('-m, --mode <mode>', 'mode', /^(default|test)$/i, 'default')
  .option('-t, --type <type>', 'type', /^(default|hive|light)$/i, 'default')
  .action(async (packageName, cmd) => {
    const client = await getClient(DBusConnection, cmd.parent.serial)
    const am = new ApplicationManager(client)
    const result = await am.launch(packageName, { mode: cmd.mode, type: cmd.type })
    printResult(result, 'launch')
  })

program
  .command('instrument <package-name> <instruments-glob>')
  .description('Launch app and run instruments.')
  .action(async (packageName, instruments, cmd) => {
    const client = await getClient(DBusConnection, cmd.parent.serial)
    const am = new ApplicationManager(client)

    const result = await am.launch(packageName, { mode: 'instrument', args: [ instruments ] })
    printResult(result, 'instrument')
  })

program
  .command('force-stop <package-name>')
  .description('Force stop an app on device.')
  .action(async (packageName, cmd) => {
    const client = await getClient(DBusConnection, cmd.parent.serial)
    const am = new ApplicationManager(client)
    const result = await am.forceStop(packageName)
    printResult(result, 'force-stop')
  })

program
  .command('logread <package-name>')
  .description('logread convenience wrapper.')
  .action(async (packageName, cmd) => {
    const client = await getClient(DBusConnection, cmd.parent.serial)
    const pm = new PackageManager(client)
    const path = await pm.path(packageName)
    var stream = await client.logread([ `^iotjs\\syoda-app\\s${path}` ])
    stream.pipe(process.stdout)
  })

export default program
