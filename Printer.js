const _ = require('lodash')
const MarlinServer = require('./MarlinServer')

module.exports = class Printer {
  constructor (options) {
    this.options = options
    this.channel = new MarlinServer(options)
  }

  async connect() {
    return this.channel.connect()
  }

  // Resolves promise once connected
  ready() {
    return this.channel.ready()
  }

  async home(){
    await this.channel.execute('G28 X')
  }

}