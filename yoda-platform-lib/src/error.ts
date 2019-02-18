export class CommandError extends Error {
  constructor (public reason?: string, public deviceStack?: string) {
    super('Command Error: ' + reason)
    this.name = 'CommandError'
  }
}

export class RequestError extends Error {
  constructor (public rawData?: string) {
    super('Unable to parse device response: ' + rawData)
    this.name = 'RequestError'
  }
}

export class ConnectionError extends Error {
  constructor (public reason?: string) {
    super('Unable to connect to device: ' + reason)
    this.name = 'ConnectionError'
  }
}
