const fs =  require("fs");
const { Logger, Level, Template } = require("../../dist/index.cjs");

console.debug({ Logger, Level, Template }, "\n");

const codePath = "check/Logger.check.code";

const code = fs.readFileSync(codePath, "utf-8");

eval(code);
