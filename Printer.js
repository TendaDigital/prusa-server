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
    axes = _.intersection(axes, ['X', 'Y', 'Z', 'W'])
    let cmd = 'G28 ' + axes.join(' ')
    await this.channel.execute(cmd)
  }

  async homeX(){ await this.home(['X']) }
  async homeY(){ await this.home(['Y']) }
  async homeZ(){ await this.home(['Z']) }
  
  async meshBedLevel(){ 
    await this.command('G80')
  }
}