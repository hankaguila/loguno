import fs from "fs";
import os from "os";
import path from "path";
import cstack, { StackFrame } from "cstack";
import { Level, OutletConfig, OutletOutput, Template } from "../types";
import { formatDate } from "./helpers";

/**
 * Defines an outlet.
 *
 * @class
 * @static {OutletConfig} config - The default `config` an `Outlet` instance should get on creation.
 * @property {Date} startDate - The date the outlet was instantiated on.
 * @property {StackFrame} origin - The `StackFrame` in which the outlet was instantiated.
 * Necessary to establish whether `Logger` functions are called from a src different to that of
 * `origin`, which is how the `isolated` property of `OutletConfig` can work.
 * @property {OutletOutput} output - See {@link OutletOutput}.
 * @property {OutletConfig} config - See {@link OutletConfig}.
 */
export default class Outlet {
  public static config: OutletConfig = {
    isolated: true,
    threshold: process.env.NODE_ENV?.startsWith("prod") ? Level.WARN : Level.TRACE,
    template: Template.dlom,
  };

  private static instances: Outlet[] = [];

  public declare readonly startDate: Date;

  public declare readonly origin: StackFrame;

  public declare readonly output: OutletOutput;

  public declare config: OutletConfig;

  private constructor(output: OutletOutput, config: OutletConfig) {
    this.startDate = new Date();
    const primaryOrigin = cstack.getParent("Function.addOutlet");
    const fallbackOrigin = cstack.getParent("Function.from");
    this.origin = primaryOrigin ? primaryOrigin : fallbackOrigin!;
    this.output = output;
    this.config = config;
    if (typeof output === "string") {
      this.createLogFile(output);
    }
  }

  /**
   * Returns a new `Outlet` instance or an existing one, depending on whether `this.outlets`
   * already contains an `output` property that is equal to the one provided in the arguments.
   */
  public static from(output: OutletOutput, config = Outlet.config): Outlet {
    output = typeof output === "string" ? path.resolve(output) : output;
    const existingOutlet = Outlet.instances.find((outlet) => outlet["output"] === output);
    if (existingOutlet) {
      existingOutlet.config = config;
      return existingOutlet;
    }
    const outlet = new Outlet(output, config);
    Outlet.instances.push(outlet);
    return outlet;
  }

  public toString(): string {
    const value = {
      output: this.output,
      config: this.config
    };
    return JSON.stringify(value, null, 2);
  }

  private createLogFile(output: string) {
    const text = (
      `DATE: ${formatDate(this.startDate)}\n`
        + `  OS: ${os.type()} ${os.release()}\n`
        + `USER: ${os.userInfo().username}\n`
        + ` DIR: ${process.cwd()}\n`
        + ` SRC: ${cstack.getStack().slice(-1)[0].srcPath}\n\n`
    );
    const outputDir = path.dirname(output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(path.resolve(output), text, "utf-8");
  }
}
