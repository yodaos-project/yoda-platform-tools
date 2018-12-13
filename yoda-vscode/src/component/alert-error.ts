import * as vscode from 'vscode'

export default function alertError (error: Error) {
  console.error(error)
  vscode.window.showErrorMessage(error.message)
}
