# linear-quadratic-cubic-eq-solver

[![npm](https://img.shields.io/npm/v/linear-quadratic-cubic-eq-solver.svg)](https://www.npmjs.com/package/linear-quadratic-cubic-eq-solver)
[![GitHub issues](https://img.shields.io/github/issues/Feirell/linear-quadratic-cubic-eq-solver.svg)](https://github.com/Feirell/linear-quadratic-cubic-eq-solver/issues)


## functions

This package exposes three different functions:

### solveLinearEquation(a, b)

Which is able to solve equations in the form of:

![0=ax+b](./example-equations/example-linear.svg)

It returns

- `[]` when there is no solution
- `[0]` when every x is an sulution
- `[x:number]` with the solution

### solveQuadraticEquation(a, b, c)

Which is able to solve equations in the form of:

![0=ax^2+bx+c](./example-equations/example-quadratic.svg)

It returns

- `[x_1:number, x_2:number]` or `[x_1:Complex, x_2:Complex]` with the two solutions
- or the return possibilities of `solveLinearEquation(a, b)` when `a == 0`


### solveCubicEquation(a, b, c, d)


Which is able to solve equations in the form of:

![0=ax^3+bx^2+cx+d](./example-equations/example-cubic.svg)

It returns

- `[x_1:number|Complex, x_2:number|Complex, x_3:number|Complex]` with the two solutions
- or the return possibilities of `solveQuadraticEquation(a, b, c)` when `a == 0`
- or `[0]` and the return possibilities of `solveQuadraticEquation(a, b, c)` when `d == 0`


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

Or if you are using it within a browser, you could use it like this:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>testing linear-quadratic-cubic-eq-solver</title>

    <script type="module" src="base.js"></script>
</head>

<body>

</body>

</html>
```

```js
// base.js
import * as solver from './node_modules/linear-quadratic-cubic-eq-solver/esm/index.js';

const solutions = solver.solveQuadraticEquation(2, -32, 2.1 - 4);
console.log('solutions', solutions);

// which returns: solutions [ 16.059156283383516, -0.05915628338351553 ]
```