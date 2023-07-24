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
        if (b == 0)
            if (c != 0)
                return [];
            else
                return [0];
        else
            return [-c / b];
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
function solveCubicEquation(a, b, c, d) {
    if (a == 0) {
        if (b == 0) {
            if (c == 0)
                if (d != 0)
                    return [];
                else
                    return [0];
            else
                return [-d / c];
        }
        else {
            var p = c / b;
            var q = d / b;
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
    else if (d == 0) {
        if (a == 0) {
            if (b == 0)
                if (c != 0)
                    return [];
                else
                    return [0];
            else
                return [0, -c / b];
        }
        else {
            var p = b / a;
            var q = c / a;
            var sqrtContent = p / 2 * p / 2 - q;
            if (sqrtContent < 0) {
                var sqrtR = Math.sqrt(-sqrtContent);
                return [0,
                    new complex_1["default"](-p / 2, sqrtR),
                    new complex_1["default"](-p / 2, -sqrtR)
                ];
            }
            else {
                var sqrtR = Math.sqrt(sqrtContent);
                return [0,
                    -p / 2 + sqrtR,
                    -p / 2 - sqrtR
                ];
            }
        }
    }
    else {
        var delta0 = b * b -
            3 * a * c;
        var delta1 = 2 * b * b * b -
            9 * a * b * c +
            27 * a * a * d;
        var sqrtContent = delta1 * delta1 - 4 * delta0 * delta0 * delta0;
        var c0 = void 0;
        if (sqrtContent < 0) {
            var imaginaryPart = Math.sqrt(-sqrtContent) / 2;
            var realPart = delta1 / 2;
            c0 = complex_1["default"].cubicRoot(new complex_1["default"](realPart, imaginaryPart));
        }
        else {
            c0 = new complex_1["default"](Math.cbrt((delta1 + Math.sqrt(sqrtContent)) / 2), 0);
        }
        var c1 = complex_1["default"].multiply(c0, c1Multi);
        var c2 = complex_1["default"].multiply(c0, c2Multi);
        var dDivc0 = complex_1["default"].divideNCompl(delta0, c0);
        var x0 = new complex_1["default"](-(dDivc0.re + c0.re + b) / (3 * a), -(dDivc0.im + c0.im) / (3 * a));
        var dDivc1 = complex_1["default"].divideNCompl(delta0, c1);
        var x1 = new complex_1["default"](-(dDivc1.re + c1.re + b) / (3 * a), -(dDivc1.im + c1.im) / (3 * a));
        var dDivc2 = complex_1["default"].divideNCompl(delta0, c2);
        var x2 = new complex_1["default"](-(dDivc2.re + c2.re + b) / (3 * a), -(dDivc2.im + c2.im) / (3 * a));
        return [x0, x1, x2];
    }
}
exports.solveCubicEquation = solveCubicEquation;
