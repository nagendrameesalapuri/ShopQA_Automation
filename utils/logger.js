const fs = require("fs");
const path = require("path");

/**
 * Logger utility for consistent logging across tests
 */
class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, "../logs");
    this.ensureLogsDirectory();
  }

  /**
   * Ensure logs directory exists
   */
  ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  /**
   * Get formatted timestamp
   * @returns {string} ISO timestamp
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Get log file path for today
   * @returns {string} Path to log file
   */
  getLogFilePath() {
    const dateStr = new Date().toISOString().split("T")[0];
    return path.join(this.logsDir, `${dateStr}.log`);
  }

  /**
   * Write message to log file
   * @param {string} message - Message to log
   */
  writeToFile(message) {
    try {
      fs.appendFileSync(this.getLogFilePath(), message + "\n");
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  }

  /**
   * Format log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @returns {string} Formatted message
   */
  formatMessage(level, message) {
    return `[${this.getTimestamp()}] [${level}] ${message}`;
  }

  /**
   * Log info message
   * @param {string} message - Message to log
   */
  info(message) {
    const formattedMessage = this.formatMessage("INFO", message);
    console.log(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  /**
   * Log error message
   * @param {string} message - Message to log
   */
  error(message) {
    const formattedMessage = this.formatMessage("ERROR", message);
    console.error(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  /**
   * Log warning message
   * @param {string} message - Message to log
   */
  warn(message) {
    const formattedMessage = this.formatMessage("WARN", message);
    console.warn(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  /**
   * Log debug message
   * @param {string} message - Message to log
   */
  debug(message) {
    const formattedMessage = this.formatMessage("DEBUG", message);
    console.debug(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  /**
   * Log test start
   * @param {string} testName - Name of test
   */
  testStart(testName) {
    this.info(`START: ${testName}`);
  }

  /**
   * Log test pass
   * @param {string} testName - Name of test
   */
  testPass(testName) {
    this.info(`PASS: ${testName}`);
  }

  /**
   * Log test fail
   * @param {string} testName - Name of test
   * @param {string} error - Error message
   */
  testFail(testName, error) {
    this.error(`FAIL: ${testName} - ${error}`);
  }
}

module.exports = new Logger();
