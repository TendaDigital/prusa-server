const path = require('path')
const chalk = require('chalk')
const draftlog = require('draftlog').into(console)

const Bot = require('./Bot')
const Printer = require('./Printer')
const PrinterWorker = require('./PrinterWorker')

const sleep = ms => new Promise(res => setTimeout(res, ms))

const PRINTER_5 = {
  debug: false,
  name: 'PRINTER 5',
  port: {serialNumber: 'CZPX2617X003XK24982'},
  params: {
    temperatureExtruder: 205,
    temperatureBed: 50,
    babyHeight: '0.55',
    printOffset: 0
  }
}

const PRINTER_4 = {
  debug: false,
  name: 'PRINTER 4',
  port: {serialNumber: 'CZPX2617X003XK25033'},
  params: {
    temperatureExtruder: 205,
    temperatureBed: 50,
    babyHeight: '0.32',
    printOffset: 0
  }
}
const PRINTER_3 = { //is at home
  debug: false,
  name: 'PRINTER 3',
  port: {serialNumber: 'CZPX2617X003XK250xx'},
  params: {
    temperatureExtruder: 205,
    temperatureBed: 50,
    babyHeight: '0.55',
    printOffset: 0
  }
}

const PRINTER_2 = {
  debug: false,
  name: 'PRINTER 2',
  port: {serialNumber: 'CZPX2617X003XK25035'},
  params: {
    temperatureExtruder: 205,
    temperatureBed: 50,
    babyHeight: '0.55',
    printOffset: 0
  }
}

const PRINTER_1 = {
  debug: false,
  name: 'PRINTER 1',
  port: {serialNumber: 'CZPX2617X003XK25026'},
  params: {
    temperatureExtruder: 205,
    temperatureBed: 50,
    babyHeight: '0.55',
    printOffset: 0
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

const PRINTERS = [
  PRINTER_1,
  PRINTER_2,
  PRINTER_3,
  PRINTER_4,
  PRINTER_5,
]

async function main() {

  // let printer5 = new Printer(PRINTER_5)
  // //
  // let printerWorker5 = new PrinterWorker(printer5, PRINTER_5)
  // await printerWorker5.start()
  // await printerWorker5.run()

  let workersPromises = []
  for (let printer of PRINTERS) {
    workersPromises.push(launchWorker(printer))
  }

  await Promise.all(workersPromises)
}

async function launchWorker(opts) {
  // Wait for connection
  let printer = null
  while(true) {
    while (true) {
      try {
        await sleep(2000);
        printer = new Printer(opts)
        await printer.connect()
        await printer.ready()
        break
      } catch (e) {
        if (e.message.startsWith('Port not found')) {
          continue
        }
        console.log(e)
        throw e
      }
    }
    while (true) {
      try {
        await printer.waitForButtonPress()
        let printerWorker = new PrinterWorker(printer, opts)
        await printerWorker.start()
        await printerWorker.run()
      } catch (e) {
        if (e == 'Connection opening') {
          console.log(chalk.bgRed.white(` ${opts.name} Disconnected. Re-start a porra toda `))
          printerWorker.log('Disconnected')
          Bot.run(opts.name, true)
          while(1) {
            await sleep(100000)
          }
          throw e
        }
        Bot.run(opts.name)
        console.log(chalk.bgRed.white(` ${opts.name} Failed part. Waiting for human `))
      }
    }
  }
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

process.on('unhandledRejection', async (e) => {
  console.error('Unhandled Rejection')
  console.error(e.stack)
  process.exit(1)
})