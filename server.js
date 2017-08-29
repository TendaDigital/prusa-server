const chalk = require('chalk')
const SerialPort = require('serialport')

const Printer = require('./Printer')

async function main() {

  // let ports = await SerialPort.list()
  // console.log(ports)


  let printer = new Printer({
    debug: true,
    port: {serialNumber: 'CZPX1517X003XK17121'},
  })
  console.log('connecting...')
  await printer.connect()
  console.log('connected')

  console.log('waiting to be ready...')
  await printer.ready()
  console.log('printer ready')

  console.log('start home')
  await printer.home(['X'])
  await printer.command('doasp')
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