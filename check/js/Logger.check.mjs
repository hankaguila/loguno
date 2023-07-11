import fs from "fs";
import { Logger, Level, Template } from "../../dist/index.mjs";

console.debug({ Logger, Level, Template }, "\n");

const codePath = "check/Logger.check.code";

const code = fs.readFileSync(codePath, "utf-8");

eval(code);
