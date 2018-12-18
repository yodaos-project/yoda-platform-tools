import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import * as glob from 'glob'
import * as mustache from 'mustache'
import program from './program'
import { mkdirp } from './util'

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const mkdirpAsync = promisify(mkdirp)
const statAsync = promisify(fs.stat)
const globAsync = promisify(glob)

const internalBoilerplatesDir = path.join(__dirname, '..', 'boilerplates')

function isDirectory (path: string): Promise<boolean | null> {
  return statAsync(path)
    .then(it => it.isDirectory())
    .catch(err => {
      if (err.code !== 'ENOENT') {
        throw err
      }
      return null
    })
}

program
  .command('app <project-name>')
  .option('--template <template-name>', 'Specify a template to generate the new project')
  .action(async (projectName, cmd) => {
    const template = cmd.template || 'simple'
    const templatePath = path.join(internalBoilerplatesDir, template)
    if (!(await isDirectory(templatePath))) {
      throw new Error(`Template ${template} not found.`)
    }

    const workDir = path.join(process.cwd(), projectName)
    const workDirIsDirectory = await isDirectory(workDir)
    if (workDirIsDirectory === false) {
      throw new Error(`Target ${workDir} exists yet is not a directory.`)
    }

    const files = await globAsync(path.join(templatePath, '**', '*'))
    await Promise.all(files.map(async (file) => {
      const relative = path.relative(templatePath, file)
      const target = path.join(workDir, relative)
      const dirname = path.dirname(target)
      const isTargetDirDirectory = await isDirectory(dirname)
      if (isTargetDirDirectory === false) {
        throw new Error(`Target ${workDir} exists yet is not a directory.`)
      }
      if (isTargetDirDirectory === null) {
        await mkdirpAsync(dirname)
      }
      const content = await readFileAsync(file, 'utf8')
      const output = mustache.render(content, { name: 'foobar' })
      await writeFileAsync(target, output, 'utf8')
    }))
  })

program.parse(process.argv)
