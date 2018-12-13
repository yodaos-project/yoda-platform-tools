'use strict'
import './wtf'
import * as vscode from 'vscode'
import * as yoda from 'yoda-platform-lib'
import workspacePicker from './component/workspace-picker';
import alertError from './component/alert-error';
import { devicePicker } from './component/device-picker';

export function activate (context: vscode.ExtensionContext) {
  console.log('Congratulations, vscode-yoda is now active!')

  const disposable = vscode.commands.registerCommand('extension.pm.install', async () => {
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

    let installOptions = vscode.workspace.getConfiguration('yoda', null).get('installOptions')

    const client = await getClient(deviceId)
    const pm = new yoda.PackageManager(client)
    const data = await pm.install(workspace, installOptions)
    if (data == null) {
      alertError(new Error('Unable to get result of device'))
      return
    }
    console.log(data)

    vscode.window.showInformationMessage(`Installed to ${data.appHome}`)
  })

  context.subscriptions.push(disposable)
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
