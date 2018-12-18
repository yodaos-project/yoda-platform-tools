import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import * as glob from 'glob'
import * as mustache from 'mustache'
import * as prompts from 'prompts'
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

    const questions: prompts.PromptObject[] = [
      {
        type: 'text',
        name: 'name',
        message: 'Name of the package'
      },
      {
        type: 'text',
        name: 'description',
        message: 'A short description of the package'
      },
      {
        type: 'toggle',
        name: 'private',
        message: 'Is this package private?',
        initial: true,
        active: 'yes',
        inactive: 'no'
      },
      {
        type: prev => !prev ? 'text' : undefined!,
        name: 'license',
        message: 'Publish license of the app'
      },
      {
        type: 'list',
        name: 'skills',
        message: 'Skill ids of your app',
        format (value: string[]) {
          return value.filter(it => !!it)
        }
      },
      {
        type: 'list',
        name: 'permissions',
        message: 'Requested permissions of your app',
        initial: 'ACCESS_TTS',
        format (value: string[]) {
          return value.filter(it => !!it)
        }
      },
      {
        type: 'list',
        name: 'keywords',
        message: 'Keywords',
        format (value: string[]) {
          return value.filter(it => !!it)
        }
      }
    ]
    const answers = await prompts(questions, { onCancel: () => process.exit(1) })
    answers.skills = answers.skills.map((skillId: string) => ({ skillId }))
    answers.permissions = answers.permissions.map((permission: string) => ({ permission }))
    answers.keywords = answers.keywords.map((keyword: string) => ({ keyword }))
    Object.keys(answers).forEach(it => {
      if (!Array.isArray(answers[it])) {
        return
      }
      if (answers[it].length === 0) {
        return
      }
      answers[it][answers[it].length - 1].isLast = true
    })

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
      const output = mustache.render(content, answers)
      await writeFileAsync(target, output, 'utf8')
    }))
  })

program.parse(process.argv)
