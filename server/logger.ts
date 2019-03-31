import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

let log: winston.Logger;

if (process.env.NODE_ENV === "production") {
  log = winston.createLogger({
    level: "info",
    format: winston.format.simple(),
    transports: [
      new DailyRotateFile({
        filename: "app-%DATE%.log",
        datePattern: "YYYY-MM-DD-HH",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d"
      })
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
  log.info(`${message} in ${s}s ${ms}ms`);
}

export default log;
