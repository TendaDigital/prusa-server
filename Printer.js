const _ = require('lodash')
const MarlinServer = require('./MarlinServer')

module.exports = class Printer {
  constructor (options) {
    this.options = options
    this.channel = new MarlinServer(options)
  }

  // Resolves promise once connected
  ready() {
    return this.channel.ready()
  }

  async connect() {
    return this.channel.connect()
  }

  async command(gcode) {
    await this.channel.execute(gcode)
  }

  async home(axes){
    axes = _.intersection(axes, ['X', 'Y', 'Z'])
    let cmd = 'G28 ' + axes.join(' ')
    console.log(cmd)
    // await this.channel.execute(cmd)
  }
}