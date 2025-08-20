import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ level, message, timestamp, ...meta }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}  ${meta.body ? JSON.stringify(meta.body) : ""}`;
    })
  ),
  transports: [
    new transports.Console({
      format: format.simple(),
    }), // stdout → Render captures this
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

// For TypeScript IntelliSense
export type Logger = typeof logger;
export default logger;