import { normalize, quadraticBezier, quadraticBezierDeriv, cubicBezier, cubicBezierDeriv, ternarySearchMin, round } from "./util.js";

/** @internal */
export function divide_curve(
	x1: number, y1: number,
	sx1: number, sy1: number,
	x2: number, y2: number, curve: [number, number][]): { index: number, off: [number[], number[]] } {
	const rate = 0.5;
	const cut = Math.floor(curve.length * rate);
	const cut_rate = cut / curve.length;
	const tx1 = x1 + (sx1 - x1) * cut_rate;
	const ty1 = y1 + (sy1 - y1) * cut_rate;
	const tx2 = sx1 + (x2 - sx1) * cut_rate;
	const ty2 = sy1 + (y2 - sy1) * cut_rate;
	const tx3 = tx1 + (tx2 - tx1) * cut_rate;
	const ty3 = ty1 + (ty2 - ty1) * cut_rate;

	// must think about 0 : <0
	return {
		index: cut,
		off: [[x1, y1, tx1, ty1, tx3, ty3], [tx3, ty3, tx2, ty2, x2, y2]],
	};
}

// ------------------------------------------------------------------
/** @internal */
export function find_offcurve(
	curve: [number, number][], sx: number, sy: number): number[] {
	const [nx1, ny1] = curve[0];
	const [nx2, ny2] = curve[curve.length - 1];

	const area = 8;

	const minx = ternarySearchMin((tx) => curve.reduce((diff, p, i) => {
		const t = i / (curve.length - 1);
		const x = quadraticBezier(nx1, tx, nx2, t);

		return diff + (p[0] - x) ** 2;
	}, 0), sx - area, sx + area);

	const miny = ternarySearchMin((ty) => curve.reduce((diff, p, i) => {
		const t = i / (curve.length - 1);
		const y = quadraticBezier(ny1, ty, ny2, t);

		return diff + (p[1] - y) ** 2;
	}, 0), sy - area, sy + area);

	return [nx1, ny1, minx, miny, nx2, ny2];
}

// ------------------------------------------------------------------
/** @internal */
export function generateFattenCurve(
	x1: number, y1: number, sx1: number, sy1: number,
	sx2: number, sy2: number, x2: number, y2: number,
	kRate: number, widthFunc: (t: number) => number
): { left: [number, number][]; right: [number, number][] } {
	const curve: { left: [number, number][]; right: [number, number][] } = { left: [], right: [] };

	const isQuadratic = sx1 === sx2 && sy1 === sy2;
	let xFunc, yFunc, ixFunc, iyFunc;
	if (isQuadratic) {
		// Spline
		xFunc = (t: number) => quadraticBezier(x1, sx1, x2, t);
		yFunc = (t: number) => quadraticBezier(y1, sy1, y2, t);
		ixFunc = (t: number) => quadraticBezierDeriv(x1, sx1, x2, t);
		iyFunc = (t: number) => quadraticBezierDeriv(y1, sy1, y2, t);
	} else { // Bezier
		xFunc = (t: number) => cubicBezier(x1, sx1, sx2, x2, t);
		yFunc = (t: number) => cubicBezier(y1, sy1, sy2, y2, t);
		ixFunc = (t: number) => cubicBezierDeriv(x1, sx1, sx2, x2, t);
		iyFunc = (t: number) => cubicBezierDeriv(y1, sy1, sy2, y2, t);
	}

	for (let tt = 0; tt <= 1000; tt += kRate) {
		const t = tt / 1000;

		// calculate a dot
		const x = xFunc(t);
		const y = yFunc(t);

		// KATAMUKI of vector by BIBUN
		const ix = ixFunc(t);
		const iy = iyFunc(t);

		const width = widthFunc(t);

		// line SUICHOKU by vector
		const [ia, ib] = (round(ix) === 0 && round(iy) === 0)
			? [-width, 0] // ?????
			: normalize([-iy, ix], width);

		curve.left.push([x - ia, y - ib]);
		curve.right.push([x + ia, y + ib]);
	}
	return curve;
}
