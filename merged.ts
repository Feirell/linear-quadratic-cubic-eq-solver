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
        if (b == 0)
            if (c != 0)
                return [];
            else
                return [0];
        else
            return [-c / b];
    } else {
        const p = b / a;
        const q = c / a;

        const sqrtContent = p / 2 * p / 2 - q;
        if (sqrtContent < 0) {
            const sqrtR = Math.sqrt(-sqrtContent);

            return [
                new Complex(-p / 2, sqrtR),
                new Complex(-p / 2, -sqrtR)
            ];
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

export function solveCubicEquation(a, b, c, d) {
    if (a == 0) {
        if (b == 0) {
            if (c == 0)
                if (d != 0)
                    return [];
                else
                    return [0];
            else
                return [-d / c];
        } else {
            const p = c / b;
            const q = d / b;

            const sqrtContent = p / 2 * p / 2 - q;
            if (sqrtContent < 0) {
                const sqrtR = Math.sqrt(-sqrtContent);

                return [
                    new Complex(-p / 2, sqrtR),
                    new Complex(-p / 2, -sqrtR)
                ];
            } else {
                const sqrtR = Math.sqrt(sqrtContent);

                return [
                    -p / 2 + sqrtR,
                    -p / 2 - sqrtR
                ];
            }
        }
    } else if (d == 0) {
        if (a == 0) {
            if (b == 0)
                if (c != 0)
                    return [];
                else
                    return [0];
            else
                return [0, -c / b];
        } else {
            const p = b / a;
            const q = c / a;

            const sqrtContent = p / 2 * p / 2 - q;
            if (sqrtContent < 0) {
                const sqrtR = Math.sqrt(-sqrtContent);

                return [0,
                    new Complex(-p / 2, sqrtR),
                    new Complex(-p / 2, -sqrtR)
                ];
            } else {
                const sqrtR = Math.sqrt(sqrtContent);

                return [0,
                    -p / 2 + sqrtR,
                    -p / 2 - sqrtR
                ];
            }
        }
    } else {
        const delta0 = b * b -
            3 * a * c;

        const delta1 = 2 * b * b * b -
            9 * a * b * c +
            27 * a * a * d;


        const sqrtContent = delta1 * delta1 - 4 * delta0 * delta0 * delta0;
        let c0: Complex;

        if (sqrtContent < 0) {
            const imaginaryPart = Math.sqrt(-sqrtContent) / 2;
            const realPart = delta1 / 2;

            c0 = Complex.cubicRoot(new Complex(realPart, imaginaryPart));
        } else {
            c0 = new Complex(Math.cbrt((delta1 + Math.sqrt(sqrtContent)) / 2), 0);
        }

        const c1 = Complex.multiply(c0, c1Multi);
        const c2 = Complex.multiply(c0, c2Multi);

        const dDivc0 = Complex.divideNCompl(delta0, c0);
        const x0 = new Complex(
            -(dDivc0.re + c0.re + b) / (3 * a),
            -(dDivc0.im + c0.im) / (3 * a)
        );

        const dDivc1 = Complex.divideNCompl(delta0, c1);
        const x1 = new Complex(
            -(dDivc1.re + c1.re + b) / (3 * a),
            -(dDivc1.im + c1.im) / (3 * a)
        );

        const dDivc2 = Complex.divideNCompl(delta0, c2);
        const x2 = new Complex(
            -(dDivc2.re + c2.re + b) / (3 * a),
            -(dDivc2.im + c2.im) / (3 * a)
        );

        return [x0, x1, x2];
    }
}