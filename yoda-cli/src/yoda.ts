import * as program from 'commander'
import * as PackageJson from '../package.json'

program
  .version(PackageJson.version)
  .command('am [command]', 'YodaOS application manager')
  .command('pm [command]', 'YodaOS package manager')
  .command('debug [command]', 'debug YodaOS')
  .parse(process.argv)
