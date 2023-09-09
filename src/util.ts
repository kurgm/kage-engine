/** @internal */
// @ts-expect-error Math.hypot is not defined in es5
export const hypot: (x: number, y: number) => number = Math.hypot ? Math.hypot.bind(Math) : ((x, y) => Math.sqrt(x * x + y * y));

/**
 * Calculates a new vector with the same angle and a new magnitude. 
 * @internal
 */
export function normalize([x, y]: [number, number], magnitude: number = 1): [number, number] {
	if (x === 0 && y === 0) {
		// Angle is the same as Math.atan2(y, x)
		return [1 / x === Infinity ? magnitude : -magnitude, 0];
	}
	const k = magnitude / hypot(x, y);
	return [x * k, y * k];
}

/** @internal */
export function quadraticBezier(p1: number, p2: number, p3: number, t: number): number {
	const s = 1 - t;
	return (s * s) * p1 + 2 * (s * t) * p2 + (t * t) * p3;
}

/**
 * Returns d/dt(quadraticBezier)
 * @internal
 */
export function quadraticBezierDeriv(p1: number, p2: number, p3: number, t: number): number {
	// const s = 1 - t;
	// ds/dt = -1
	// return (-2 * s) * p1 + 2 * (s - t) * p2 + (2 * t) * p3;
	return 2 * (t * (p1 - 2 * p2 + p3) - p1 + p2);
}

/** @internal */
export function cubicBezier(p1: number, p2: number, p3: number, p4: number, t: number): number {
	const s = 1 - t;
	return (s * s * s) * p1 + 3 * (s * s * t) * p2 + 3 * (s * t * t) * p3 + (t * t * t) * p4;
}

/**
 * Returns d/dt(cubicBezier) 
 * @internal
 */
export function cubicBezierDeriv(p1: number, p2: number, p3: number, p4: number, t: number): number {
	// const s = 1 - t;
	// ds/dt = -1
	// const ss = s * s;
	// const st = s * t;
	// const tt = t * t;
	// return (-3 * ss) * p1 + 3 * (ss - 2 * st) * p2 + 3 * (2 * st - tt) * p3 + (3 * tt) * p4;
	return 3 * (t * (t * (-p1 + 3 * p2 - 3 * p3 + p4) + 2 * (p1 - 2 * p2 + p3)) - p1 + p2);
}

/**
 * Find the minimum of a function by ternary search. 
 * @internal
 */
export function ternarySearchMin(func: (x: number) => number, left: number, right: number, eps: number = 1E-5): number {
	while (left + eps < right) {
		const x1 = left + (right - left) / 3;
		const x2 = right - (right - left) / 3;
		const y1 = func(x1);
		const y2 = func(x2);
		if (y1 < y2) {
			right = x2;
		} else {
			left = x1;
		}
	}
	return left + (right - left) / 2;
}

/**
 * Find the maximum of a function by ternary search. 
 * @internal
 */
export function ternarySearchMax(func: (x: number) => number, left: number, right: number, eps?: number): number {
	return ternarySearchMin((x) => -func(x), left, right, eps);
}

/** @internal */
export function round(v: number, rate: number = 1E8): number {
	return Math.round(v * rate) / rate;
}
