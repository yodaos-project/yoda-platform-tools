import * as program from 'commander'
import * as PackageJson from '../package.json'

program
  .version(PackageJson.version)
  .option('-s, --serial <sn>', 'use device with given serial')

program
  .command('*')
  .action(() => {
    program.outputHelp()
    process.exit(1)
  })

export default program
