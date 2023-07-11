import fs from "fs";
import cstack from "cstack";
import { Level, OutletConfig, OutletOutput, Template } from "../type";
import { getDuration } from "./helpers";
import Outlet from "./Outlet";

export const TEMPLATES: Record<string, string> = {
  m: "{message}",
  lm: "{level}: {message}",
  lnm: "{level} {name}: {message}",
  lom: "{level} {origin}: {message}",
  dlm: "{duration} {level}: {message}",
  dlnm: "{duration} {level} {name}: {message}",
  dlom: "{duration} {level} {origin}: {message}"
};

export default class Logger {
  private constructor() {}

  private static outlets = new Map<string, Outlet>([
    [
      "stdout", Outlet.from(process.stdout, {
        isolated: false,
        threshold: Outlet.config.threshold,
        template: Outlet.config.template
      })
    ]
  ]);

  /**
   * Adds outlet to `Logger.outlets`.
   *
   * Uses `Outlet.from` {@link Outlet#from} internally to avoid adding multiple references to
   * the same `Outlet` instance.
   *
   * @param {string} name - The key by which to store the `Outlet` instance on `Logger.outlets`.
   * @param {OutletOutput} output - See {@link OutletOutput}.
   * @param {OutletConfig} config - See {@link OutletConfig}.
   */
  public static addOutlet(
    name: string,
    output: OutletOutput,
    config = Outlet.config
  ): Map<string, Outlet> {
    return Logger.outlets.set(name, Outlet.from(output, config));
  }

  public static getOutlet(name: string): Outlet | undefined {
    return Logger.outlets.get(name);
  }

  public static removeOutlet(name: string): boolean {
    return Logger.outlets.delete(name);
  }

  public static clearOutlets() {
    Logger.outlets.clear();
  }

  /**
   * Sends a TRACE message to `outlets`.
   *
   * Should be used alongside ERROR or FATAL messages.
   *
   * @param {string?} message - The log message.
   * @param {boolean} reversed - A boolean for reversing the order of the stack trace.
   */
  public static logTrace(message?: string, reversed = false) {
    const stackTrace = cstack.getTrace(reversed);
    if (message === undefined || message.trim() === "") {
      Logger.log(Level.TRACE, `${stackTrace}`, reversed);
    } else {
      Logger.log(Level.TRACE, `${message}\n${stackTrace}`);
    }
  }

  /**
   * Sends a DEBUG message to `outlets`.
   */
  public static logDebug(message: string) {
    Logger.log(Level.DEBUG, message);
  }

  /**
   * Sends a DEBUG message to `outlets`.
   */
  public static logInfo(message: string) {
    Logger.log(Level.INFO, message);
  }

  /**
   * Sends a WARN message to `outlets`.
   */
  public static logWarn(message: string) {
    Logger.log(Level.WARN, message);
  }

  /**
   * Sends an ERROR message to `outlets`.
   *
   * @param {string} message - The log message.
   * @param {boolean} reversed - A boolean for reversing the order of the stack trace.
   */
  public static logError(message: string, reversed = false) {
    Logger.log(Level.ERROR, `${message}\n${cstack.getTrace(reversed)}`);
  }

  /**
   * Sends a FATAL message to `outlets` and triggers `process.exit(1)`.
   *
   * @param {string} message - The log message.
   * @param {boolean} reversed - A boolean for reversing the order of the stack trace.
   */
  public static logFatal(message: string, reversed = false) {
    Logger.log(Level.FATAL, `${message}\n${cstack.getTrace(reversed)}\nExited`);
    process.exit(1);
  }

  private static log(level: Level, message: string, raw = false) {
    const context = cstack.getStack()[3];
    for (const [name, outlet] of Logger.outlets.entries()) {
      if (level < outlet.config.threshold) {
        continue;
      }
      if (outlet.origin && outlet.config.isolated && context.srcPath !== outlet.origin.srcPath) {
        continue;
      }
      if (raw) {
        Logger.appendMessage(outlet.output, message);
        continue;
      }
      const template = TEMPLATES[Template[outlet.config.template]];
      const formattedMessage = template
        .replace("{duration}", getDuration(outlet.startDate, new Date()))
        .replace("{level}", Level[level])
        .replace("{name}", name)
        .replace("{origin}", `${context.moduleName}[${context.lineNum}:${context.colNum}]`)
        .replace("{message}", message);
      Logger.appendMessage(outlet.output, formattedMessage);
    }
  }

  private static appendMessage(output: OutletOutput, message: string) {
    if (typeof output === "string") {
      fs.appendFileSync(output, `${message}\n`);
    } else {
      output.write(`${message}\n`);
    }
  }
}
