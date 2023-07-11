import { Logger, Level, Template } from "../../../src";

export default function main() {
  Logger.addOutlet("moduleA", "var/example/moduleA.log", {
    isolated: true,
    threshold: Level.TRACE,
    template: Template.lm
  });

  Logger.logInfo("Message sent from 'moduleA.js'. This will only appear on 'moduleA.log'");
  Logger.logWarn("This will appear on both 'index.log' and 'moduleA.log'");
}
