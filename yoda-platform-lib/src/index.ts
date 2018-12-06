import * as adb from 'adbkit'

export async function checkAvailability () {
  const client = adb.createClient()
  const version  = await client.version()
  return version >= 40
}
