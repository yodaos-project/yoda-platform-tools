import * as camelCase from 'lodash/camelCase'
import { inspect } from 'util'

export function omit (object: object, ...keys: string[]) {
  if (object == null) {
    return object
  }
  var ret = {}
  Object.keys(object).forEach(key => {
    if (keys.indexOf(key) >= 0) {
      return
    }
    const desc = Object.getOwnPropertyDescriptor(object, key)
    if (desc == null) {
      return
    }
    Object.defineProperty(ret, key, desc)
  })
  return ret
}

export function camelCaseKeys (object: object) {
  if (object == null) {
    return object
  }
  var ret = {}
  Object.keys(object).forEach(key => {
    const casedKey = camelCase(key)
    if (!casedKey) {
      return
    }
    const desc = Object.getOwnPropertyDescriptor(object, key)
    if (desc == null) {
      return
    }
    Object.defineProperty(ret, casedKey, desc)
  })
  return ret
}

export function printResult (data: any, command?: string) {
  if (data.ok !== true) {
    console.error(`Unexpected error on requesting YodaRuntime`, command || '')
    console.error(data.message || 'No message.', '\n', data.stack || '')
    process.exit(1)
  }
  console.log(inspect(data.result, false, null, true))
}
