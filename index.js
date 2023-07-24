"use strict";
exports.__esModule = true;
var complex_1 = require("./complex");
/**
 * Solves 0 = a*x + b for x
 */
function solveLinearEquation(a, b) {
    if (a == 0)
        if (b != 0)
            return [];
        else
            return [0];
    else
        return [-b / a];
}
exports.solveLinearEquation = solveLinearEquation;
/**
 * Solves 0 = a*x^2 + b*x + c for x
 */
function solveQuadraticEquation(a, b, c) {
    if (a == 0) {
        return solveLinearEquation(b, c);
    }
    else {
        var p = b / a;
        var q = c / a;
        var sqrtContent = p / 2 * p / 2 - q;
        if (sqrtContent < 0) {
            var sqrtR = Math.sqrt(-sqrtContent);
            return [
                new complex_1["default"](-p / 2, sqrtR),
                new complex_1["default"](-p / 2, -sqrtR)
            ];
        }
        else {
            var sqrtR = Math.sqrt(sqrtContent);
            return [
                -p / 2 + sqrtR,
                -p / 2 - sqrtR
            ];
        }
    }
}
exports.solveQuadraticEquation = solveQuadraticEquation;
var c1Multi = new complex_1["default"](-0.5, 0.5 * Math.sqrt(3));
var c2Multi = new complex_1["default"](-0.5, -0.5 * Math.sqrt(3));
function calcC(d0, d1) {
    var sqrtContent = d1 * d1 - 4 * d0 * d0 * d0;
    if (sqrtContent < 0) {
        var imaginaryPart = Math.sqrt(-sqrtContent) / 2;
        var realPart = d1 / 2;
        // you could also use Complex.root to get all roots, to prevent the usage of 
        // multiplications for c1 and c2 in solveCubicEquation
        // const [c0,c1,c2] = Complex.root(new Complex(realPart, imaginaryPart), 3);
        return complex_1["default"].cubicRoot(new complex_1["default"](realPart, imaginaryPart));
    }
    else {
        return new complex_1["default"](Math.cbrt((d1 + Math.sqrt(sqrtContent)) / 2), 0);
    }
}
function calcX(d0, c, a, b) {
    // -1 / (3 * a) * (b + c + d / c)
    var dDivc = complex_1["default"].divideNCompl(d0, c);
    return new complex_1["default"](-(dDivc.re + c.re + b) / (3 * a), -(dDivc.im + c.im) / (3 * a));
}
/**
 * Solves 0 = a*x^3 + b*x^2 + c*x + d for x
 */
function solveCubicEquation(a, b, c, d) {
    if (a == 0) {
        return solveQuadraticEquation(b, c, d);
    }
    else if (d == 0) {
        var x = solveQuadraticEquation(a, b, c);
        var l = x.length;
        if (l == 0)
            return [];
        else if (l == 1)
            return [0, x[0]];
        else if (l == 2)
            return [0, x[0], x[1]];
    }
    else {
        var delta0 = b * b -
            3 * a * c;
        var delta1 = 2 * b * b * b -
            9 * a * b * c +
            27 * a * a * d;
        // const delta2 = 18 * a * b * c * d -
        //     4 * b * b * b * d +
        //     b * b * c * c -
        //     4 * a * c * c * c -
        //     27 * a * a * d * d;
        var c0 = calcC(delta0, delta1);
        var c1 = complex_1["default"].multiply(c0, c1Multi);
        var c2 = complex_1["default"].multiply(c0, c2Multi);
        var x0 = calcX(delta0, c0, a, b);
        var x1 = calcX(delta0, c1, a, b);
        var x2 = calcX(delta0, c2, a, b);
        return [x0, x1, x2];
    }
}
exports.solveCubicEquation = solveCubicEquation;
