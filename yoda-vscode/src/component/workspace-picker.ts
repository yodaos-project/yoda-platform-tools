import * as vscode from 'vscode'

export default async function workspacePicker (): Promise<string | undefined> {
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
  return workspace
}
