import winston from "winston";
import LogzioWinstonTransport from "winston-logzio";

let log: winston.Logger;

if (process.env.NODE_ENV === "production") {
  log = winston.createLogger({
    transports: [
      new LogzioWinstonTransport({
        name: "winston_logzio",
        token: process.env.LOGZIO_TOKEN
      }),
      new winston.transports.Console()
    ]
  });
} else {
  log = winston.createLogger({
    level: "debug",
    format: winston.format.cli(),
    transports: [new winston.transports.Console()]
  });
}

export function time(message: string, timer: [number, number]) {
  const [s, ms] = process.hrtime(timer);
  log.info(`${message} in ${s}.${String(ms).substring(0, 3)}s.`);
}

log.info(`Logging has been setup for env ${process.env.NODE_ENV}`);

export default log;
