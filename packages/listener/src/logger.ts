import winston, { format } from 'winston';
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  format: combine(timestamp(), format.splat(), format.simple(), myFormat),
  transports: [new winston.transports.Console()]
});

export default logger;
