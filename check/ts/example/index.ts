import { Level, Logger, Template } from "../../../src";
import moduleA from "./moduleA";
import moduleB from "./moduleB";

Logger.addOutlet("index", "var/example/index.log", {
  isolated: false,
  threshold: Level.WARN,
  template: Template.dlom
});

Logger.logWarn("Message sent from 'index.js'");
Logger.logDebug("Given this outlet's threshold, this will not appear on 'index.log'");

moduleA();
moduleB();
