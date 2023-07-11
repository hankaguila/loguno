import fs from "fs";
import { Outlet } from "../../dist/index.mjs";

console.debug({ Outlet }, "\n");

const codePath = "check/Outlet.check.code";

const code = fs.readFileSync(codePath, "utf-8");

eval(code);
