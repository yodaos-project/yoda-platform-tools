import program from './program'
import { printResult } from './util'
import * as flora from 'flora'

program
  .option('--uri <uri>', 'uri.', (val, accu) => {
    if (val == null) {
      return accu
    }
    return val
  }, 'tcp://127.0.0.1:37800/')

program
  .command('subscribe <name>')
  .description('Subscribe a flora event.')
  .option('--once', 'Exit on first event.', () => true)
  .action(async (name, cmd) => {
    const cli = new flora.Agent(cmd.parent.uri)
    cli.start()

    printResult(undefined, name)
    cli.subscribe(name, (msg: any[], type: number) => {
      printResult({ type: type === 0 ? 'INSTANT' : 'PERSIST', msg })
      if (cmd.once === true) {
        cli.close()
      }
    })
  })

program
  .command('post <name> <msg>')
  .description('Post a flora message.')
  .option('-p, --persist', 'Post a persist message', () => true)
  .action(async (name, msg, cmd) => {
    if (msg) {
      msg = JSON.parse(msg)
      if (!Array.isArray(msg)) {
        throw new Error('msg is not an array')
      }
    }
    msg = msg || []

    const cli = new flora.Agent(cmd.parent.uri)
    cli.start()
    cli.post(name, msg, cmd.persist === true ? 1 : 0)
    cli.close()
  })

program
  .command('call <name> <msg> <target>')
  .description('Invoke a flora remote method.')
  .option('--timeout <millis>', 'Timeout', parseInt, 60 * 1000)
  .action(async (name, msg, target, cmd) => {
    if (msg) {
      msg = JSON.parse(msg)
      if (!Array.isArray(msg)) {
        throw new Error('msg is not an array')
      }
    }
    msg = msg || []

    const cli = new flora.Agent(cmd.parent.uri)
    cli.start()

    cli.call(name, msg, target, cmd.timeout)
      .then((res: any) => {
        printResult(res, 'invoke')
        cli.close()
      })
      .catch((err: any) => {
        printResult(new Error(`flora-error(${err})`), 'invoke')
        cli.close()
      })
  })

export default program
