const _ = require('lodash')
const Readline = require('serialport').parsers.Readline
const SerialPort = require('serialport')

const Defered = require('./Defered')

module.exports = class MarlinServer {
  constructor(options) {
    this.options = options || {}
    
    this.promiseQueue = []

    // Ready promise indicating reception of `start` string
    this._ready = new Defered()

    // If port provided, immediatelly tries to connect
    // if (this.options.port) {
      // this.connect(this.options.port)
    // }
  }

  async connect(serialPort) {
    // Defaults to options.port
    serialPort = serialPort || this.options.port || null

    if (this._connect) {
      return await this._connect
    }

    if (!serialPort) {
      throw new Error('No serial port name or pattern provided')
    }

    if (_.isString(serialPort))
      serialPort = {comName: serialPort}
    else
      serialPort = serialPort

    // Try to find port
    let portList = await SerialPort.list()
    let portProp = _.find(portList, serialPort)

    // Reject if 
    if (!portProp) {
      reject('Port not found: ' + JSON.stringify(serialPort))
    }
    
    this._connect = new Promise(async (resolve, reject) => {
      try {
        console.log('Connecting to', portProp.comName)
        // Open Serial Port
        this.port = new SerialPort(portProp.comName, { baudRate: 115200 })

        // Bufferize Line and use as dataReceived
        let lineBuffer = new Readline({ delimiter: '\n' })
        this.port.pipe(lineBuffer)
        lineBuffer.on('data', (data) => this.dataReceived(data))

        this.port.on('open', () => this.resetQueue())
        this.port.on('close', () => this.resetQueue())
        resolve()
      } catch (e) {
        reject(e)
      }
    })

    await this._connect
  }

  ready() {
    return this._ready.promise
  }

  resetQueue() {
    let promise
    while(promise = this.promiseQueue.shift())
      promise.reject('Connection opening')
    // this.promiseQueue = []
  }

  dataReceived(data) {
    if (!data)
      return

    if (this.options.debug)
      console.log('<', data)

    // Make sure it's a string
    data = data.toString()

    // Check for start packet
    if (data.startsWith('start')) {
      return this._ready.resolve()
    }

    // Only packets starting with `:` are responses
    if (!data.startsWith('ok')) {
      return
    }
    
    // console.log('end: ', data)

    let promise = this.promiseQueue.shift()
  
    if (!promise)
      return

    promise.resolve(data)
  }

  execute(command) {
    console.log('>', command)
    command += '\n\r'
    this.port.write(command)
    let promise = new Promise((resolve, reject) => {
      let queued = {resolve, reject}
      this.promiseQueue.push(queued)

      // Timeout command
      // setTimeout(() => {
        // Remove from queue
        // _.pull(this.promiseQueue, queued)

        // Reject
        // reject('Timeout action')
      // }, 10000)
    })

    return promise
  }

}