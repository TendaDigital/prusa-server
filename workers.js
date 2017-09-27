const path = require('path')
const chalk = require('chalk')
const draftlog = require('draftlog').into(console)

const Printer = require('./Printer')
const PrinterWorker = require('./PrinterWorker')

const timeout = ms => new Promise(res => setTimeout(res, ms))

const PRINTER_5 = {
  debug: false,
  name: 'PRINTER 5',
  port: {serialNumber: 'CZPX2617X003XK24982'},
  params: {
    temperatureExtruder: 205,
    temperatureBed: 50,
    babyHeight: '0.7',
    printOffset: 10
  }
}

const PRINTER_JOHN = {
  debug: false,
  name: 'PRINTER 6',
  port: {serialNumber: 'CZPX1517X003XK17121'},
  params: {
    temperatureExtruder: 200,
    temperatureBed: 60,
    babyHeight: '0.35',
    printOffset: 0
  }
}

async function main() {

  let printer5 = new Printer(PRINTER_5)
  //
  let printerWorker5 = new PrinterWorker(printer5, PRINTER_5)
  await printerWorker5.start()
  await printerWorker5.run()
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