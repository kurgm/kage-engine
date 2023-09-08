import { divide_curve, find_offcurve, generateFattenCurve } from "../../curve";
import { Polygon } from "../../polygon";
import { Polygons } from "../../polygons";
import { hypot, normalize } from "../../util";
import { Pen } from "../../pen";
import Mincho from ".";

function cdDrawCurveU(
	font: Mincho, polygons: Polygons,
	x1: number, y1: number, sx1: number, sy1: number,
	sx2: number, sy2: number, x2: number, y2: number,
	ta1: number, ta2: number,
	opt1: number, haneAdjustment: number, opt3: number, opt4: number) {

	const a1 = ta1;
	const a2 = ta2;

	const kMinWidthT = font.kMinWidthT - opt1 / 2;

	let delta1;
	switch (a1 % 100) {
		case 0:
		case 7:
		case 27:
			delta1 = -1 * font.kMinWidthY * 0.5;
			break;
		case 1:
		case 2: // ... must be 32
		case 6:
		case 22:
		case 32: // changed
			delta1 = 0;
			break;
		case 12:
			// case 32:
			delta1 = font.kMinWidthY;
			break;
		default:
			return;
	}

	if (delta1 !== 0) {
		const [dx1, dy1] = (x1 === sx1 && y1 === sy1)
			? [0, delta1] // ?????
			: normalize([x1 - sx1, y1 - sy1], delta1);
		x1 += dx1;
		y1 += dy1;
	}

	let cornerOffset = 0;
	if ((a1 === 22 || a1 === 27) && a2 === 7 && kMinWidthT > 6) {
		const contourLength = hypot(sx1 - x1, sy1 - y1) + hypot(sx2 - sx1, sy2 - sy1) + hypot(x2 - sx2, y2 - sy2);
		if (contourLength < 100) {
			cornerOffset = (kMinWidthT - 6) * ((100 - contourLength) / 100);
			x1 += cornerOffset;
		}
	}

	let delta2;
	switch (a2 % 100) {
		case 0:
		case 1:
		case 7:
		case 9:
		case 15: // it can change to 15->5
		case 14: // it can change to 14->4
		case 17: // no need
		case 5:
			delta2 = 0;
			break;
		case 8: // get shorten for tail's circle
			delta2 = -1 * kMinWidthT * 0.5;
			break;
		default:
			delta2 = delta1; // ?????
			break;
	}

	if (delta2 !== 0) {
		const [dx2, dy2] = (sx2 === x2 && sy2 === y2)
			? [0, -delta2] // ?????
			: normalize([x2 - sx2, y2 - sy2], delta2);
		x2 += dx2;
		y2 += dy2;
	}

	const isQuadratic = sx1 === sx2 && sy1 === sy2;

	// ---------------------------------------------------------------

	if (isQuadratic && font.kUseCurve) {
		// Spline
		// generating fatten curve -- begin

		const hosomi = 0.5;
		const deltadFunc: (t: number) => number
			= (a1 === 7 && a2 === 0) // L2RD: fatten
				? (t) => t ** hosomi * 1.1 // should be font.kL2RDfatten ?
				: (a1 === 7)
					? (t) => t ** hosomi
					: (a2 === 7)
						? (t) => (1 - t) ** hosomi
						: (opt3 > 0) // should be (opt3 > 0 || opt4 > 0) ?
							? (t) => 1 - opt3 / 2 / (kMinWidthT - opt4 / 2) + opt3 / 2 / (kMinWidthT - opt4) * t // ??????
							: () => 1;

		const { left: curveL, right: curveR } = generateFattenCurve(
			x1, y1, sx1, sy1, sx1, sy1, x2, y2,
			10,
			(t) => {
				let deltad = deltadFunc(t);

				if (deltad < 0.15) {
					deltad = 0.15;
				}
				return kMinWidthT * deltad;
			}
		); // L and R

		const { off: [offL1, offL2], index: indexL } = divide_curve(x1, y1, sx1, sy1, x2, y2, curveL);
		const curveL1 = curveL.slice(0, indexL + 1);
		const curveL2 = curveL.slice(indexL);
		const { off: [offR1, offR2], index: indexR } = divide_curve(x1, y1, sx1, sy1, x2, y2, curveR);

		const ncl1 = find_offcurve(curveL1, offL1[2], offL1[3]);
		const ncl2 = find_offcurve(curveL2, offL2[2], offL2[3]);

		const poly = new Polygon([
			{ x: ncl1[0], y: ncl1[1] },
			{ x: ncl1[2], y: ncl1[3], off: true },
			{ x: ncl1[4], y: ncl1[5] },
			{ x: ncl2[2], y: ncl2[3], off: true },
			{ x: ncl2[4], y: ncl2[5] },
		]);

		const poly2 = new Polygon([
			{ x: curveR[0][0], y: curveR[0][1] },
			{
				x: offR1[2] - (ncl1[2] - offL1[2]),
				y: offR1[3] - (ncl1[3] - offL1[3]),
				off: true,
			},
			{ x: curveR[indexR][0], y: curveR[indexR][1] },
			{
				x: offR2[2] - (ncl2[2] - offL2[2]),
				y: offR2[3] - (ncl2[3] - offL2[3]),
				off: true,
			},
			{ x: curveR[curveR.length - 1][0], y: curveR[curveR.length - 1][1] },
		]);

		poly2.reverse();
		poly.concat(poly2);
		polygons.push(poly);
		// generating fatten curve -- end
	} else {
		let hosomi = 0.5;
		if (hypot(x2 - x1, y2 - y1) < 50) {
			hosomi += 0.4 * (1 - hypot(x2 - x1, y2 - y1) / 50);
		}

		const deltadFunc: (t: number) => number
			= (a1 === 7 || a1 === 27) && a2 === 0 // L2RD: fatten
				? (t) => t ** hosomi * font.kL2RDfatten
				: (a1 === 7 || a1 === 27)
					? (isQuadratic) // ?????
						? (t) => t ** hosomi
						: (t) => (t ** hosomi) ** 0.7 // make fatten
					: a2 === 7
						? (t) => (1 - t) ** hosomi
						: isQuadratic && (opt3 > 0 || opt4 > 0) // ?????
							? (t) => ((font.kMinWidthT - opt3 / 2) - (opt4 - opt3) / 2 * t) / font.kMinWidthT
							: () => 1;

		const { left, right } = generateFattenCurve(
			x1, y1, sx1, sy1, sx2, sy2, x2, y2,
			font.kRate,
			(t) => {
				let deltad = deltadFunc(t);

				if (deltad < 0.15) {
					deltad = 0.15;
				}

				return kMinWidthT * deltad;
			}
		);

		const poly = new Polygon();
		const poly2 = new Polygon();
		// copy to polygon structure
		for (const [x, y] of left) {
			poly.push(x, y);
		}
		for (const [x, y] of right) {
			poly2.push(x, y);
		}

		// suiheisen ni setsuzoku
		if (a1 === 132 || a1 === 22 && (isQuadratic ? (y1 > y2) : (x1 > sx1))) { // ?????
			poly.floor();
			poly2.floor();
			for (let index = 0, length = poly2.length; index + 1 < length; index++) {
				const point1 = poly2.get(index);
				const point2 = poly2.get(index + 1);
				if (point1.y <= y1 && y1 <= point2.y) {
					const newx1 = point2.x + (point1.x - point2.x) * (y1 - point2.y) / (point1.y - point2.y);
					const newy1 = y1;
					const point3 = poly.get(0);
					const point4 = poly.get(1);
					const newx2 =
						(a1 === 132) // ?????
							? point3.x + (point4.x - point3.x) * (y1 - point3.y) / (point4.y - point3.y)
							: point3.x + (point4.x - point3.x + 1) * (y1 - point3.y) / (point4.y - point3.y); // "+ 1"?????
					const newy2 =
						(a1 === 132) // ?????
							? y1
							: y1 + 1; // "+ 1"?????

					for (let i = 0; i < index; i++) {
						poly2.shift();
					}
					poly2.set(0, newx1, newy1);
					poly.unshift(newx2, newy2);
					break;
				}
			}
		}

		poly2.reverse();
		poly.concat(poly2);
		polygons.push(poly);
	}

	// process for head of stroke

	switch (a1) {
		case 12: {
			const pen1 = new Pen(x1, y1);
			if (x1 !== sx1) { // ?????
				pen1.setDown(sx1, sy1);
			}
			const poly = pen1.getPolygon([
				{ x: -kMinWidthT, y: 0 },
				{ x: +kMinWidthT, y: 0 },
				{ x: -kMinWidthT, y: -kMinWidthT },
			]);
			polygons.push(poly);
			break;
		}
		case 0: {
			if (y1 <= y2) { // from up to bottom
				const pen1 = new Pen(x1, y1);
				if (x1 !== sx1) { // ?????
					pen1.setDown(sx1, sy1);
				}
				let type = Math.atan2(Math.abs(y1 - sy1), Math.abs(x1 - sx1)) / Math.PI * 2 - 0.4;
				if (type > 0) {
					type *= 2;
				} else {
					type *= 16;
				}
				const pm = type < 0 ? -1 : 1;
				const poly = pen1.getPolygon([
					{ x: -kMinWidthT, y: 1 }, // 1 ???
					{ x: +kMinWidthT, y: 0 },
					{ x: -pm * kMinWidthT, y: -font.kMinWidthY * Math.abs(type) },
				]);
				// if(x1 > x2){
				//  poly.reverse();
				// }
				polygons.push(poly);
				// beginning of the stroke
				const move = type < 0 ? -type * font.kMinWidthY : 0;
				const poly2 = pen1.getPolygon((x1 === sx1 && y1 === sy1) // ?????
					? [ // type === -6.4 && pm === -1 && move === 6.4 * font.kMinWidthY
						{ x: kMinWidthT, y: -move },
						{ x: kMinWidthT * 1.5, y: font.kMinWidthY - move },
						{ x: kMinWidthT - 2, y: font.kMinWidthY * 2 + 1 },
					]
					: [
						{ x: kMinWidthT, y: -move },
						{ x: kMinWidthT * 1.5, y: font.kMinWidthY - move * 1.2 },
						{ x: kMinWidthT - 2, y: font.kMinWidthY * 2 - move * 0.8 + 1 },
						// if(x1 < x2){
						//  poly2.reverse();
						// }
					]
				);
				polygons.push(poly2);
			} else { // bottom to up
				const pen1 = new Pen(x1, y1);
				if (x1 === sx1) {
					pen1.setMatrix2(0, 1); // ?????
				} else {
					pen1.setRight(sx1, sy1);
				}
				const poly = pen1.getPolygon([
					{ x: 0, y: +kMinWidthT },
					{ x: 0, y: -kMinWidthT },
					{ x: -font.kMinWidthY, y: -kMinWidthT },
				]);
				// if(x1 < x2){
				//  poly.reverse();
				// }
				polygons.push(poly);
				// beginning of the stroke
				const poly2 = pen1.getPolygon([
					{ x: 0, y: +kMinWidthT },
					{ x: +font.kMinWidthY, y: +kMinWidthT * 1.5 },
					{ x: +font.kMinWidthY * 3, y: +kMinWidthT * 0.5 },
				]);
				// if(x1 < x2){
				//  poly2.reverse();
				// }
				polygons.push(poly2);
			}
			break;
		}
		case 22:
		case 27: { // box's up-right corner, any time same degree
			const poly = new Pen(x1 - cornerOffset, y1).getPolygon([
				{ x: -kMinWidthT, y: -font.kMinWidthY },
				{ x: 0, y: -font.kMinWidthY - font.kWidth },
				{ x: +kMinWidthT + font.kWidth, y: +font.kMinWidthY },
				{ x: +kMinWidthT, y: +kMinWidthT - 1 },
			].concat((a1 === 27)
				? [
					{ x: 0, y: +kMinWidthT + 2 },
					{ x: 0, y: 0 },
				]
				: [
					{ x: -kMinWidthT, y: +kMinWidthT + 4 },
				]));
			polygons.push(poly);
			break;
		}
	}

	// process for tail

	switch (a2) {
		case 1:
		case 8:
		case 15: { // the last filled circle ... it can change 15->5
			const kMinWidthT2 = font.kMinWidthT - opt4 / 2;
			const pen2 = new Pen(x2, y2);
			if (sx2 === x2) {
				pen2.setMatrix2(0, 1); // ?????
			} else if (sy2 !== y2) { // ?????
				pen2.setLeft(sx2, sy2);
			}
			const poly = pen2.getPolygon(
				(font.kUseCurve)
					? // by curve path
					[
						{ x: 0, y: -kMinWidthT2 },
						{ x: +kMinWidthT2 * 0.9, y: -kMinWidthT2 * 0.9, off: true },
						{ x: +kMinWidthT2, y: 0 },
						{ x: +kMinWidthT2 * 0.9, y: +kMinWidthT2 * 0.9, off: true },
						{ x: 0, y: +kMinWidthT2 },
					]
					: // by polygon
					[
						{ x: 0, y: -kMinWidthT2 },
						{ x: +kMinWidthT2 * 0.7, y: -kMinWidthT2 * 0.7 },
						{ x: +kMinWidthT2, y: 0 },
						{ x: +kMinWidthT2 * 0.7, y: +kMinWidthT2 * 0.7 },
						{ x: 0, y: +kMinWidthT2 },
					]);
			if (sx2 === x2) {
				poly.reverse();
			}
			polygons.push(poly);

			if (a2 === 15) { // jump up ... it can change 15->5
				// anytime same degree
				const pen2_r = new Pen(x2, y2);
				if (y1 >= y2) {
					pen2_r.setMatrix2(-1, 0);
				}
				const poly = pen2_r.getPolygon([
					{ x: 0, y: -kMinWidthT + 1 },
					{ x: +2, y: -kMinWidthT - font.kWidth * 5 },
					{ x: 0, y: -kMinWidthT - font.kWidth * 5 },
					{ x: -kMinWidthT, y: -kMinWidthT + 1 },
				]);
				polygons.push(poly);
			}
			break;
		}
		case 0:
			if (!(a1 === 7 || a1 === 27)) {
				break;
			}
		// fall through
		case 9: { // Math.sinnyu & L2RD Harai ... no need for a2=9
			let type = Math.atan2(Math.abs(y2 - sy2), Math.abs(x2 - sx2)) / Math.PI * 2 - 0.6;
			if (type > 0) {
				type *= 8;
			} else {
				type *= 3;
			}
			const pm = type < 0 ? -1 : 1;
			const pen2 = new Pen(x2, y2);
			if (sy2 === y2) {
				pen2.setMatrix2(1, 0); // ?????
			} else if (sx2 === x2) {
				pen2.setMatrix2(0, y2 > sy2 ? -1 : 1); // for backward compatibility...
			} else {
				pen2.setLeft(sx2, sy2);
			}
			const poly = pen2.getPolygon([
				{ x: 0, y: +kMinWidthT * font.kL2RDfatten },
				{ x: 0, y: -kMinWidthT * font.kL2RDfatten },
				{ x: Math.abs(type) * kMinWidthT * font.kL2RDfatten, y: pm * kMinWidthT * font.kL2RDfatten },
			]);
			polygons.push(poly);
			break;
		}

		case 14: { // jump to left, allways go left
			const jumpFactor = kMinWidthT > 6 ? 6.0 / kMinWidthT : 1.0;
			const haneLength = font.kWidth * 4 * Math.min(1 - haneAdjustment / 10, (kMinWidthT / font.kMinWidthT) ** 3) * jumpFactor;
			const poly = new Pen(x2, y2).getPolygon([
				{ x: 0, y: 0 },
				{ x: 0, y: -kMinWidthT },
				{ x: -haneLength, y: -kMinWidthT },
				{ x: -haneLength, y: -kMinWidthT * 0.5 },
			]);
			// poly.reverse();
			polygons.push(poly);
			break;
		}
	}
}

