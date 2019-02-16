import * as signal from 'signale'

/**
 * What a Terrible Failure
 */
function handleError (error: Error) {
  process.exitCode = 1
  signal.error(error)
}

process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)
