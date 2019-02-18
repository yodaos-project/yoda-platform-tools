import * as signal from 'signale'
import { inspect } from 'util'

/**
 * What a Terrible Failure
 */
function handleError (error: Error) {
  process.exitCode = 1
  signal.error(inspect(error, { colors: true }))
}

process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)
