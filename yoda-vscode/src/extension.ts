'use strict'
import './wtf'
import * as vscode from 'vscode'
import * as yoda from 'yoda-platform-lib'
import { URL } from 'url'
import workspacePicker from './component/workspace-picker'
import alertError from './component/alert-error'
import { devicePicker } from './component/device-picker'

const Commands: { [key: string]: (...args: any[]) => any } = {
  'extension.pm.launch': async () => {
    const workspace = await workspacePicker()
    if (workspace == null) {
      alertError(new Error('No workspace available'))
      return
    }

    const deviceId = await devicePicker()
    if (deviceId == null) {
      alertError(new Error('No device available'))
      return
    }

    let installOptions: yoda.IInstallOptions | undefined = vscode.workspace.getConfiguration('yoda', null).get('installOptions')
    if (installOptions == null) {
      installOptions = {}
    }

    const client = await getClient(deviceId)
    const pm = new yoda.PackageManager(client)
    const packageJson = await pm.resolvePackage(workspace)
    const packageName = installOptions.packageName || packageJson.name
    installOptions.packageName = packageName
    let data = await pm.install(workspace, installOptions)
    if (data == null) {
      alertError(new Error('Unable to get result of installation'))
      return
    }
    console.log(data)

    vscode.window.showInformationMessage(`Installed to ${data.appHome}`)

    const am = new yoda.ApplicationManager(client)
    data = await am.launch(packageName)

    vscode.window.showInformationMessage(`App(${packageName}) started`)
  },
  'extension.am.open-url': async () => {
    const deviceId = await devicePicker()
    if (deviceId == null) {
      alertError(new Error('No device available'))
      return
    }
    const url = await vscode.window.showInputBox({
      prompt: 'Url to be opened',
      placeHolder: 'yoda-skill://app-host/pathname',
      validateInput: (value: string) => {
        let urlObj
        try {
          urlObj = new URL(value)
        } catch (e) {
          return e.message
        }
        if (urlObj.protocol !== 'yoda-skill:') {
          return 'Only schema `yoda-skill` could be handled.'
        }
        return null
      }
    })
    if (url == null) {
      return
    }
    const client = await getClient(deviceId)
    const am = new yoda.ApplicationManager(client)
    const data = await am.openUrl(url)
    if (data == null) {
      alertError(new Error('Unable to get result of open url'))
      return
    }

    vscode.window.showInformationMessage(`Opened url '${url}'`)
  },
  'extension.am.text-nlp': async () => {
    const deviceId = await devicePicker()
    if (deviceId == null) {
      alertError(new Error('No device available'))
      return
    }
    const text = await vscode.window.showInputBox({
      prompt: 'Text to be parsed and executed',
      placeHolder: 'Salut!'
    })
    if (text == null) {
      return
    }
    const client = await getClient(deviceId)
    const am = new yoda.ApplicationManager(client)
    await am.textNlp(text)

    vscode.window.showInformationMessage(`Text sent: '${text}'`)
  }
}

export function activate (context: vscode.ExtensionContext) {
  console.log('Congratulations, vscode-yoda is now active!')

  Object.keys(Commands).forEach(it => {
    const handler = Commands[it]
    const disposable = vscode.commands.registerCommand(it, handler)
    context.subscriptions.push(disposable)
  })
}

// this method is called when your extension is deactivated
export function deactivate () {
}

async function getClient (deviceId: string) {
  const client = new yoda.PlatformClient(deviceId, {
    service: 'com.rokid.AmsExport',
    objectPath: '/rokid/openvoice',
    interface: 'rokid.openvoice.AmsExport'
  })
  await client.init()
  return client
}
