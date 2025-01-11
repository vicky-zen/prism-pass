import { logger } from "./logger.js";
import process from "process";

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1); // Exit with an error code
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Promise Rejection at:", promise, "reason:", reason);
  process.exit(1); // Exit with an error code
});

// Timezone check: Ensure the timezone is UTC
function checkTimezone() {
  const timezoneOffset = new Date().getTimezoneOffset();
  if (timezoneOffset !== 0) {
    logger.error(
      `Timezone is not in UTC. Current timezone offset is: ${timezoneOffset} minutes.`
    );
    logger.error("Exiting application due to non-UTC timezone.");
    process.exit(1); // Exit with an error code due to invalid timezone
  } else {
    logger.info("Timezone is UTC. Proceeding with application startup.");
  }
}

export { checkTimezone };
