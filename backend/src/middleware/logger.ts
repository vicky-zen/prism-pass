import fs from "fs";
import { TransformableInfo } from "logform";
import moment from "moment";
import { createLogger, format, transports } from "winston";

export enum LogLevel {
  Error = "error",
  Warning = "warn",
  Info = "info",
  Verbose = "verbose",
  Debug = "debug",
  Silly = "silly",
}

export enum DbLogLevel {
  Error = 0,
  Warning = 1,
  Info = 2,
  Verbose = 3,
  Debug = 4,
  Silly = 5,
}

export function convertToDbLogLevel(logLevel: LogLevel): DbLogLevel {
  const logLevelMap: { [key in LogLevel]: DbLogLevel } = {
    [LogLevel.Error]: DbLogLevel.Error,
    [LogLevel.Warning]: DbLogLevel.Warning,
    [LogLevel.Info]: DbLogLevel.Info,
    [LogLevel.Verbose]: DbLogLevel.Verbose,
    [LogLevel.Debug]: DbLogLevel.Debug,
    [LogLevel.Silly]: DbLogLevel.Silly,
  };

  return logLevelMap[logLevel] ?? DbLogLevel.Debug;
}

export function canLog(targetLogLevel: DbLogLevel): boolean {
  const currentLogLevel = convertToDbLogLevel(
    (process.env.LOG_LEVEL as LogLevel) || LogLevel.Debug
  );

  return targetLogLevel <= currentLogLevel;
}

const logDir = "log";
const MESSAGE = Symbol.for("message");

function createLogDirectory() {
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
}

function jsonFormatter(logEntry: TransformableInfo) {
  const { timestamp, level, message, ...rest } = logEntry;

  const log = {
    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    level,
    message,
    data: Object.keys(rest).length ? JSON.stringify(rest) : undefined,
  };

  logEntry[MESSAGE] = JSON.stringify(log);
  return logEntry;
}

export const logger = createLogger({
  level: process.env.LOG_LEVEL || LogLevel.Debug,
  format: format.combine(
    format(jsonFormatter)(),
    format.colorize(),
    format.simple()
  ),
  transports: [new transports.Console()],
});

createLogDirectory();
