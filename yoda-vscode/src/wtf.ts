import * as vscode from 'vscode'

/**
 * What a Terrible Failure
 */
function handleError (error: Error) {
  vscode.window.showErrorMessage(error.message)
}

process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)
