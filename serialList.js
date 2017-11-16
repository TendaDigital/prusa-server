const SerialPort = require('serialport')

async function list(){
  let ports = await SerialPort.list()
  console.log(ports)
}

list()