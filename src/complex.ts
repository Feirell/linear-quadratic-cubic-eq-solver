export class Complex {
  constructor(
    public re = 0,
    public im = 0
  ) {
  }

  /**
   * Multiplies the complex numbers a and b.
   */
  static multiply(a: Complex, b: Complex): Complex {
    return new Complex(a.re * b.re - a.im * b.im,
      a.re * b.im + b.re * a.im);
  }

  /**
   * Adds Complex a to Complex b
   */
  static add(a: Complex, b: Complex): Complex {
    return new Complex(a.re + b.re, a.im + b.im);
  }

  /**
   * Divide a complex number by an real number
   *
   * n / c
   *
   * divideNCompl(3, new Complex(2, -5)) == 3 / (2 - 5i)
   */
  static divideNCompl(n: number, c: Complex): Complex {
    const nDivByk = n / (c.re * c.re + c.im * c.im);

    return new Complex(c.re * nDivByk, -c.im * nDivByk);
  }

  /**
   * Calculates the complex nth-roots of the given complex number.
   */
  static root(c: Complex, n: number): Complex[] {
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
  }

  /**
   * Is a simplified variant of the root(), which is somewhat faster and only returns the first root.
   */
  static cubicRoot(c: Complex): Complex {
    const a = c.re;
    const b = c.im;

    // length of the complex number
    const r = Math.sqrt(a * a + b * b);

    const nthRootOfR1 = Math.pow(r, 1 / 3);
    const nthRootOfR2 = (b < 0 ? -nthRootOfR1 : nthRootOfR1);
    const d = Math.acos(a / r) / 3;
    return new Complex(nthRootOfR1 * Math.cos(d), nthRootOfR2 * Math.sin(d));
  }
}
