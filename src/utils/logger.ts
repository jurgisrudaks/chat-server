import { createLogger, format, transports } from 'winston';
const { combine, timestamp, colorize, align, printf } = format;

const dateString = new Date().toJSON().split('T')[0];
const logsPath = process.env.LOGS_PATH || 'logs';

const logger = createLogger({
  level: process.env.LOG_LEVEL,
  format: combine(
    timestamp(),
    printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        align(),
        printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
    }),
    new transports.File({
      filename: `${logsPath}/error/${dateString}.log`,
      level: 'error',
    }),
    new transports.File({
      filename: `${logsPath}/combined/${dateString}.log`,
    }),
  ],
});

export default logger;
