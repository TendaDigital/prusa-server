const chalk = require('chalk')
const SerialPort = require('serialport')

const Printer = require('./Printer')

async function main() {

  let ports = await SerialPort.list()
  console.log(ports)


  let printer = new Printer()

  console.log('waiting printer...')
  await printer.ready()
  console.log('printer ok')

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