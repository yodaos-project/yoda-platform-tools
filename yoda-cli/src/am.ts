import * as fs from 'fs'
import { promisify } from 'util'
import program from './program'
import { printResult, getClient } from './util'
import { ApplicationManager } from 'yoda-platform-lib'

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
  .action(async (url, cmd) => {
    const client = await getClient(DBusConnection, cmd.parent.serial)
    const am = new ApplicationManager(client)
    const result = await am.openUrl(url)
    printResult(result, 'open-url')
  })

program
  .command('launch <package-name>')
  .description('Launch an app on device.')
  .action(async (packageName, cmd) => {
    const client = await getClient(DBusConnection, cmd.parent.serial)
    const am = new ApplicationManager(client)
    const result = await am.launch(packageName)
    printResult(result, 'launch')
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

export default program
