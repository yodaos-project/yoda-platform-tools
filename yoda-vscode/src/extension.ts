'use strict'
import './wtf'
import * as vscode from 'vscode'
import * as yoda from 'yoda-platform-lib'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate (context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vscode-yoda" is now active!')

  const disposable = vscode.commands.registerCommand('extension.pm.install', async () => {
    const workspaces = (vscode.workspace.workspaceFolders || []).map(it => it.uri.fsPath)
    if (workspaces.length === 0) {
      return
    }
    let workspace
    if (workspaces.length > 1) {
      workspace = await vscode.window.showQuickPick(workspaces, { canPickMany: false })
    } else {
      workspace = workspaces[0]
    }
    if (workspace == null) {
      return
    }

    const deviceId = await getDeviceId()
    if (deviceId == null) {
      return
    }

    let installOptions = vscode.workspace.getConfiguration('yoda', null).get('installOptions')

    const client = await getClient(deviceId)
    const pm = new yoda.PackageManager(client)
    const data = await pm.install(workspace, installOptions)
    if (data == null) {
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

async function getDeviceId (): Promise<string | undefined> {
  const devices: any[] = await yoda.PlatformSelector.listDevices()
  if (devices.length === 0) {
    throw new Error('No requested device connected')
  }
  const ids: string[] = devices.map(it => it.id)
  if (ids.length === 1) {
    return ids[0]
  }
  const deviceId = await vscode.window.showQuickPick(ids, { canPickMany: false })
  return deviceId
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
