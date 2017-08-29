const _ = require('lodash')
const fs = require('fs')
const {promisify} = require('util');

const fsReadFile = promisify(fs.readFile)

const MarlinServer = require('./MarlinServer')

module.exports = class Printer {
  constructor (options) {
    this.options = options
    this.channel = new MarlinServer(options)
  }

  get name () {
    return this.options.name || this.channel.name
  }

  // Resolves promise once connected
  ready() {
    return this.channel.ready()
  }

  async connect() {
    return this.channel.connect()
  }

  async command(gcode) {
    let original = gcode
    gcode = gcode.replace(/\s*;.*/g, '').trim()

    if (gcode.length <= 1) {
      if (this.options.debug)
        console.log('!', 'skip command:', original)
      return
    }

    this.gcode = gcode

    await this.channel.execute(gcode)
  }

  async commands(gcodes) {
    for (let gcode of gcodes) {
      await this.command(gcode)
    }
  }

  async executeFile(path) {
    let file = await fsReadFile(path)
    let commands = file.toString().split('\n')
    await this.commands(commands)
  }

  async display(string) {
    await this.command(`M117 ${string}`)
  }

  async homeAll() { 
    await this.homeW()
    await this.meshBedLevel()
  }
  async home(axes){
    axes = _.intersection(axes, ['X', 'Y', 'Z', 'W'])
    let cmd = 'G28 ' + axes.join(' ')
    await this.channel.execute(cmd)
  }

  async homeX(){ await this.home(['X']) }
  async homeY(){ await this.home(['Y']) }
  async homeZ(){ await this.home(['Z']) }
  async homeW(){ await this.home(['W']) }
  
  async meshBedLevel(){ 
    await this.command('G80')
  }
}