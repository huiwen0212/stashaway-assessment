import { transports, createLogger, format } from "winston";

const myFormat = format.combine(format.json());

const Logger = createLogger({
  level: "info",
  exitOnError: false,
  format: format.combine(format.timestamp(), myFormat),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "common.log" }),
  ],
});

Logger.add(
  new transports.Console({
    format: format.simple(),
  })
);

export { Logger };
