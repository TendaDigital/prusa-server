const SerialPort = require('serialport')
const MarlinServer = require('./MarlinServer')

module.exports = class Printer {
  constructor (comPort) {
    // Ready promise
    this.promiseReady = new Promise(this.initSerialPort)
  }

  async initSerialPort(resolve, reject) {
    let ports = await SerialPort.list()
    let port =

    this.port.on('open', () => resolve())
  }

  async initChannel() {
    this.channel = new SerialChannel(this.port)
  }

  // Resolves promise once connected
  ready() {
    return this.promiseReady
  }

  async home(){
    await this.channel.execute('G23 X')
  }

}