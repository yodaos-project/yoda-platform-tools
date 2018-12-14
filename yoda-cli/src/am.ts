import * as fs from 'fs'
import { promisify } from 'util'
import program from './program'
import Command from './cmd'
import { printResult } from './util'

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
    const result = await Command('TextNLP', [text], DBusConnection, cmd.parent.serial)
    printResult(result, 'text-nlp')
  })

program
  .command('intent <file>')
  .description('Send parsed NLP intent to device.')
  .action(async (file, cmd) => {
    const content = await readFileAsync(file, 'utf8')
    const obj = JSON.parse(content)
    const result = await Command('NLPIntent', [ obj ], DBusConnection, cmd.parent.serial)
    printResult(result, 'nlp-intent')
  })

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
