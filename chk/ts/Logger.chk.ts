import { Logger, Level, Template } from "../../src";

Logger.addOutlet("Logger.chk", "var/Logger-chk.log", {
  isolated: true,
  threshold: Level.INFO,
  template: Template.dlnm
});

console.log(Logger.getOutlet("test"));

Logger.logTrace("This is a trace message.", true);
Logger.logDebug("This is a debug message.");
Logger.logInfo("This is an info message.");
Logger.logWarn("This is a Warning!");
Logger.logError("This is an Error!", true);
Logger.logFatal("THIS IS A FATAL ERROR!", true);
