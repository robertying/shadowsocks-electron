import path from "path";
import { app } from "electron";
import winston, { format } from "winston";
import open from "open";

const { combine, simple, colorize } = format;

export const logDir = app.getPath("logs");

export const openLogDir = async () => {
  await open(logDir);
};

export const cleanLogs = async () => {};

const timestamp = format((info, opts) => {
  info.message = `${new Date().toLocaleString()} - ${info.message}`;
  return info;
});

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      filename: path.join(
        logDir,
        `shadowsocks-electron-${new Date().toISOString()}.log`
      ),
      format: combine(timestamp(), simple())
    })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), simple())
    })
  );
}

export default logger;
