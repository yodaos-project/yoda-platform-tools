'use strict'

module.exports = function main (app) {
  app.on('request', nlp => {
    app.tts.speak('Hello from {{name}}')
  })
}
