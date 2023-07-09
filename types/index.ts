import { WriteStream } from "tty";

/**
 * Defines the outlet output. Can be a filename (ex: "app.log") whose path will always resolve
 * relative to the working directory, or a `WriteStream` (ex: `process.stdout`).
 *
 * @typedef {string | WriteStream}
 */
export type OutletOutput = string | WriteStream;

/**
 * Defines the range of logging levels.
 *
 * @enum {number}
 */
export enum Level {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL
}

/**
 * Defines the built-in template keys available.
 *
 * @enum {number}
 */
export enum Template {
  m,
  lm,
  lnm,
  lom,
  dlm,
  dlnm,
  dlom
}

/**
 * Defines the outlet configuration.
 *
 * @interface
 * @property {boolean} isolated - Controls whether to ignore messages logged from non-origin src.
 * @property {Level} threshold - The level the message must exceed in order to transmit.
 * @property {Template} - The formatting template to use for the message.
 */
export interface OutletConfig {
  isolated: boolean;
  threshold: Level;
  template: Template
}
