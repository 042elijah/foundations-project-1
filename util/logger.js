const { createLogger, transports, format } = require("winston");

// create a logger instance
const logger = createLogger({
    level: "info", // log only messages with level 'info' and above
    format: format.combine(
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
      })
    ),
    transports: [
      new transports.File({ filename: "./logs/error.log", level:'error'}), // log errors
      new transports.File({ filename: "./logs/app.log" }), // log activities
    ],
  });

  process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception: ${error}`);
    process.exit(1);
  });

  module.exports = { logger };