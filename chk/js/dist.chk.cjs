const { Logger } = require("../../dist/index.cjs");

Logger.addOutlet("dist.chk", "var/dist-chk-cjs.log")
Logger.logWarn("!");
Logger.logError("!!", true);
