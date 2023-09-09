import { generateFattenCurve } from "../../curve.js";
import { Polygon } from "../../polygon.js";
import { Polygons } from "../../polygons.js";
import { normalize } from "../../util.js";
import { Pen } from "../../pen.js";
import Gothic from "./index.js";

function cdDrawCurveU(
	font: Gothic, polygons: Polygons,
	x1: number, y1: number, sx1: number, sy1: number,
	sx2: number, sy2: number, x2: number, y2: number,
	_ta1: number, _ta2: number) {

	let a1: number;
	let a2: number;

	let delta1 = 0;
	switch (a1! % 10) { // ?????
		case 2:
			delta1 = font.kWidth;
			break;
		case 3:
			delta1 = font.kWidth * font.kKakato;
			break;
	}

	if (delta1 !== 0) {
		const [dx1, dy1] = (x1 === sx1 && y1 === sy1)
			? [0, delta1] // ?????
			: normalize([x1 - sx1, y1 - sy1], delta1);
		x1 += dx1;
		y1 += dy1;
	}

	let delta2 = 0;
	switch (a2! % 10) { // ?????
		case 2:
			delta2 = font.kWidth;
			break;
		case 3:
			delta2 = font.kWidth * font.kKakato;
			break;
	}

	if (delta2 !== 0) {
		const [dx2, dy2] = (sx2 === x2 && sy2 === y2)
			? [0, -delta2] // ?????
			: normalize([x2 - sx2, y2 - sy2], delta2);
		x2 += dx2;
		y2 += dy2;
	}

	const { left, right } = generateFattenCurve(
		x1, y1, sx1, sy1, sx2, sy2, x2, y2,
		font.kRate,
		() => font.kWidth
	);

	const poly = new Polygon();
	const poly2 = new Polygon();
	// save to polygon
	for (const [x, y] of left) {
		poly.push(x, y);
	}
	for (const [x, y] of right) {
		poly2.push(x, y);
	}

	poly2.reverse();
	poly.concat(poly2);
	polygons.push(poly);
}

export function cdDrawBezier(
	font: Gothic, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number,
	x3: number, y3: number, x4: number, y4: number,
	a1: number, a2: number): void {
	cdDrawCurveU(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2);
}

export function cdDrawCurve(
	font: Gothic, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
	a1: number, a2: number): void {
	cdDrawCurveU(font, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2);
}

export function cdDrawLine(
	font: Gothic, polygons: Polygons,
	tx1: number, ty1: number, tx2: number, ty2: number,
	ta1: number, ta2: number): void {

	let x1;
	let y1;
	let x2;
	let y2;
	let a1;
	let a2;
	if (tx1 === tx2 && ty1 > ty2 || tx1 > tx2) {
		x1 = tx2;
		y1 = ty2;
		x2 = tx1;
		y2 = ty1;
		a1 = ta2;
		a2 = ta1;
	} else {
		x1 = tx1;
		y1 = ty1;
		x2 = tx2;
		y2 = ty2;
		a1 = ta1;
		a2 = ta2;
	}

	const pen1 = new Pen(x1, y1);
	const pen2 = new Pen(x2, y2);
	if (x1 !== x2 || y1 !== y2) { // ?????
		pen1.setDown(x2, y2);
		pen2.setUp(x1, y1);
	}

	switch (a1 % 10) {
		case 2:
			pen1.move(0, -font.kWidth);
			break;
		case 3:
			pen1.move(0, -font.kWidth * font.kKakato);
			break;
	}

	switch (a2 % 10) {
		case 2:
			pen2.move(0, font.kWidth);
			break;
		case 3:
			pen2.move(0, font.kWidth * font.kKakato);
			break;
	}

	// SUICHOKU NO ICHI ZURASHI HA Math.sin TO Math.cos NO IREKAE + x-axis MAINASU KA
	const poly = new Polygon([
		pen1.getPoint(font.kWidth, 0),
		pen2.getPoint(font.kWidth, 0),
		pen2.getPoint(-font.kWidth, 0),
		pen1.getPoint(-font.kWidth, 0),
	]);
	if (tx1 === tx2) {
		poly.reverse(); // ?????
	}

	polygons.push(poly);
}
