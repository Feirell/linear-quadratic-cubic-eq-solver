# linear-quadratic-cubic-eq-solver

[![npm](https://img.shields.io/npm/v/linear-quadratic-cubic-eq-solver.svg)](https://www.npmjs.com/package/linear-quadratic-cubic-eq-solver)
[![GitHub issues](https://img.shields.io/github/issues/Feirell/linear-quadratic-cubic-eq-solver.svg)](https://github.com/Feirell/linear-quadratic-cubic-eq-solver/issues)

## Solve an eqaution

To solve an equation like:

![eq](./exmpl.svg)

You can use this package like this:

```js
const solver = require('linear-quadratic-cubic-eq-solver');

const solutions = solver.solveQuadraticEquation(2, -32, 2.1 - 4);
console.log('solutions', solutions);

// which returns: solutions [ 16.059156283383516, -0.05915628338351553 ]
```