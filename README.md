# linear-quadratic-cubic-eq-solver

[![npm](https://img.shields.io/npm/v/linear-quadratic-cubic-eq-solver.svg)](https://www.npmjs.com/package/linear-quadratic-cubic-eq-solver)
[![GitHub issues](https://img.shields.io/github/issues/Feirell/linear-quadratic-cubic-eq-solver.svg)](https://github.com/Feirell/linear-quadratic-cubic-eq-solver/issues)


<!-- To produce a pdf with the equation use the conv.js

node example-equations/conv.js example-equations/example-1.svg 4=2x^2-32x+2.1
-->

## Solve an eqaution

To solve an equation like:

![eq](./example-equations/example-1.svg)

You can use this package like this:

```js
const solver = require('linear-quadratic-cubic-eq-solver');

const solutions = solver.solveQuadraticEquation(2, -32, 2.1 - 4);
console.log('solutions', solutions);

// which returns: solutions [ 16.059156283383516, -0.05915628338351553 ]
```