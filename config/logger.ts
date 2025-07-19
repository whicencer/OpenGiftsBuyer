import winston from "winston";

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.printf(log => log.message as string) }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: winston.format.printf(log => log.message as string)
    }),
  ],
});

export default logger;