export function cdDrawBezier(
	font: Mincho, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number,
	x3: number, y3: number, x4: number, y4: number,
	a1: number, a2: number,
	opt1: number, haneAdjustment: number, opt3: number, opt4: number): void {
	cdDrawCurveU(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2, opt1, haneAdjustment, opt3, opt4);
}

export function cdDrawCurve(
	font: Mincho, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
	a1: number, a2: number,
	opt1: number, haneAdjustment: number, opt3: number, opt4: number): void {
	cdDrawCurveU(font, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2, opt1, haneAdjustment, opt3, opt4);
}

export function cdDrawLine(
	font: Mincho, polygons: Polygons,
	tx1: number, ty1: number, tx2: number, ty2: number,
	ta1: number, ta2: number, opt1: number, urokoAdjustment: number, kakatoAdjustment: number): void {

	const x1 = tx1;
	const y1 = ty1;
	const x2 = tx2;
	const y2 = ty2;
	const a1 = ta1;
	const a2 = ta2;

	const kMinWidthT = font.kMinWidthT - opt1 / 2;

	if (x1 === x2 || y1 !== y2 && (x1 > x2 || Math.abs(y2 - y1) >= Math.abs(x2 - x1) || a1 === 6 || a2 === 6)) {
		// if TATE stroke, use y-axis
		// for others, use x-axis
		// KAKUDO GA FUKAI or KAGI NO YOKO BOU
		const [cosrad, sinrad] = (x1 === x2)
			? [0, 1] // ?????
			: normalize([x2 - x1, y2 - y1]);

		const pen1 = new Pen(x1, y1);
		const pen2 = new Pen(x2, y2);
		// if (x1 !== x2) { // ?????
		// 	pen1.setDown(x2, y2);
		// 	pen2.setUp(x1, y1);
		// }
		pen1.setMatrix2(sinrad, -cosrad);
		pen2.setMatrix2(sinrad, -cosrad);

		const poly0 = new Polygon(4);
		switch (a1) {
			case 0:
				poly0.setPoint(0, pen1.getPoint(kMinWidthT, font.kMinWidthY / 2));
				poly0.setPoint(3, pen1.getPoint(-kMinWidthT, -font.kMinWidthY / 2));
				break;
			case 1:
			case 6: // ... no need
				poly0.setPoint(0, pen1.getPoint(kMinWidthT, 0));
				poly0.setPoint(3, pen1.getPoint(-kMinWidthT, 0));
				break;
			case 12:
				poly0.setPoint(0, pen1.getPoint(kMinWidthT, -font.kMinWidthY));
				poly0.setPoint(3, pen1.getPoint(-kMinWidthT, -font.kMinWidthY - kMinWidthT));
				break;
			case 22:
				if (x1 === x2) {
					poly0.set(0, x1 + kMinWidthT, y1);
					poly0.set(3, x1 - kMinWidthT, y1);
				} else {
					const v = x1 > x2 ? -1 : 1;
					// TODO: why " + v", " + 1" ???
					poly0.set(0, x1 + (kMinWidthT + v) / sinrad, y1 + 1);
					poly0.set(3, x1 - kMinWidthT / sinrad, y1);
				}
				break;
			case 32:
				if (x1 === x2) {
					poly0.set(0, x1 + kMinWidthT, y1 - font.kMinWidthY);
					poly0.set(3, x1 - kMinWidthT, y1 - font.kMinWidthY);
				} else {
					poly0.set(0, x1 + kMinWidthT / sinrad, y1);
					poly0.set(3, x1 - kMinWidthT / sinrad, y1);
				}
				break;
		}

		switch (a2) {
			case 0:
				if (a1 === 6) { // KAGI's tail ... no need
					poly0.setPoint(1, pen2.getPoint(kMinWidthT, 0));
					poly0.setPoint(2, pen2.getPoint(-kMinWidthT, 0));
				} else {
					poly0.setPoint(1, pen2.getPoint(kMinWidthT, -kMinWidthT / 2));
					poly0.setPoint(2, pen2.getPoint(-kMinWidthT, kMinWidthT / 2));
				}
				break;
			case 5:
				if (x1 === x2) {
					break;
				}
			// falls through
			case 1: // is needed?
				poly0.setPoint(1, pen2.getPoint(kMinWidthT, 0));
				poly0.setPoint(2, pen2.getPoint(-kMinWidthT, 0));
				break;
			case 13:
				poly0.setPoint(1, pen2.getPoint(kMinWidthT, font.kAdjustKakatoL[kakatoAdjustment]));
				poly0.setPoint(2, pen2.getPoint(-kMinWidthT, font.kAdjustKakatoL[kakatoAdjustment] + kMinWidthT));
				break;
			case 23:
				poly0.setPoint(1, pen2.getPoint(kMinWidthT, font.kAdjustKakatoR[kakatoAdjustment]));
				poly0.setPoint(2, pen2.getPoint(-kMinWidthT, font.kAdjustKakatoR[kakatoAdjustment] + kMinWidthT));
				break;
			case 24: // for T/H design
			case 32:
				if (x1 === x2) {
					poly0.set(1, x2 + kMinWidthT, y2 + font.kMinWidthY);
					poly0.set(2, x2 - kMinWidthT, y2 + font.kMinWidthY);
				} else {
					poly0.set(1, x2 + kMinWidthT / sinrad, y2);
					poly0.set(2, x2 - kMinWidthT / sinrad, y2);
				}
				break;
		}

		polygons.push(poly0);

		switch (a2) {
			case 24: { // for T design
				const poly = new Pen(x2, y2).getPolygon([
					{ x: 0, y: +font.kMinWidthY },
					(x1 === x2) // ?????
						? { x: +kMinWidthT, y: -font.kMinWidthY * 3 }
						: { x: +kMinWidthT * 0.5, y: -font.kMinWidthY * 4 },
					{ x: +kMinWidthT * 2, y: -font.kMinWidthY },
					{ x: +kMinWidthT * 2, y: +font.kMinWidthY },
				]);
				polygons.push(poly);
				break;
			}
			case 13:
				if (kakatoAdjustment === 4) { // for new GTH box's left bottom corner
					if (x1 === x2) {
						const poly = new Pen(x2, y2).getPolygon([
							{ x: -kMinWidthT, y: -font.kMinWidthY * 3 },
							{ x: -kMinWidthT * 2, y: 0 },
							{ x: -font.kMinWidthY, y: +font.kMinWidthY * 5 },
							{ x: +kMinWidthT, y: +font.kMinWidthY },
						]);
						polygons.push(poly);
					} else { // MUKI KANKEINASHI
						const m = (x1 > x2 && y1 !== y2)
							? Math.floor((x1 - x2) / (y2 - y1) * 3)
							: 0;
						const poly = new Pen(x2 + m, y2).getPolygon([
							{ x: 0, y: -font.kMinWidthY * 5 },
							{ x: -kMinWidthT * 2, y: 0 },
							{ x: -font.kMinWidthY, y: +font.kMinWidthY * 5 },
							{ x: +kMinWidthT, y: +font.kMinWidthY },
							{ x: 0, y: 0 },
						]);
						polygons.push(poly);
					}
				}
				break;
		}

		switch (a1) {
			case 22:
			case 27: {
				// box's right top corner
				// SHIKAKU MIGIUE UROKO NANAME DEMO MASSUGU MUKI
				const poly = new Pen(x1, y1).getPolygon([
					{ x: -kMinWidthT, y: -font.kMinWidthY },
					{ x: 0, y: -font.kMinWidthY - font.kWidth },
					{ x: +kMinWidthT + font.kWidth, y: +font.kMinWidthY },
				].concat((x1 === x2)
					? [
						{ x: +kMinWidthT, y: +kMinWidthT },
						{ x: -kMinWidthT, y: 0 },
					]
					: (a1 === 27)
						? [
							{ x: +kMinWidthT, y: +kMinWidthT - 1 },
							{ x: 0, y: +kMinWidthT + 2 },
							{ x: 0, y: 0 },
						]
						: [
							{ x: +kMinWidthT, y: +kMinWidthT - 1 },
							{ x: -kMinWidthT, y: +kMinWidthT + 4 },
						]
				));
				polygons.push(poly);
				break;
			}
			case 0: { // beginning of the stroke
				const poly = pen1.getPolygon([
					{ x: kMinWidthT, y: font.kMinWidthY * 0.5 },
					{ x: kMinWidthT + kMinWidthT * 0.5, y: font.kMinWidthY * 0.5 + font.kMinWidthY },
					{ x: kMinWidthT - 2, y: font.kMinWidthY * 0.5 + font.kMinWidthY * 2 + 1 },
				]);
				if (x1 !== x2) { // ?????
					poly.set(2,
						x1 + (kMinWidthT - 2) * sinrad + (font.kMinWidthY * 0.5 + font.kMinWidthY * 2) * cosrad,
						y1 + (kMinWidthT + 1) * -cosrad + (font.kMinWidthY * 0.5 + font.kMinWidthY * 2) * sinrad); // ?????
				}
				polygons.push(poly);
				break;
			}
		}

		if (x1 === x2 && a2 === 1 || a1 === 6 && (a2 === 0 || x1 !== x2 && a2 === 5)) {
			// KAGI NO YOKO BOU NO SAIGO NO MARU ... no need only used at 1st=yoko
			const poly = new Polygon();
			if (font.kUseCurve) {
				poly.pushPoint(pen2.getPoint(kMinWidthT, 0));
				poly.push(
					x2 - cosrad * kMinWidthT * 0.9 + -sinrad * -kMinWidthT * 0.9, // typo? (- cosrad should be + cosrad)
					y2 + sinrad * kMinWidthT * 0.9 + cosrad * -kMinWidthT * 0.9, true);
				poly.pushPoint(pen2.getPoint(0, kMinWidthT));
				poly.pushPoint(pen2.getPoint(-kMinWidthT * 0.9, kMinWidthT * 0.9, true));
				poly.pushPoint(pen2.getPoint(-kMinWidthT, 0));
			} else {
				const r = (x1 === x2 && (a1 === 6 && a2 === 0 || a2 === 1))
					? 0.6
					: 0.8; // ?????
				poly.pushPoint(pen2.getPoint(kMinWidthT, 0));
				poly.pushPoint(pen2.getPoint(kMinWidthT * 0.6, kMinWidthT * r));
				poly.pushPoint(pen2.getPoint(0, kMinWidthT));
				poly.pushPoint(pen2.getPoint(-kMinWidthT * 0.6, kMinWidthT * r));
				poly.pushPoint(pen2.getPoint(-kMinWidthT, 0));
			}
			if (x1 === x2 && (a1 === 6 && a2 === 0 || a2 === 1)) {
				// for backward compatibility
				poly.reverse();
			}
			// poly.reverse(); // for fill-rule
			polygons.push(poly);
			if (x1 !== x2 && a1 === 6 && a2 === 5) {
				// KAGI NO YOKO BOU NO HANE
				const haneLength = font.kWidth * 5;
				const rv = x1 < x2 ? 1 : -1;
				const poly = pen2.getPolygon([
					{ x: rv * (kMinWidthT - 1), y: 0 },
					{ x: rv * (kMinWidthT + haneLength), y: 2 },
					{ x: rv * (kMinWidthT + haneLength), y: 0 },
					{ x: kMinWidthT - 1, y: -kMinWidthT }, // rv ?????
				]);
				polygons.push(poly);
			}
		}
	} else if (y1 === y2 && a1 === 6) {
		// if it is YOKO stroke, use x-axis
		// if it is KAGI's YOKO stroke, get bold
		// x1 !== x2 && y1 === y2 && a1 === 6
		const pen1_r = new Pen(x1, y1);
		const pen2_r = new Pen(x2, y2);
		const poly0 = new Polygon([
			pen1_r.getPoint(0, -kMinWidthT),
			pen2_r.getPoint(0, -kMinWidthT),
			pen2_r.getPoint(0, +kMinWidthT),
			pen1_r.getPoint(0, +kMinWidthT),
		]);
		polygons.push(poly0);

		switch (a2) {
			case 1:
			case 0:
			case 5: { // no need a2=1
				// KAGI NO YOKO BOU NO SAIGO NO MARU
				const pen2 = new Pen(x2, y2);
				if (x1 > x2) {
					pen2.setMatrix2(-1, 0);
				}
				const r = 0.6;
				const poly = pen2.getPolygon(
					(font.kUseCurve)
						? [
							{ x: 0, y: -kMinWidthT },
							{ x: +kMinWidthT * 0.9, y: -kMinWidthT * 0.9, off: true },
							{ x: +kMinWidthT, y: 0 },
							{ x: +kMinWidthT * 0.9, y: +kMinWidthT * 0.9, off: true },
							{ x: 0, y: +kMinWidthT },
						]
						: [
							{ x: 0, y: -kMinWidthT },
							{ x: +kMinWidthT * r, y: -kMinWidthT * 0.6 },
							{ x: +kMinWidthT, y: 0 },
							{ x: +kMinWidthT * r, y: +kMinWidthT * 0.6 },
							{ x: 0, y: +kMinWidthT },
						]);
				if (x1 >= x2) {
					poly.reverse();
				}
				polygons.push(poly);

				if (a2 === 5) {
					const haneLength = font.kWidth * (4 * (1 - opt1 / font.kAdjustMageStep) + 1);
					// KAGI NO YOKO BOU NO HANE
					const rv = x1 < x2 ? 1 : -1;
					const poly = pen2.getPolygon([
						// { x: 0, y: rv * (-kMinWidthT + 1) },
						{ x: 0, y: rv * -kMinWidthT },
						{ x: 2, y: rv * (-kMinWidthT - haneLength) },
						{ x: 0, y: rv * (-kMinWidthT - haneLength) },
						// { x: -kMinWidthT, y: rv * (-kMinWidthT + 1) },
						{ x: -kMinWidthT, y: rv * -kMinWidthT },
					]);
					// poly2.reverse(); // for fill-rule
					polygons.push(poly);
				}
				break;
			}
		}
	} else {
		// for others, use x-axis
		// ASAI KAUDO
		const [cosrad, sinrad] = (y1 === y2)
			? [1, 0] // ?????
			: normalize([x2 - x1, y2 - y1]);
		// always same
		const pen1 = new Pen(x1, y1);
		const pen2 = new Pen(x2, y2);
		// if (y1 !== y2) { // ?????
		// 	pen1.setRight(x2, y2);
		// 	pen2.setLeft(x1, y1);
		// }
		pen1.setMatrix2(cosrad, sinrad);
		pen2.setMatrix2(cosrad, sinrad);
		const poly = new Polygon([
			pen1.getPoint(0, -font.kMinWidthY),
			pen2.getPoint(0, -font.kMinWidthY),
			pen2.getPoint(0, font.kMinWidthY),
			pen1.getPoint(0, font.kMinWidthY),
		]);
		polygons.push(poly);

		switch (a2) {
			// UROKO
			case 0: {
				const urokoScale = (font.kMinWidthU / font.kMinWidthY - 1.0) / 4.0 + 1.0;
				const poly2 = pen2.getPolygon([
					{ x: 0, y: -font.kMinWidthY },
					{ x: -font.kAdjustUrokoX[urokoAdjustment] * urokoScale, y: 0 },
				]);
				poly2.push(
					x2 - (cosrad - sinrad) * font.kAdjustUrokoX[urokoAdjustment] * urokoScale / 2,
					y2 - (sinrad + cosrad) * font.kAdjustUrokoY[urokoAdjustment] * urokoScale
				);
				polygons.push(poly2);
				break;
			}
		}
	}
}
