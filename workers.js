const path = require('path')
const chalk = require('chalk')
const draftlog = require('draftlog').into(console)

const Printer = require('./Printer')
const PrinterWorker = require('./PrinterWorker')

async function main() {

  let printer = new Printer({
    debug: false,
    name: 'PRINTER 1',
    port: {serialNumber: 'CZPX1517X003XK17121'},
  })

  let printerWorker = new PrinterWorker(printer, {
    params: {
      temperatureExtruder: 200,
      temperatureBed: 70,
    }
  })

  // printerWorker.printed()
  await printerWorker.start()
  await printerWorker.run()
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