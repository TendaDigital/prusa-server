const fs = require('fs')
const path = require('path')
const format = require('string-template')

module.exports = class GcodeRunner {

  constructor(printer, file, options) {
    this.printer = printer
    this.options = options || {}
    this.options.path = file
    this.load()
  }

  load() {
    let filePath = this.options.path
    this.name = path.basename(filePath, '.gcode')

    let file = fs.readFileSync(filePath)
    this.commands = file.toString().split('\n')
    
    this.reset()
  }

  reset() {
    this.cursor = 0
  }

  percentage() {
    return Math.floor(100 * ((this.cursor - 1) / this.commands.length))
  }

  async next() {
    let command = this.commands[this.cursor++]

    if (command == null) {
      return false
    }

    // Apply template to it
    let params = this.options.params || {}
    command = format(command, params)

    await this.printer.command(command)
    return true
  }
}