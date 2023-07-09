import Outlet from "../../src/Outlet";

const fileOutletOne = Outlet.from("test.log");
const fileOutletTwo = Outlet.from("test.log");

// console.log(Outlet["instances"]);
// console.log(Outlet["instances"][0]);
console.log(Outlet["instances"].length);

const writeStreamOutletOne = Outlet.from(process.stdout);
const writeStreamOutletTwo = Outlet.from(process.stdout);

// console.log(Outlet["instances"]);
console.log(Outlet["instances"].length);
