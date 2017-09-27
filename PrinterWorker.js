const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const moment = require('moment')

const Defered = require('./Defered')
const GcodeRunner = require('./GcodeRunner')

module.exports = class PrinterWorker {

  constructor(printer, opts) {
    this.partCount = 0
    this.printer = printer
    this.opts = opts
    this.running = null
    this.logFile = path.join(__dirname, 'logs', printer.name + '.txt')
    this.gcodes = {
      heat:     new GcodeRunner(this.filePath('heat'), opts),
      heatWait: new GcodeRunner(this.filePath('heatWait'), opts),
      home:     new GcodeRunner(this.filePath('home'), opts),
      print:    new GcodeRunner(this.filePath('LedHolder'), opts),
      start:    new GcodeRunner(this.filePath('start'), opts),
      eject:    new GcodeRunner(this.filePath('eject'), opts),
      end:      new GcodeRunner(this.filePath('end'), opts),
    }
    this.offset = {
      x: 0,
      y: 0,
    }
  }

  get tag() {
    return (' ' + this.printer.name + ' ')
  }

  // Counts one more part
  printed(duration) {
    this.partCount++
    duration = Math.round(duration / 1000)
    fs.appendFileSync(this.logFile,
      `${new Date().toString()}: new part (${duration} s)\n`)
  }

  filePath(name) {
    return path.join(__dirname, './gcodes', name + '.gcode')
  }

  async stop() {
    this.running = false
    console.log('Stopping print')
  }

  run() {
    return this.running ? this.running : null
  }

  async start() {
    if (this.running) {
      return this.running
    }

    fs.appendFileSync(this.logFile, '========= Start ========\n')

    this.running = new Promise(async (resolve, reject) => {
      try {

        // Connect and wait printer to be ready
        console.log(chalk.dim(this.tag), 'starting')
        await this.printer.connect()
        console.log(chalk.dim(this.tag), 'Connected')
        await this.printer.ready()
        console.log(chalk.dim(this.tag), 'Ready')

        // Start heating
        this.assertRunning()
        await this.execGcode(this.gcodes.heat)
        
        // Go home and level bed
        this.assertRunning()
        await this.execGcode(this.gcodes.home)

        // Make sure heat is ok before starting
        this.assertRunning()
        await this.execGcode(this.gcodes.heatWait)

        // Start main loop of program
        while (this.running) {
          // Measure total time
          let begin = Date.now()
          await this.resetOffset()
          // Print object
          this.assertRunning()
          await this.execGcode(this.gcodes.start)

          await this.nextPartPosition()
          
          // Print object
          this.assertRunning()
          await this.execGcode(this.gcodes.print)
          
          // Eject object
          this.assertRunning()
          await this.execGcode(this.gcodes.eject)

          // Compute duration
          let duration = Date.now() - begin
          // Count object
          this.printed(duration)
        }

        await this.execGcode(this.gcodes.end)

        console.log(this.tag, 'Finished')
        resolve('Finished printing')
      } catch (e) {
        reject(e)
      }
    })
  }

  async resetOffset(){
    // this.opts.params.printOffset = (this.opts.params.printOffset) % 100
    await this.printer.command(`G1 X0 Y0 F9000`)
    await this.printer.command(`G92 X${this.offset.x} Y${this.offset.y}`)
    await this.printer.command(`G1 X0 Y0 F9000`)
    
    this.offset = {
      x: 0,
      y: 0,
    }
  }

  async applyOffset(offset){
    await this.resetOffset()
    await this.printer.command(`G1 X0 Y0 F9000`)
    await this.printer.command(`G92 X${-offset.x} Y${-offset.y}`)
    await this.printer.command(`G1 X0 Y0 F9000`)
    this.offset = offset
  }

  async nextPartPosition() {
    
    let x = () => {
      let partNumber = this.partCount
      if (partNumber <= 85) {
        console.log("Changed")
        return (partNumber * 3)
      }
      else {
        console.log("Carry All")
        return 0
      }
    }
    let y = () => { 
      let partNumber = this.partCount
      if (partNumber <= 85) {
        return 0
      }
      else {
        console.log("Carry All")
        return 10
      }
    }

    await this.applyOffset({x, y})
  }

  assertRunning() {
    if (!this.running)
      throw new Error('Worker stopped')
  }

  async execGcode(gcode) {
    let name = chalk.yellow.bold(gcode.name)
    let begin = Date.now()
    let draft = console.draft('...')

    let lastPrint = 0

    await gcode.load()

    // Run until is not stopped/paused
    do {
      // Load next command
      let command = gcode.next()

      if (command == null) {
        break
      }

      // Log command
      draft(
        chalk.bgYellow.black(this.tag), 
        name, 
        chalk.white(gcode.percentage() + '%'),
        chalk.dim('command:'), 
        chalk.white(this.printer.gcode)
      )

      // Print status on printer every 5 seconds
      if (Date.now() > lastPrint + 5000) {
        lastPrint = Date.now()
        await this.printer.display(
          `#${this.partCount} > ${gcode.name} ${gcode.percentage()}%`)
      }

      // Wait command to finish
      await this.printer.command(command)
      // // Check if it ended
      // if (!shouldContinue) {
      //   break
      // }
    } while (this.running)
    
    let end = Date.now()
    draft(
      chalk.bgGreen.black(this.tag),
      name,
      chalk.white(toDuration(Date.now() - begin))
    )
  }
}

function toDuration(milis) {
  let mm = moment.duration(milis)
  let str = '' 
  str += (mm.hours() < 10 ? '0' : '') + mm.hours()
  str += ':'
  str += (mm.minutes() < 10 ? '0' : '') + mm.minutes()
  str += ':'
  str += (mm.seconds() < 10 ? '0' : '') + mm.seconds()

  return str
}