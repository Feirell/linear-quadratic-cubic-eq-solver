import Complex from './complex';

/**
 * Solves 0 = a*x + b for x
 */
export function solveLinearEquation(a: number, b: number) {
    if (a == 0)
        if (b != 0)
            return [];
        else
            return [0];
    else
        return [-b / a];
}

/**
 * Solves 0 = a*x^2 + b*x + c for x
 */
export function solveQuadraticEquation(a: number, b: number, c: number) {
    if (a == 0) {
        return solveLinearEquation(b, c);
    } else {
        const p = b / a;
        const q = c / a;

        const sqrtContent = p / 2 * p / 2 - q;
        if (sqrtContent < 0) {
            return [];
        } else {
            const sqrtR = Math.sqrt(sqrtContent);

            return [
                -p / 2 + sqrtR,
                -p / 2 - sqrtR
            ];
        }
    }
}

const c1Multi = new Complex(-0.5, 0.5 * Math.sqrt(3));
const c2Multi = new Complex(-0.5, -0.5 * Math.sqrt(3));

function calcC(d0: number, d1: number): Complex {
    const sqrtContent = d1 * d1 - 4 * d0 * d0 * d0;
    if (sqrtContent < 0) {
        const imaginaryPart = Math.sqrt(-sqrtContent) / 2;
        const realPart = d1 / 2;

        // you could also use Complex.root to get all roots, to prevent the usage of 
        // multiplications for c1 and c2 in solveCubicEquation
        // const [c0,c1,c2] = Complex.root(new Complex(realPart, imaginaryPart), 3);

        return Complex.cubicRoot(new Complex(realPart, imaginaryPart));
    } else {
        return new Complex(Math.cbrt((d1 + Math.sqrt(sqrtContent)) / 2), 0);
    }
}

function calcX(d0: number, c: Complex, a: number, b: number): Complex {
    // -1 / (3 * a) * (b + c + d / c)
    const dDivc = Complex.divideNCompl(d0, c);
    return new Complex(
        -(dDivc.re + c.re + b) / (3 * a),
        -(dDivc.im + c.im) / (3 * a)
    );
}

/**
 * Solves 0 = a*x^3 + b*x^2 + c*x + d for x
 */
export function solveCubicEquation(a: number, b: number, c: number, d: number) {
    if (a == 0) {
        return solveQuadraticEquation(b, c, d);
    } else if (d == 0) {
        const x = solveQuadraticEquation(a, b, c);
        const l = x.length;

        if (l == 0)
            return [];
        else if (l == 1)
            return [0, x[0]];
        else if (l == 2)
            return [0, x[0], x[1]];

    } else {

        const delta0 = b * b -
            3 * a * c;

        const delta1 = 2 * b * b * b -
            9 * a * b * c +
            27 * a * a * d;

        // const delta2 = 18 * a * b * c * d -
        //     4 * b * b * b * d +
        //     b * b * c * c -
        //     4 * a * c * c * c -
        //     27 * a * a * d * d;

        const c0 = calcC(delta0, delta1);
        const c1 = Complex.multiply(c0, c1Multi);
        const c2 = Complex.multiply(c0, c2Multi);

        const x0 = calcX(delta0, c0, a, b);
        const x1 = calcX(delta0, c1, a, b);
        const x2 = calcX(delta0, c2, a, b);

        return [x0, x1, x2];
    }
}