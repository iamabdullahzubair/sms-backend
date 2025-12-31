const chalk = require("chalk").default;

class Logging {
  static formatMessage(level, color, message) {
    console.log(
      `${color(`\n[${new Date().toLocaleString()}]\n`)}${color(`[${level}]:`)} `,
      color(message.toString()),
      "\n"
    );
  }

  static info(message) {
    this.formatMessage("INFO", chalk.blue, message);
  }

  static warn(message) {
    this.formatMessage("WARNING", chalk.yellow, message);
  }

  static error(message) {
    this.formatMessage("ERROR", chalk.red, message);
  }

  static success(message) {
    this.formatMessage("SUCCESS", chalk.green, message);
  }

  static apiLog(message) {
    this.formatMessage("API", chalk.magenta, message);
  }

  static queryLog(message) {
    this.formatMessage('QUERY', chalk.cyan, message);
  }
}

module.exports = Logging;
