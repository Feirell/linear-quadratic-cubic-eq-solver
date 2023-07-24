"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Complex {
    constructor(re, im) {
        this.re = re || 0;
        this.im = im || 0;
    }
    length() {
        const re = this.re;
        const im = this.im;
        // length of the complex number 
        return Math.sqrt(re * re + im * im);
    }
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
    const nDivByk = n / (c.re * c.re + c.im * c.im);
    return new Complex(c.re * nDivByk, -c.im * nDivByk);
};
/**
 * Calculates the complex nth-roots of the given complex number.
 */
Complex.root = function root(c, n) {
    const a = c.re;
    const b = c.im;
    // length of the complex number 
    const r = Math.sqrt(a * a + b * b);
    const phi = Math.acos(a / r);
    const roots = new Array(n);
    const nthRootOfR1 = Math.pow(r, 1 / n);
    const nthRootOfR2 = (b < 0 ? -nthRootOfR1 : nthRootOfR1);
    for (let k = 0; k < n; k++) {
        const d = (k * 2 * Math.PI + phi) / n;
        roots[k] = new Complex(nthRootOfR1 * Math.cos(d), nthRootOfR2 * Math.sin(d));
    }
    return roots;
};
/**
 * Is a simplified variant of the root(), which is somewhat faster and only returns the first root.
 */
Complex.cubicRoot = function cubicRoot(c) {
    const a = c.re;
    const b = c.im;
    // length of the complex number 
    const r = Math.sqrt(a * a + b * b);
    const nthRootOfR1 = Math.pow(r, 1 / 3);
    const nthRootOfR2 = (b < 0 ? -nthRootOfR1 : nthRootOfR1);
    const d = Math.acos(a / r) / 3;
    return new Complex(nthRootOfR1 * Math.cos(d), nthRootOfR2 * Math.sin(d));
};
exports.default = Complex;
//# sourceMappingURL=complex.js.map