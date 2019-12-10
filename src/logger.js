const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format

module.exports = function (app) {

  const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  })

  const logger = createLogger({

    level: 'info',
    format: combine(
      timestamp(),
      myFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'error.log', level: 'error' }),
      new transports.File({ filename: 'combined.log' })
    ],
  })

  if (process.env.NODE_ENV.trim() !== 'production') {
    logger.add(new transports.Console({
      format: format.simple()
    }))
  }

  app.set('logger', logger)
}


