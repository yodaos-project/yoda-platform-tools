import * as vscode from 'vscode'
import * as yoda from 'yoda-platform-lib'

export async function devicePicker (): Promise<string | undefined> {
  const devices: any[] = await yoda.PlatformSelector.listDevices()
  if (devices.length === 0) {
    return undefined
  }
  const ids: string[] = devices.map(it => it.id)
  if (ids.length === 1) {
    return ids[0]
  }
  const deviceId = await vscode.window.showQuickPick(ids, { canPickMany: false })
  return deviceId
}
