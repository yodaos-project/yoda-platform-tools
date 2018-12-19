import { any } from './util'

const map: { [key: string]: string } = {
  am: './am',
  debug: './debug',
  init: './init',
  pm: './pm'
}

function help () {
  const str = `Usage: yoda [options] [command]

Options:
  -V, --version      output the version number
  -h, --help         output usage information

Commands:
  am                 applications management helpers.
  debug              YodaOS runtime debugging helper.
  init               packages scaffolding tool.
  pm                 packages management helpers.
  `
  console.log(str)
}

function main () {
  const cmd = process.argv.slice(2).filter(it => !it.startsWith('-'))[0]
  if (map[cmd] == null || cmd === 'help') {
    help()
    process.exitCode = cmd != null || any(process.argv, '-h', '--help', 'help') ? 0 : 1
    return
  }
  const script = map[cmd]
  process.argv.splice(2, 1)
  const commander = require(script).default
  commander.name(`yoda ${cmd}`)
  commander.parse(process.argv)
}

export default main
