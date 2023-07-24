"use strict";
exports.__esModule = true;
var Complex = /** @class */ (function () {
    function Complex(re, im) {
        this.re = re || 0;
        this.im = im || 0;
    }
    /**
     * Multiplies the complex numbers a and b.
     */
    Complex.multiply = function multiply(a, b) {
        return new Complex(a.re * b.re - a.im * b.im, a.re * b.im + b.re * a.im);
    };
    /**
     * Adds Complex a to Complex b
     */
    Complex.add = function add(a, b) {
        return new Complex(a.re + b.re, a.im + b.im);
    };
    /**
     * Divide a complex number by an real number
     *
     * n / c
     *
     * divideNCompl(3, new Complex(2, -5)) == 3 / (2 - 5i)
     */
    Complex.divideNCompl = function divideNCompl(n, c) {
        var nDivByk = n / (c.re * c.re + c.im * c.im);
        return new Complex(c.re * nDivByk, -c.im * nDivByk);
    };
    /**
     * Calculates the complex nth-roots of the given complex number.
     */
    Complex.root = function root(c, n) {
        var a = c.re;
        var b = c.im;
        // length of the complex number 
        var r = Math.sqrt(a * a + b * b);
        var phi = Math.acos(a / r);
        var roots = new Array(n);
        var nthRootOfR1 = Math.pow(r, 1 / n);
        var nthRootOfR2 = (b < 0 ? -nthRootOfR1 : nthRootOfR1);
        for (var k = 0; k < n; k++) {
            var d = (k * 2 * Math.PI + phi) / n;
            roots[k] = new Complex(nthRootOfR1 * Math.cos(d), nthRootOfR2 * Math.sin(d));
        }
        return roots;
    };
    /**
     * Is a simplified variant of the root(), which is somewhat faster and only returns the first root.
     */
    Complex.cubicRoot = function cubicRoot(c) {
        var a = c.re;
        var b = c.im;
        // length of the complex number 
        var r = Math.sqrt(a * a + b * b);
        var nthRootOfR1 = Math.pow(r, 1 / 3);
        var nthRootOfR2 = (b < 0 ? -nthRootOfR1 : nthRootOfR1);
        var d = Math.acos(a / r) / 3;
        return new Complex(nthRootOfR1 * Math.cos(d), nthRootOfR2 * Math.sin(d));
    };
    return Complex;
}());
exports["default"] = Complex;
