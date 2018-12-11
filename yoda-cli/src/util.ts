import * as camelCase from 'lodash/camelCase'

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
