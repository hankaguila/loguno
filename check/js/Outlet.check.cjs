const fs = require("fs");
const { Outlet } = require("../../dist/index.cjs");

console.debug({ Outlet }, "\n");

const codePath = "check/Outlet.check.code";

const code = fs.readFileSync(codePath, "utf-8");

eval(code);
