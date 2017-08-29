const path = require('path')
const chalk = require('chalk')
const SerialPort = require('serialport')

const Printer = require('./Printer')

const GCODE_HEAT = path.join(__dirname, './gcodes/heat.gcode')
const GCODE_FINAL = path.join(__dirname, './gcodes/final.gcode')
const GCODE_PRINT = path.join(__dirname, './gcodes/lh.gcode')

async function main() {

  // let ports = await SerialPort.list()
  // console.log(ports)


  let printer = new Printer({
    debug: true,
    name: 'PRINTER 0'
    port: {serialNumber: 'CZPX1517X003XK17121'},
  })
  console.log('connecting...')
  await printer.connect()
  console.log('connected')

  console.log('waiting to be ready...')
  await printer.ready()
  console.log('printer ready')

  console.log('start heating')
  await printer.executeFile(GCODE_HEAT)
  await printer.homeAll()

  while (true) {
    await printer.executeFile(GCODE_PRINT)
    await printer.executeFile(GCODE_FINAL)
  }
  
  console.log('home ok')
}

;(async () => {
  try {
    await main()
  } catch (e) {
    console.log()
    console.log(chalk.red('failed'))
    console.error(e)
    process.exit(1)
  }
})()

process.on('unhandledRejection', (e) => {
  console.error('Unhandled Rejection')
  console.error(e.stack)
  process.exit(1)
})