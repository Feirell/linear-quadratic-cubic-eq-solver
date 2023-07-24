"use strict";
// import {
//   solveLinearEquation,
//   solveQuadraticEquation,
//   solveCubicEquation
// } from "./index";
// import { createNewBodyWithParamsReplaced } from "./transform-merged-to-array";
Object.defineProperty(exports, "__esModule", { value: true });
// const createMapperWithMemory = (fnc: (name: string) => string) => {
//   const internalMap = new Map<string, string>();
//   return (name: string) => {
//     if (!internalMap.has(name)) internalMap.set(name, fnc(name));
//     return internalMap.get(name);
//   };
// };
// const createMapper = (counter: { count: number }) =>
//   createMapperWithMemory(
//     name => name + "$" + ("" + counter.count++).padStart(2, "0")
//   );
// const globalCounter = { count: 0 };
// for (const fnc of [
//   solveLinearEquation,
//   solveQuadraticEquation,
//   solveCubicEquation
// ]) {
//   const mapper = createMapper(globalCounter);
//   const f = createNewBodyWithParamsReplaced(fnc, mapper);
//   console.log(f);
// }
const complex_1 = require("./complex");
const c = new complex_1.default(-88, -16);
// console.log('Das ist ein Test');
console.log(complex_1.default.root(c, 3));
//stop
//# sourceMappingURL=transform-all-functions-to-assembled.js.map