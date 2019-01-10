import * as program from 'commander'
import * as PackageJson from '../package.json'

program
  .version(PackageJson.version)
  .option('-s, --serial <sn>', 'use device with given serial')
  .option('--verbose', 'log verbosely')

program.on('command:*', function () {
  console.error('Invalid command: %s\n', program.args.join(' '))
  program.outputHelp()
  process.exit(1)
})

const parse = program.parse
;(program as any).parse = function (argv: string[]) {
  if (argv.length < 3) {
    // this user needs help
    argv.push('--help')
  }

  return parse.call(program, argv)
}

export default program
