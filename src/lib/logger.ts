/**
 * Structured logging utility for ACCACIA Upsell
 * Outputs JSON logs in production, pretty-printed in development
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private isDev = process.env.NODE_ENV === "development";

  private formatLog(entry: LogEntry): string {
    if (this.isDev) {
      const timestamp = new Date(entry.timestamp).toLocaleTimeString();
      const level = entry.level.toUpperCase().padEnd(5);
      const emoji = {
        info: "ℹ️",
        warn: "⚠️",
        error: "❌",
        debug: "🔍",
      }[entry.level];

      let output = `${emoji} [${timestamp}] ${level} ${entry.message}`;

      if (entry.context && Object.keys(entry.context).length > 0) {
        output += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`;
      }

      if (entry.error) {
        output += `\n  Error: ${entry.error.name}: ${entry.error.message}`;
        if (entry.error.stack) {
          output += `\n  Stack: ${entry.error.stack}`;
        }
      }

      return output;
    }

    return JSON.stringify(entry);
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    const output = this.formatLog(entry);

    switch (level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      case "debug":
        console.debug(output);
        break;
      default:
        console.log(output);
    }
  }

  info(message: string, context?: LogContext) {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log("warn", message, context);
  }

  error(message: string, contextOrError?: LogContext | Error, error?: Error) {
    if (contextOrError instanceof Error) {
      this.log("error", message, undefined, contextOrError);
    } else {
      this.log("error", message, contextOrError, error);
    }
  }

  debug(message: string, context?: LogContext) {
    if (this.isDev) {
      this.log("debug", message, context);
    }
  }

  // Specific domain loggers
  payment(action: string, context: LogContext) {
    this.info(`[PAYMENT] ${action}`, context);
  }

  webhook(action: string, context: LogContext) {
    this.info(`[WEBHOOK] ${action}`, context);
  }

  qr(action: string, context: LogContext) {
    this.info(`[QR] ${action}`, context);
  }
}

export const logger = new Logger();
