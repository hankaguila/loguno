import { Logger } from "../../dist/index.mjs";

Logger.addOutlet("dist.chk", "var/dist-chk-mjs.log")
Logger.logWarn("!");
Logger.logError("!!", true);
