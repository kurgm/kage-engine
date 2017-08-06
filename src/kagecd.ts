import { divide_curve, find_offcurve, get_candidate } from "./curve";
import { Kage } from "./kage";
import { Polygon } from "./polygon";
import { Polygons } from "./polygons";

function cdDrawCurveU(
	kage: Kage, polygons: Polygons,
	x1: number, y1: number, sx1: number, sy1: number, sx2: number,
	sy2: number, x2: number, y2: number, ta1: number, ta2: number) {

	if (kage.kShotai === kage.kMincho) { // mincho
		const a1 = ta1 % 1000;
		const a2 = ta2 % 100;
		const opt1 = Math.floor((ta1 % 10000) / 1000);
		const opt2 = Math.floor((ta2 % 1000) / 100);
		const opt3 = Math.floor(ta1 / 10000);
		const opt4 = Math.floor(ta2 / 1000);

		const kMinWidthT = kage.kMinWidthT - opt1 / 2;
		const kMinWidthT2 = kage.kMinWidthT - opt4 / 2;

		let delta;
		switch (a1 % 100) {
			case 0:
			case 7:
				delta = -1 * kage.kMinWidthY * 0.5;
				break;
			case 1:
			case 2: // ... must be 32
			case 6:
			case 22:
			case 32: // changed
				delta = 0;
				break;
			case 12:
				// case 32:
				delta = kage.kMinWidthY;
				break;
			default:
				break;
		}

		if (x1 === sx1) {
			if (y1 < sy1) {
				y1 -= delta;
			} else {
				y1 += delta;
			}
		} else if (y1 === sy1) {
			if (x1 < sx1) {
				x1 -= delta;
			} else {
				x1 += delta;
			}
		} else {
			const rad = Math.atan2(sy1 - y1, sx1 - x1);
			x1 -= delta * Math.cos(rad);
			y1 -= delta * Math.sin(rad);
		}

		switch (a2 % 100) {
			case 0:
			case 1:
			case 7:
			case 9:
			case 15: // it can change to 15->5
			case 14: // it can change to 14->4
			case 17: // no need
			case 5:
				delta = 0;
				break;
			case 8: // get shorten for tail's circle
				delta = -1 * kMinWidthT * 0.5;
				break;
			default:
				break;
		}

		if (sx2 === x2) {
			if (sy2 < y2) {
				y2 += delta;
			} else {
				y2 -= delta;
			}
		} else if (sy2 === y2) {
			if (sx2 < x2) {
				x2 += delta;
			} else {
				x2 -= delta;
			}
		} else {
			const rad = Math.atan2(y2 - sy2, x2 - sx2);
			x2 += delta * Math.cos(rad);
			y2 += delta * Math.sin(rad);
		}

		let hosomi = 0.5;
		if (Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) < 50) {
			hosomi += 0.4 * (1 - Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) / 50);
		}

		// ---------------------------------------------------------------

		if (sx1 === sx2 && sy1 === sy2) { // Spline
			const poly = new Polygon();
			const poly2 = new Polygon();
			if (kage.kUseCurve) {
				// generating fatten curve -- begin
				const kage2 = new Kage();
				kage2.kMinWidthY = kage.kMinWidthY;
				kage2.kMinWidthT = kMinWidthT;
				kage2.kWidth = kage.kWidth;
				kage2.kKakato = kage.kKakato;
				kage2.kRate = 10;

				const curve = get_candidate(kage2, a1, a2, x1, y1, sx1, sy1, x2, y2, opt3, opt4); // L and R

				const { div_curve: dcl12_34, off_curve: dpl12_34 } = divide_curve(kage2, x1, y1, sx1, sy1, x2, y2, curve[0]);
				const { div_curve: dcr12_34, off_curve: dpr12_34 } = divide_curve(kage2, x1, y1, sx1, sy1, x2, y2, curve[1]);

				const ncl1 = find_offcurve(kage2, dcl12_34[0], dpl12_34[0][2], dpl12_34[0][3]);
				const ncl2 = find_offcurve(kage2, dcl12_34[1], dpl12_34[1][2], dpl12_34[1][3]);

				poly.push(ncl1[0], ncl1[1]);
				poly.push(ncl1[2], ncl1[3], 1);
				poly.push(ncl1[4], ncl1[5]);
				poly.push(ncl2[2], ncl2[3], 1);
				poly.push(ncl2[4], ncl2[5]);

				poly2.push(dcr12_34[0][0][0], dcr12_34[0][0][1]);
				poly2.push(dpr12_34[0][2] - (ncl1[2] - dpl12_34[0][2]), dpl12_34[0][3] - (ncl1[3] - dpl12_34[0][3]), 1);
				poly2.push(dcr12_34[0][dcr12_34[0].length - 1][0], dcr12_34[0][dcr12_34[0].length - 1][1]);
				poly2.push(dpr12_34[1][2] - (ncl2[2] - dpl12_34[1][2]), dpl12_34[1][3] - (ncl2[3] - dpl12_34[1][3]), 1);
				poly2.push(dcr12_34[1][dcr12_34[1].length - 1][0], dcr12_34[1][dcr12_34[1].length - 1][1]);

				poly2.reverse();
				poly.concat(poly2);
				polygons.push(poly);
				// generating fatten curve -- end
			} else {
				for (let tt = 0; tt <= 1000; tt += kage.kRate) {
					const t = tt / 1000;

					// calculate a dot
					const x = ((1 - t) ** 2 * x1 + 2 * t * (1 - t) * sx1 + t ** 2 * x2);
					const y = ((1 - t) ** 2 * y1 + 2 * t * (1 - t) * sy1 + t ** 2 * y2);

					// KATAMUKI of vector by BIBUN
					const ix = (x1 - 2 * sx1 + x2) * 2 * t + (-2 * x1 + 2 * sx1);
					const iy = (y1 - 2 * sy1 + y2) * 2 * t + (-2 * y1 + 2 * sy1);

					// line SUICHOKU by vector
					let ia;
					let ib;
					if (ix !== 0 && iy !== 0) {
						const ir = Math.atan(iy / ix * -1);
						ia = Math.sin(ir) * (kMinWidthT);
						ib = Math.cos(ir) * (kMinWidthT);
					} else if (ix === 0) {
						ia = kMinWidthT;
						ib = 0;
					} else {
						ia = 0;
						ib = kMinWidthT;
					}

					let deltad
						= a1 === 7 && a2 === 0 // L2RD: fatten
							? Math.pow(t, hosomi) * kage.kL2RDfatten
							: a1 === 7
								? Math.pow(t, hosomi)
								: a2 === 7
									? Math.pow(1 - t, hosomi)
									: opt3 > 0 || opt4 > 0
										? ((kage.kMinWidthT - opt3 / 2) - (opt4 - opt3) / 2 * t) / kage.kMinWidthT
										: 1;

					if (deltad < 0.15) {
						deltad = 0.15;
					}
					ia *= deltad;
					ib *= deltad;

					// reverse if vector is going 2nd/3rd quadrants
					if (ix <= 0) {
						ia *= -1;
						ib *= -1;
					}

					// copy to polygon structure
					poly.push(x - ia, y - ib);
					poly2.push(x + ia, y + ib);
				}

				// suiheisen ni setsuzoku
				if (a1 === 132) {
					let index = 0;
					while (true) {
						if (poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y) {
							break;
						}
						index++;
					}
					const newx1 = poly2.array[index + 1].x
						+ (poly2.array[index].x - poly2.array[index + 1].x) * (poly2.array[index + 1].y - y1)
						/ (poly2.array[index + 1].y - poly2.array[index].y);
					const newy1 = y1;
					const newx2 = poly.array[0].x
						+ (poly.array[0].x - poly.array[1].x) * (poly.array[0].y - y1)
						/ (poly.array[1].y - poly.array[0].y);
					const newy2 = y1;

					for (let i = 0; i < index; i++) {
						poly2.shift();
					}
					poly2.set(0, newx1, newy1);
					poly.unshift(newx2, newy2);
				}

				// suiheisen ni setsuzoku 2
				if (a1 === 22 && y1 > y2) {
					let index = 0;
					while (true) {
						if (poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y) {
							break;
						}
						index++;
					}
					const newx1 = poly2.array[index + 1].x
						+ (poly2.array[index].x - poly2.array[index + 1].x) * (poly2.array[index + 1].y - y1)
						/ (poly2.array[index + 1].y - poly2.array[index].y);
					const newy1 = y1;
					const newx2 = poly.array[0].x
						+ (poly.array[0].x - poly.array[1].x - 1) * (poly.array[0].y - y1)
						/ (poly.array[1].y - poly.array[0].y);
					const newy2 = y1 + 1;

					for (let i = 0; i < index; i++) {
						poly2.shift();
					}
					poly2.set(0, newx1, newy1);
					poly.unshift(newx2, newy2);
				}

				poly2.reverse();
				poly.concat(poly2);
				polygons.push(poly);
			}
		} else { // Bezier
			const poly = new Polygon();
			const poly2 = new Polygon();
			for (let tt = 0; tt <= 1000; tt += kage.kRate) {
				const t = tt / 1000;

				// calculate a dot
				const x = (1 - t) ** 3 * x1 + 3 * t * (1 - t) ** 2 * sx1 + 3 * t ** 2 * (1 - t) * sx2 + t ** 3 * x2;
				const y = (1 - t) ** 3 * y1 + 3 * t * (1 - t) ** 2 * sy1 + 3 * t ** 2 * (1 - t) * sy2 + t ** 3 * y2;
				// KATAMUKI of vector by BIBUN
				const ix = t ** 2 * (-3 * x1 + 9 * sx1 + -9 * sx2 + 3 * x2) + t * (6 * x1 + -12 * sx1 + 6 * sx2) + -3 * x1 + 3 * sx1;
				const iy = t ** 2 * (-3 * y1 + 9 * sy1 + -9 * sy2 + 3 * y2) + t * (6 * y1 + -12 * sy1 + 6 * sy2) + -3 * y1 + 3 * sy1;

				// line SUICHOKU by vector
				let ia;
				let ib;
				if (ix !== 0 && iy !== 0) {
					const ir = Math.atan(iy / ix * -1);
					ia = Math.sin(ir) * (kMinWidthT);
					ib = Math.cos(ir) * (kMinWidthT);
				} else if (ix === 0) {
					ia = kMinWidthT;
					ib = 0;
				} else {
					ia = 0;
					ib = kMinWidthT;
				}

				let deltad
					= a1 === 7 && a2 === 0 // L2RD: fatten
						? Math.pow(t, hosomi) * kage.kL2RDfatten
						: a1 === 7
							? Math.pow(Math.pow(t, hosomi), 0.7) // make fatten
							: a2 === 7
								? Math.pow(1 - t, hosomi)
								: 1;

				if (deltad < 0.15) {
					deltad = 0.15;
				}
				ia *= deltad;
				ib *= deltad;

				// reverse if vector is going 2nd/3rd quadrants
				if (ix <= 0) {
					ia *= -1;
					ib *= -1;
				}

				// copy to polygon structure
				poly.push(x - ia, y - ib);
				poly2.push(x + ia, y + ib);
			}

			// suiheisen ni setsuzoku
			if (a1 === 132) {
				let index = 0;
				while (true) {
					if (poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y) {
						break;
					}
					index++;
				}
				const newx1 = poly2.array[index + 1].x
					+ (poly2.array[index].x - poly2.array[index + 1].x) * (poly2.array[index + 1].y - y1)
					/ (poly2.array[index + 1].y - poly2.array[index].y);
				const newy1 = y1;
				const newx2 = poly.array[0].x
					+ (poly.array[0].x - poly.array[1].x) * (poly.array[0].y - y1)
					/ (poly.array[1].y - poly.array[0].y);
				const newy2 = y1;

				for (let i = 0; i < index; i++) {
					poly2.shift();
				}
				poly2.set(0, newx1, newy1);
				poly.unshift(newx2, newy2);
			}

			// suiheisen ni setsuzoku 2
			if (a1 === 22) {
				if (x1 > sx1) {
					let index = 0;
					while (true) {
						if (poly2.array[index].y <= y1 && y1 <= poly2.array[index + 1].y) {
							break;
						}
						index++;
					}
					const newx1 = poly2.array[index + 1].x
						+ (poly2.array[index].x - poly2.array[index + 1].x) * (poly2.array[index + 1].y - y1)
						/ (poly2.array[index + 1].y - poly2.array[index].y);
					const newy1 = y1;
					const newx2 = poly.array[0].x
						+ (poly.array[0].x - poly.array[1].x - 1) * (poly.array[0].y - y1)
						/ (poly.array[1].y - poly.array[0].y);
					const newy2 = y1 + 1;

					for (let i = 0; i < index; i++) {
						poly2.shift();
					}
					poly2.set(0, newx1, newy1);
					poly.unshift(newx2, newy2);
				}
			}

			poly2.reverse();
			poly.concat(poly2);
			polygons.push(poly);
		}

		// process for head of stroke
		const rad1 = Math.atan2(sy1 - y1, sx1 - x1);
		const XX = Math.sin(rad1);
		const XY = -Math.cos(rad1);
		const YX = Math.cos(rad1);
		const YY = Math.sin(rad1);

		if (a1 === 12) {
			if (x1 === x2) {
				const poly = new Polygon();
				poly.push(x1 - kMinWidthT, y1);
				poly.push(x1 + kMinWidthT, y1);
				poly.push(x1 - kMinWidthT, y1 - kMinWidthT);
				polygons.push(poly);
			} else {
				const poly = new Polygon();
				poly.push(x1 - kMinWidthT * XX, y1 - kMinWidthT * XY);
				poly.push(x1 + kMinWidthT * XX, y1 + kMinWidthT * XY);
				poly.push(x1 - kMinWidthT * XX - kMinWidthT * YX, y1 - kMinWidthT * XY - kMinWidthT * YY);
				polygons.push(poly);
			}
		}

		let type;
		let pm = 0;
		if (a1 === 0) {
			if (y1 <= y2) { // from up to bottom
				type = (Math.atan2(Math.abs(y1 - sy1), Math.abs(x1 - sx1)) / Math.PI * 2 - 0.4);
				if (type > 0) {
					type *= 2;
				} else {
					type *= 16;
				}
				pm = type < 0 ? -1 : 1;
				if (x1 === sx1) {
					const poly = new Polygon();
					poly.push(x1 - kMinWidthT, y1 + 1);
					poly.push(x1 + kMinWidthT, y1);
					poly.push(x1 - kMinWidthT * pm, y1 - kage.kMinWidthY * type * pm);
					// if(x1 > x2){
					//  poly.reverse();
					// }
					polygons.push(poly);
				} else {
					const poly = new Polygon();
					poly.push(x1 - kMinWidthT * XX + 1 * YX, y1 - kMinWidthT * XY + 1 * YY);
					poly.push(x1 + kMinWidthT * XX, y1 + kMinWidthT * XY);
					poly.push(
						x1 - kMinWidthT * pm * XX - kage.kMinWidthY * type * pm * YX,
						y1 - kMinWidthT * pm * XY - kage.kMinWidthY * type * pm * YY);
					// if(x1 > x2){
					//  poly.reverse();
					// }
					polygons.push(poly);
				}
			} else { // bottom to up
				if (x1 === sx1) {
					const poly = new Polygon();
					poly.push(x1 - kMinWidthT, y1);
					poly.push(x1 + kMinWidthT, y1);
					poly.push(x1 + kMinWidthT, y1 - kage.kMinWidthY);
					polygons.push(poly);
				} else {
					const poly = new Polygon();
					poly.push(x1 - kMinWidthT * XX, y1 - kMinWidthT * XY);
					poly.push(x1 + kMinWidthT * XX, y1 + kMinWidthT * XY);
					poly.push(x1 + kMinWidthT * XX - kage.kMinWidthY * YX, y1 + kMinWidthT * XY - kage.kMinWidthY * YY);
					// if(x1 < x2){
					//  poly.reverse();
					// }
					polygons.push(poly);
				}
			}
		}

		if (a1 === 22) { // box's up-right corner, any time same degree
			const poly = new Polygon();
			poly.push(x1 - kMinWidthT, y1 - kage.kMinWidthY);
			poly.push(x1, y1 - kage.kMinWidthY - kage.kWidth);
			poly.push(x1 + kMinWidthT + kage.kWidth, y1 + kage.kMinWidthY);
			poly.push(x1 + kMinWidthT, y1 + kMinWidthT - 1);
			poly.push(x1 - kMinWidthT, y1 + kMinWidthT + 4);
			polygons.push(poly);
		}

		if (a1 === 0) { // beginning of the stroke
			if (y1 <= y2) { // from up to bottom
				if (pm > 0) {
					type = 0;
				}
				const move = kage.kMinWidthY * type * pm;
				if (x1 === sx1) {
					const poly = new Polygon();
					poly.push(x1 + kMinWidthT, y1 - move);
					poly.push(x1 + kMinWidthT * 1.5, y1 + kage.kMinWidthY - move);
					poly.push(x1 + kMinWidthT - 2, y1 + kage.kMinWidthY * 2 + 1);
					polygons.push(poly);
				} else {
					const poly = new Polygon();
					poly.push(x1 + kMinWidthT * XX - move * YX, y1 + kMinWidthT * XY - move * YY);
					poly.push(
						x1 + kMinWidthT * 1.5 * XX + (kage.kMinWidthY - move * 1.2) * YX,
						y1 + kMinWidthT * 1.5 * XY + (kage.kMinWidthY - move * 1.2) * YY);
					poly.push(
						x1 + (kMinWidthT - 2) * XX + (kage.kMinWidthY * 2 - move * 0.8 + 1) * YX,
						y1 + (kMinWidthT - 2) * XY + (kage.kMinWidthY * 2 - move * 0.8 + 1) * YY);
					// if(x1 < x2){
					//  poly.reverse();
					// }
					polygons.push(poly);
				}
			} else { // from bottom to up
				if (x1 === sx1) {
					const poly = new Polygon();
					poly.push(x1 - kMinWidthT, y1);
					poly.push(x1 - kMinWidthT * 1.5, y1 + kage.kMinWidthY);
					poly.push(x1 - kMinWidthT * 0.5, y1 + kage.kMinWidthY * 3);
					polygons.push(poly);
				} else {
					const poly = new Polygon();
					poly.push(x1 - kMinWidthT * XX, y1 - kMinWidthT * XY);
					poly.push(
						x1 - kMinWidthT * 1.5 * XX + kage.kMinWidthY * YX,
						y1 + kage.kMinWidthY * YY - kMinWidthT * 1.5 * XY);
					poly.push(
						x1 - kMinWidthT * 0.5 * XX + kage.kMinWidthY * 3 * YX,
						y1 + kage.kMinWidthY * 3 * YY - kMinWidthT * 0.5 * XY);
					// if(x1 < x2){
					//  poly.reverse();
					// }
					polygons.push(poly);
				}
			}
		}

		// process for tail
		const rad2 = Math.atan2(y2 - sy2, x2 - sx2);

		if (a2 === 1 || a2 === 8 || a2 === 15) { // the last filled circle ... it can change 15->5
			if (sx2 === x2) {
				const poly = new Polygon();
				if (kage.kUseCurve) {
					// by curve path
					poly.push(x2 - kMinWidthT2, y2);
					poly.push(x2 - kMinWidthT2 * 0.9, y2 + kMinWidthT2 * 0.9, 1);
					poly.push(x2, y2 + kMinWidthT2);
					poly.push(x2 + kMinWidthT2 * 0.9, y2 + kMinWidthT2 * 0.9, 1);
					poly.push(x2 + kMinWidthT2, y2);
				} else {
					// by polygon
					poly.push(x2 - kMinWidthT2, y2);
					poly.push(x2 - kMinWidthT2 * 0.7, y2 + kMinWidthT2 * 0.7);
					poly.push(x2, y2 + kMinWidthT2);
					poly.push(x2 + kMinWidthT2 * 0.7, y2 + kMinWidthT2 * 0.7);
					poly.push(x2 + kMinWidthT2, y2);
				}
				polygons.push(poly);
			} else if (sy2 === y2) {
				const poly = new Polygon();
				if (kage.kUseCurve) {
					// by curve path
					poly.push(x2, y2 - kMinWidthT2);
					poly.push(x2 + kMinWidthT2 * 0.9, y2 - kMinWidthT2 * 0.9, 1);
					poly.push(x2 + kMinWidthT2, y2);
					poly.push(x2 + kMinWidthT2 * 0.9, y2 + kMinWidthT2 * 0.9, 1);
					poly.push(x2, y2 + kMinWidthT2);
				} else {
					// by polygon
					poly.push(x2, y2 - kMinWidthT2);
					poly.push(x2 + kMinWidthT2 * 0.7, y2 - kMinWidthT2 * 0.7);
					poly.push(x2 + kMinWidthT2, y2);
					poly.push(x2 + kMinWidthT2 * 0.7, y2 + kMinWidthT2 * 0.7);
					poly.push(x2, y2 + kMinWidthT2);
				}
				polygons.push(poly);
			} else {
				const poly = new Polygon();
				if (kage.kUseCurve) {
					poly.push(x2 + Math.sin(rad2) * kMinWidthT2, y2 - Math.cos(rad2) * kMinWidthT2);
					poly.push(
						x2 + Math.cos(rad2) * kMinWidthT2 * 0.9 + Math.sin(rad2) * kMinWidthT2 * 0.9,
						y2 + Math.sin(rad2) * kMinWidthT2 * 0.9 - Math.cos(rad2) * kMinWidthT2 * 0.9, 1);
					poly.push(x2 + Math.cos(rad2) * kMinWidthT2, y2 + Math.sin(rad2) * kMinWidthT2);
					poly.push(
						x2 + Math.cos(rad2) * kMinWidthT2 * 0.9 - Math.sin(rad2) * kMinWidthT2 * 0.9,
						y2 + Math.sin(rad2) * kMinWidthT2 * 0.9 + Math.cos(rad2) * kMinWidthT2 * 0.9, 1);
					poly.push(x2 - Math.sin(rad2) * kMinWidthT2, y2 + Math.cos(rad2) * kMinWidthT2);
				} else {
					poly.push(x2 + Math.sin(rad2) * kMinWidthT2, y2 - Math.cos(rad2) * kMinWidthT2);
					poly.push(
						x2 + Math.cos(rad2) * kMinWidthT2 * 0.7 + Math.sin(rad2) * kMinWidthT2 * 0.7,
						y2 + Math.sin(rad2) * kMinWidthT2 * 0.7 - Math.cos(rad2) * kMinWidthT2 * 0.7);
					poly.push(x2 + Math.cos(rad2) * kMinWidthT2, y2 + Math.sin(rad2) * kMinWidthT2);
					poly.push(
						x2 + Math.cos(rad2) * kMinWidthT2 * 0.7 - Math.sin(rad2) * kMinWidthT2 * 0.7,
						y2 + Math.sin(rad2) * kMinWidthT2 * 0.7 + Math.cos(rad2) * kMinWidthT2 * 0.7);
					poly.push(x2 - Math.sin(rad2) * kMinWidthT2, y2 + Math.cos(rad2) * kMinWidthT2);
				}
				polygons.push(poly);
			}
		}

		if (a2 === 9 || (a1 === 7 && a2 === 0)) { // Math.sinnyu & L2RD Harai ... no need for a2=9
			let type2 = (Math.atan2(Math.abs(y2 - sy2), Math.abs(x2 - sx2)) / Math.PI * 2 - 0.6);
			if (type2 > 0) {
				type2 *= 8;
			} else {
				type2 *= 3;
			}
			const pm2 = type2 < 0 ? -1 : 1;
			if (sy2 === y2) {
				const poly = new Polygon();
				poly.push(x2, y2 + kMinWidthT * kage.kL2RDfatten);
				poly.push(x2, y2 - kMinWidthT * kage.kL2RDfatten);
				poly.push(x2 + kMinWidthT * kage.kL2RDfatten * Math.abs(type2), y2 + kMinWidthT * kage.kL2RDfatten * pm2);
				polygons.push(poly);
			} else {
				const poly = new Polygon();
				const YX2 = -Math.sin(rad2);
				const YY2 = Math.cos(rad2);
				const XX2 = Math.cos(rad2);
				const XY2 = Math.sin(rad2);
				poly.push(x2 + kMinWidthT * kage.kL2RDfatten * YX2, y2 + kMinWidthT * kage.kL2RDfatten * YY2);
				poly.push(x2 - kMinWidthT * kage.kL2RDfatten * YX2, y2 - kMinWidthT * kage.kL2RDfatten * YY2);
				poly.push(
					x2 + kMinWidthT * kage.kL2RDfatten * Math.abs(type2) * XX2 + kMinWidthT * kage.kL2RDfatten * pm2 * YX2,
					y2 + kMinWidthT * kage.kL2RDfatten * Math.abs(type2) * XY2 + kMinWidthT * kage.kL2RDfatten * pm2 * YY2);
				polygons.push(poly);
			}
		}

		if (a2 === 15) { // jump up ... it can change 15->5
			// anytime same degree
			const poly = new Polygon();
			if (y1 < y2) {
				poly.push(x2, y2 - kMinWidthT + 1);
				poly.push(x2 + 2, y2 - kMinWidthT - kage.kWidth * 5);
				poly.push(x2, y2 - kMinWidthT - kage.kWidth * 5);
				poly.push(x2 - kMinWidthT, y2 - kMinWidthT + 1);
			} else {
				poly.push(x2, y2 + kMinWidthT - 1);
				poly.push(x2 - 2, y2 + kMinWidthT + kage.kWidth * 5);
				poly.push(x2, y2 + kMinWidthT + kage.kWidth * 5);
				poly.push(x2 + kMinWidthT, y2 + kMinWidthT - 1);
			}
			polygons.push(poly);
		}

		if (a2 === 14) { // jump to left, allways go left
			const poly = new Polygon();
			poly.push(x2, y2);
			poly.push(x2, y2 - kMinWidthT);
			poly.push(
				x2 - kage.kWidth * 4 * Math.min(1 - opt2 / 10, Math.pow(kMinWidthT / kage.kMinWidthT, 3)),
				y2 - kMinWidthT);
			poly.push(
				x2 - kage.kWidth * 4 * Math.min(1 - opt2 / 10, Math.pow(kMinWidthT / kage.kMinWidthT, 3)),
				y2 - kMinWidthT * 0.5);
			// poly.reverse();
			polygons.push(poly);
		}
	} else { // gothic
		const a1 = undefined;
		const a2 = undefined;
		if (a1 % 10 === 2) {
			if (x1 === sx1) {
				if (y1 < sy1) {
					y1 -= kage.kWidth;
				} else {
					y1 += kage.kWidth;
				}
			} else if (y1 === sy1) {
				if (x1 < sx1) {
					x1 -= kage.kWidth;
				} else {
					x1 += kage.kWidth;
				}
			} else {
				const rad = Math.atan2(sy1 - y1, sx1 - x1);
				x1 -= kage.kWidth * Math.cos(rad);
				y1 -= kage.kWidth * Math.sin(rad);
			}
		}

		if (a1 % 10 === 3) {
			if (x1 === sx1) {
				if (y1 < sy1) {
					y1 -= kage.kWidth * kage.kKakato;
				} else {
					y1 += kage.kWidth * kage.kKakato;
				}
			} else if (y1 === sy1) {
				if (x1 < sx1) {
					x1 -= kage.kWidth * kage.kKakato;
				} else {
					x1 += kage.kWidth * kage.kKakato;
				}
			} else {
				const rad = Math.atan2(sy1 - y1, sx1 - x1);
				x1 -= kage.kWidth * Math.cos(rad) * kage.kKakato;
				y1 -= kage.kWidth * Math.sin(rad) * kage.kKakato;
			}
		}
		if (a2 % 10 === 2) {
			if (sx2 === x2) {
				if (sy2 < y2) {
					y2 += kage.kWidth;
				} else {
					y2 -= kage.kWidth;
				}
			} else if (sy2 === y2) {
				if (sx2 < x2) {
					x2 += kage.kWidth;
				} else {
					x2 -= kage.kWidth;
				}
			} else {
				const rad = Math.atan2(y2 - sy2, x2 - sx2);
				x2 += kage.kWidth * Math.cos(rad);
				y2 += kage.kWidth * Math.sin(rad);
			}
		}

		if (a2 % 10 === 3) {
			if (sx2 === x2) {
				if (sy2 < y2) {
					y2 += kage.kWidth * kage.kKakato;
				} else {
					y2 -= kage.kWidth * kage.kKakato;
				}
			} else if (sy2 === y2) {
				if (sx2 < x2) {
					x2 += kage.kWidth * kage.kKakato;
				} else {
					x2 -= kage.kWidth * kage.kKakato;
				}
			} else {
				const rad = Math.atan2(y2 - sy2, x2 - sx2);
				x2 += kage.kWidth * Math.cos(rad) * kage.kKakato;
				y2 += kage.kWidth * Math.sin(rad) * kage.kKakato;
			}
		}

		const poly = new Polygon();
		const poly2 = new Polygon();

		let x;
		let y;
		let ix;
		let iy;
		for (let tt = 0; tt <= 1000; tt += kage.kRate) {
			const t = tt / 1000;

			if (sx1 === sx2 && sy1 === sy2) {
				// calculating each point
				x = ((1 - t) ** 2 * x1 + 2 * t * (1 - t) * sx1 + t ** 2 * x2);
				y = ((1 - t) ** 2 * y1 + 2 * t * (1 - t) * sy1 + t ** 2 * y2);

				// SESSEN NO KATAMUKI NO KEISAN(BIBUN)
				ix = (x1 - 2 * sx1 + x2) * 2 * t + (-2 * x1 + 2 * sx1);
				iy = (y1 - 2 * sy1 + y2) * 2 * t + (-2 * y1 + 2 * sy1);
			}// else {}
			// SESSEN NI SUICHOKU NA CHOKUSEN NO KEISAN
			let ia;
			let ib;
			if (kage.kShotai === kage.kMincho) { // always false ?
				if (ix !== 0 && iy !== 0) {
					const ir = Math.atan(iy / ix * -1.0);
					ia = Math.sin(ir) * kage.kMinWidthT;
					ib = Math.cos(ir) * kage.kMinWidthT;
				} else if (ix === 0) {
					ia = kage.kMinWidthT;
					ib = 0;
				} else {
					ia = 0;
					ib = kage.kMinWidthT;
				}
				ia *= Math.sqrt(1 - t);
				ib *= Math.sqrt(1 - t);
			} else {
				if (ix !== 0 && iy !== 0) {
					const ir = Math.atan(iy / ix * -1.0);
					ia = Math.sin(ir) * kage.kWidth;
					ib = Math.cos(ir) * kage.kWidth;
				} else if (ix === 0) {
					ia = kage.kWidth;
					ib = 0;
				} else {
					ia = 0;
					ib = kage.kWidth;
				}
			}

			// reverse if vector is going 2nd/3rd quadrants
			if (ix <= 0) {
				ia *= -1;
				ib *= -1;
			}

			// save to polygon
			poly.push(x - ia, y - ib);
			poly2.push(x + ia, y + ib);
		}

		poly2.reverse();
		poly.concat(poly2);
		polygons.push(poly);
	}
}

export function cdDrawBezier(
	kage: Kage, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number,
	x3: number, y3: number, x4: number, y4: number,
	a1: number, a2: number) {
	cdDrawCurveU(kage, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2);
}

export function cdDrawCurve(
	kage: Kage, polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
	a1: number, a2: number) {
	cdDrawCurveU(kage, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2);
}

export function cdDrawLine(
	kage: Kage, polygons: Polygons,
	tx1: number, ty1: number, tx2: number, ty2: number,
	ta1: number, ta2: number) {

	if (kage.kShotai === kage.kMincho) { // mincho
		const x1 = tx1;
		const y1 = ty1;
		const x2 = tx2;
		const y2 = ty2;
		const a1 = ta1 % 1000;
		const a2 = ta2 % 100;
		const opt1 = Math.floor(ta1 / 1000);
		const opt2 = Math.floor(ta2 / 100);

		const kMinWidthT = kage.kMinWidthT - opt1 / 2;

		if (x1 === x2) { // if TATE stroke, use y-axis
			const poly0 = new Polygon(4);
			switch (a1) {
				case 0:
					poly0.set(3, x1 - kMinWidthT, y1 - kage.kMinWidthY / 2);
					poly0.set(0, x1 + kMinWidthT, y1 + kage.kMinWidthY / 2);
					break;
				case 1:
				case 6: // ... no need
				case 22:
					poly0.set(3, x1 - kMinWidthT, y1);
					poly0.set(0, x1 + kMinWidthT, y1);
					break;
				case 12:
					poly0.set(3, x1 - kMinWidthT, y1 - kage.kMinWidthY - kMinWidthT);
					poly0.set(0, x1 + kMinWidthT, y1 - kage.kMinWidthY);
					break;
				case 32:
					poly0.set(3, x1 - kMinWidthT, y1 - kage.kMinWidthY);
					poly0.set(0, x1 + kMinWidthT, y1 - kage.kMinWidthY);
					break;
			}

			switch (a2) {
				case 0:
					if (a1 === 6) { // KAGI's tail ... no need
						poly0.set(2, x2 - kMinWidthT, y2);
						poly0.set(1, x2 + kMinWidthT, y2);
					} else {
						poly0.set(2, x2 - kMinWidthT, y2 + kMinWidthT / 2);
						poly0.set(1, x2 + kMinWidthT, y2 - kMinWidthT / 2);
					}
					break;
				case 1:
					poly0.set(2, x2 - kMinWidthT, y2);
					poly0.set(1, x2 + kMinWidthT, y2);
					break;
				case 13:
					poly0.set(2, x2 - kMinWidthT, y2 + kage.kAdjustKakatoL[opt2] + kMinWidthT);
					poly0.set(1, x2 + kMinWidthT, y2 + kage.kAdjustKakatoL[opt2]);
					break;
				case 23:
					poly0.set(2, x2 - kMinWidthT, y2 + kage.kAdjustKakatoR[opt2] + kMinWidthT);
					poly0.set(1, x2 + kMinWidthT, y2 + kage.kAdjustKakatoR[opt2]);
					break;
				case 24: // for T/H design
					poly0.set(2, x2 - kMinWidthT, y2 + kage.kMinWidthY);
					poly0.set(1, x2 + kMinWidthT, y2 + kage.kMinWidthY);
					break;
				case 32:
					poly0.set(2, x2 - kMinWidthT, y2 + kage.kMinWidthY);
					poly0.set(1, x2 + kMinWidthT, y2 + kage.kMinWidthY);
					break;
			}

			polygons.push(poly0);

			if (a2 === 24) { // for T design
				const poly = new Polygon();
				poly.push(x2, y2 + kage.kMinWidthY);
				poly.push(x2 + kMinWidthT, y2 - kage.kMinWidthY * 3);
				poly.push(x2 + kMinWidthT * 2, y2 - kage.kMinWidthY);
				poly.push(x2 + kMinWidthT * 2, y2 + kage.kMinWidthY);
				polygons.push(poly);
			}

			if (a2 === 13 && opt2 === 4) { // for new GTH box's left bottom corner
				const poly = new Polygon();
				poly.push(x2 - kMinWidthT, y2 - kage.kMinWidthY * 3);
				poly.push(x2 - kMinWidthT * 2, y2);
				poly.push(x2 - kage.kMinWidthY, y2 + kage.kMinWidthY * 5);
				poly.push(x2 + kMinWidthT, y2 + kage.kMinWidthY);
				polygons.push(poly);
			}

			if (a1 === 22) { // box's right top corner
				const poly = new Polygon();
				poly.push(x1 - kMinWidthT, y1 - kage.kMinWidthY);
				poly.push(x1, y1 - kage.kMinWidthY - kage.kWidth);
				poly.push(x1 + kMinWidthT + kage.kWidth, y1 + kage.kMinWidthY);
				poly.push(x1 + kMinWidthT, y1 + kMinWidthT);
				poly.push(x1 - kMinWidthT, y1);
				polygons.push(poly);
			}

			if (a1 === 0) { // beginning of the stroke
				const poly = new Polygon();
				poly.push(x1 + kMinWidthT, y1 + kage.kMinWidthY * 0.5);
				poly.push(x1 + kMinWidthT + kMinWidthT * 0.5, y1 + kage.kMinWidthY * 0.5 + kage.kMinWidthY);
				poly.push(x1 + kMinWidthT - 2, y1 + kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2 + 1);
				polygons.push(poly);
			}

			if ((a1 === 6 && a2 === 0) || a2 === 1) { // KAGI NO YOKO BOU NO SAIGO NO MARU ... no need only used at 1st=yoko
				const poly = new Polygon();
				if (kage.kUseCurve) {
					poly.push(x2 - kMinWidthT, y2);
					poly.push(x2 - kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, 1);
					poly.push(x2, y2 + kMinWidthT);
					poly.push(x2 + kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, 1);
					poly.push(x2 + kMinWidthT, y2);
				} else {
					poly.push(x2 - kMinWidthT, y2);
					poly.push(x2 - kMinWidthT * 0.6, y2 + kMinWidthT * 0.6);
					poly.push(x2, y2 + kMinWidthT);
					poly.push(x2 + kMinWidthT * 0.6, y2 + kMinWidthT * 0.6);
					poly.push(x2 + kMinWidthT, y2);
				}
				// poly.reverse(); // for fill-rule
				polygons.push(poly);
			}
		} else if (y1 === y2) { // if it is YOKO stroke, use x-axis
			if (a1 === 6) { // if it is KAGI's YOKO stroke, get bold
				const poly = new Polygon();
				poly.push(x1, y1 - kMinWidthT);
				poly.push(x2, y2 - kMinWidthT);
				poly.push(x2, y2 + kMinWidthT);
				poly.push(x1, y1 + kMinWidthT);
				polygons.push(poly);

				if (a2 === 1 || a2 === 0 || a2 === 5) { // no need a2=1
					// KAGI NO YOKO BOU NO SAIGO NO MARU
					const poly2 = new Polygon();
					if (kage.kUseCurve) {
						if (x1 < x2) {
							poly2.push(x2, y2 - kMinWidthT);
							poly2.push(x2 + kMinWidthT * 0.9, y2 - kMinWidthT * 0.9, 1);
							poly2.push(x2 + kMinWidthT, y2);
							poly2.push(x2 + kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, 1);
							poly2.push(x2, y2 + kMinWidthT);
						} else {
							poly2.push(x2, y2 - kMinWidthT);
							poly2.push(x2 - kMinWidthT * 0.9, y2 - kMinWidthT * 0.9, 1);
							poly2.push(x2 - kMinWidthT, y2);
							poly2.push(x2 - kMinWidthT * 0.9, y2 + kMinWidthT * 0.9, 1);
							poly2.push(x2, y2 + kMinWidthT);
						}
					} else {
						if (x1 < x2) {
							poly2.push(x2, y2 - kMinWidthT);
							poly2.push(x2 + kMinWidthT * 0.6, y2 - kMinWidthT * 0.6);
							poly2.push(x2 + kMinWidthT, y2);
							poly2.push(x2 + kMinWidthT * 0.6, y2 + kMinWidthT * 0.6);
							poly2.push(x2, y2 + kMinWidthT);
						} else {
							poly2.push(x2, y2 - kMinWidthT);
							poly2.push(x2 - kMinWidthT * 0.6, y2 - kMinWidthT * 0.6);
							poly2.push(x2 - kMinWidthT, y2);
							poly2.push(x2 - kMinWidthT * 0.6, y2 + kMinWidthT * 0.6);
							poly2.push(x2, y2 + kMinWidthT);
						}
					}
					polygons.push(poly2);
				}

				if (a2 === 5) {
					// KAGI NO YOKO BOU NO HANE
					const poly2 = new Polygon();
					if (x1 < x2) {
						poly2.push(x2, y2 - kMinWidthT + 1);
						poly2.push(x2 + 2, y2 - kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1));
						poly2.push(x2, y2 - kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1));
						poly2.push(x2 - kMinWidthT, y2 - kMinWidthT + 1);
					} else {
						poly2.push(x2, y2 - kMinWidthT + 1);
						poly2.push(x2 - 2, y2 - kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1));
						poly2.push(x2, y2 - kMinWidthT - kage.kWidth * (4 * (1 - opt1 / kage.kAdjustMageStep) + 1));
						poly2.push(x2 + kMinWidthT, y2 - kMinWidthT + 1);
					}
					// poly2.reverse(); // for fill-rule
					polygons.push(poly2);
				}
			} else {
				// always same
				const poly = new Polygon(4);
				poly.set(0, x1, y1 - kage.kMinWidthY);
				poly.set(1, x2, y2 - kage.kMinWidthY);
				poly.set(2, x2, y2 + kage.kMinWidthY);
				poly.set(3, x1, y1 + kage.kMinWidthY);
				polygons.push(poly);

				// UROKO
				if (a2 === 0) {
					const poly2 = new Polygon();
					poly2.push(x2, y2 - kage.kMinWidthY);
					poly2.push(x2 - kage.kAdjustUrokoX[opt2], y2);
					poly2.push(x2 - kage.kAdjustUrokoX[opt2] / 2, y2 - kage.kAdjustUrokoY[opt2]);
					polygons.push(poly2);
				}
			}
		} else { // for others, use x-axis
			const rad = Math.atan((y2 - y1) / (x2 - x1));
			if ((Math.abs(y2 - y1) < Math.abs(x2 - x1)) && (a1 !== 6) && (a2 !== 6) && !(x1 > x2)) { // ASAI KAUDO
				// always same
				const poly = new Polygon(4);
				poly.set(0, x1 + Math.sin(rad) * kage.kMinWidthY, y1 - Math.cos(rad) * kage.kMinWidthY);
				poly.set(1, x2 + Math.sin(rad) * kage.kMinWidthY, y2 - Math.cos(rad) * kage.kMinWidthY);
				poly.set(2, x2 - Math.sin(rad) * kage.kMinWidthY, y2 + Math.cos(rad) * kage.kMinWidthY);
				poly.set(3, x1 - Math.sin(rad) * kage.kMinWidthY, y1 + Math.cos(rad) * kage.kMinWidthY);
				polygons.push(poly);

				// UROKO
				if (a2 === 0) {
					const poly2 = new Polygon();
					poly2.push(x2 + Math.sin(rad) * kage.kMinWidthY, y2 - Math.cos(rad) * kage.kMinWidthY);
					poly2.push(x2 - Math.cos(rad) * kage.kAdjustUrokoX[opt2], y2 - Math.sin(rad) * kage.kAdjustUrokoX[opt2]);
					poly2.push(
						x2 - Math.cos(rad) * kage.kAdjustUrokoX[opt2] / 2 + Math.sin(rad) * kage.kAdjustUrokoX[opt2] / 2,
						y2 - Math.sin(rad) * kage.kAdjustUrokoY[opt2] - Math.cos(rad) * kage.kAdjustUrokoY[opt2]);
					polygons.push(poly2);
				}
			} else { // KAKUDO GA FUKAI or KAGI NO YOKO BOU
				const v = x1 > x2 ? -1 : 1;
				const poly0 = new Polygon(4);
				switch (a1) {
					case 0:
						poly0.set(0,
							x1 + Math.sin(rad) * kMinWidthT * v + kage.kMinWidthY * Math.cos(rad) * 0.5 * v,
							y1 - Math.cos(rad) * kMinWidthT * v + kage.kMinWidthY * Math.sin(rad) * 0.5 * v);
						poly0.set(3,
							x1 - Math.sin(rad) * kMinWidthT * v - kage.kMinWidthY * Math.cos(rad) * 0.5 * v,
							y1 + Math.cos(rad) * kMinWidthT * v - kage.kMinWidthY * Math.sin(rad) * 0.5 * v);
						break;
					case 1:
					case 6:
						poly0.set(0, x1 + Math.sin(rad) * kMinWidthT * v, y1 - Math.cos(rad) * kMinWidthT * v);
						poly0.set(3, x1 - Math.sin(rad) * kMinWidthT * v, y1 + Math.cos(rad) * kMinWidthT * v);
						break;
					case 12:
						poly0.set(0,
							x1 + Math.sin(rad) * kMinWidthT * v - kage.kMinWidthY * Math.cos(rad) * v,
							y1 - Math.cos(rad) * kMinWidthT * v - kage.kMinWidthY * Math.sin(rad) * v);
						poly0.set(3,
							x1 - Math.sin(rad) * kMinWidthT * v - (kMinWidthT + kage.kMinWidthY) * Math.cos(rad) * v,
							y1 + Math.cos(rad) * kMinWidthT * v - (kMinWidthT + kage.kMinWidthY) * Math.sin(rad) * v);
						break;
					case 22:
						poly0.set(0, x1 + (kMinWidthT * v + 1) / Math.sin(rad), y1 + 1);
						poly0.set(3, x1 - (kMinWidthT * v) / Math.sin(rad), y1);
						break;
					case 32:
						poly0.set(0, x1 + (kMinWidthT * v) / Math.sin(rad), y1);
						poly0.set(3, x1 - (kMinWidthT * v) / Math.sin(rad), y1);
						break;
				}

				switch (a2) {
					case 0:
						if (a1 === 6) {
							poly0.set(1, x2 + Math.sin(rad) * kMinWidthT * v, y2 - Math.cos(rad) * kMinWidthT * v);
							poly0.set(2, x2 - Math.sin(rad) * kMinWidthT * v, y2 + Math.cos(rad) * kMinWidthT * v);
						} else {
							poly0.set(1,
								x2 + Math.sin(rad) * kMinWidthT * v - kMinWidthT * 0.5 * Math.cos(rad) * v,
								y2 - Math.cos(rad) * kMinWidthT * v - kMinWidthT * 0.5 * Math.sin(rad) * v);
							poly0.set(2,
								x2 - Math.sin(rad) * kMinWidthT * v + kMinWidthT * 0.5 * Math.cos(rad) * v,
								y2 + Math.cos(rad) * kMinWidthT * v + kMinWidthT * 0.5 * Math.sin(rad) * v);
						}
						break;
					case 1: // is needed?
					case 5:
						poly0.set(1, x2 + Math.sin(rad) * kMinWidthT * v, y2 - Math.cos(rad) * kMinWidthT * v);
						poly0.set(2, x2 - Math.sin(rad) * kMinWidthT * v, y2 + Math.cos(rad) * kMinWidthT * v);
						break;
					case 13:
						poly0.set(1,
							x2 + Math.sin(rad) * kMinWidthT * v + kage.kAdjustKakatoL[opt2] * Math.cos(rad) * v,
							y2 - Math.cos(rad) * kMinWidthT * v + kage.kAdjustKakatoL[opt2] * Math.sin(rad) * v);
						poly0.set(2,
							x2 - Math.sin(rad) * kMinWidthT * v + (kage.kAdjustKakatoL[opt2] + kMinWidthT) * Math.cos(rad) * v,
							y2 + Math.cos(rad) * kMinWidthT * v + (kage.kAdjustKakatoL[opt2] + kMinWidthT) * Math.sin(rad) * v);
						break;
					case 23:
						poly0.set(1,
							x2 + Math.sin(rad) * kMinWidthT * v + kage.kAdjustKakatoR[opt2] * Math.cos(rad) * v,
							y2 - Math.cos(rad) * kMinWidthT * v + kage.kAdjustKakatoR[opt2] * Math.sin(rad) * v);
						poly0.set(2,
							x2 - Math.sin(rad) * kMinWidthT * v + (kage.kAdjustKakatoR[opt2] + kMinWidthT) * Math.cos(rad) * v,
							y2 + Math.cos(rad) * kMinWidthT * v + (kage.kAdjustKakatoR[opt2] + kMinWidthT) * Math.sin(rad) * v);
						break;
					case 24:
						poly0.set(1, x2 + (kMinWidthT * v) / Math.sin(rad), y2);
						poly0.set(2, x2 - (kMinWidthT * v) / Math.sin(rad), y2);
						break;
					case 32:
						poly0.set(1, x2 + (kMinWidthT * v) / Math.sin(rad), y2);
						poly0.set(2, x2 - (kMinWidthT * v) / Math.sin(rad), y2);
						break;
				}

				polygons.push(poly0);

				if (a2 === 24) { // for T design
					const poly = new Polygon();
					poly.push(x2, y2 + kage.kMinWidthY);
					poly.push(x2 + kMinWidthT * 0.5, y2 - kage.kMinWidthY * 4);
					poly.push(x2 + kMinWidthT * 2, y2 - kage.kMinWidthY);
					poly.push(x2 + kMinWidthT * 2, y2 + kage.kMinWidthY);
					polygons.push(poly);
				}

				if ((a1 === 6) && (a2 === 0 || a2 === 5)) { // KAGI NO YOKO BOU NO SAIGO NO MARU
					const poly = new Polygon();
					if (kage.kUseCurve) {
						poly.push(x2 + Math.sin(rad) * kMinWidthT * v, y2 - Math.cos(rad) * kMinWidthT * v);
						poly.push(
							x2 - Math.cos(rad) * kMinWidthT * 0.9 * v + Math.sin(rad) * kMinWidthT * 0.9 * v,
							y2 + Math.sin(rad) * kMinWidthT * 0.9 * v - Math.cos(rad) * kMinWidthT * 0.9 * v, 1);
						poly.push(x2 + Math.cos(rad) * kMinWidthT * v, y2 + Math.sin(rad) * kMinWidthT * v);
						poly.push(
							x2 + Math.cos(rad) * kMinWidthT * 0.9 * v - Math.sin(rad) * kMinWidthT * 0.9 * v,
							y2 + Math.sin(rad) * kMinWidthT * 0.9 * v + Math.cos(rad) * kMinWidthT * 0.9 * v, 1);
						poly.push(x2 - Math.sin(rad) * kMinWidthT * v, y2 + Math.cos(rad) * kMinWidthT * v);
					} else {
						poly.push(x2 + Math.sin(rad) * kMinWidthT * v, y2 - Math.cos(rad) * kMinWidthT * v);
						poly.push(
							x2 + Math.cos(rad) * kMinWidthT * 0.8 * v + Math.sin(rad) * kMinWidthT * 0.6 * v,
							y2 + Math.sin(rad) * kMinWidthT * 0.8 * v - Math.cos(rad) * kMinWidthT * 0.6 * v);
						poly.push(x2 + Math.cos(rad) * kMinWidthT * v, y2 + Math.sin(rad) * kMinWidthT * v);
						poly.push(
							x2 + Math.cos(rad) * kMinWidthT * 0.8 * v - Math.sin(rad) * kMinWidthT * 0.6 * v,
							y2 + Math.sin(rad) * kMinWidthT * 0.8 * v + Math.cos(rad) * kMinWidthT * 0.6 * v);
						poly.push(x2 - Math.sin(rad) * kMinWidthT * v, y2 + Math.cos(rad) * kMinWidthT * v);
					}
					polygons.push(poly);
				}

				if (a1 === 6 && a2 === 5) {
					// KAGI NO YOKO BOU NO HANE
					const poly = new Polygon();
					if (x1 < x2) {
						poly.push(x2 + (kMinWidthT - 1) * Math.sin(rad) * v, y2 - (kMinWidthT - 1) * Math.cos(rad) * v);
						poly.push(
							x2 + 2 * Math.cos(rad) * v + (kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v,
							y2 + 2 * Math.sin(rad) * v - (kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
						poly.push(
							x2 + (kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v,
							y2 - (kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
						poly.push(
							x2 + (kMinWidthT - 1) * Math.sin(rad) * v - kMinWidthT * Math.cos(rad) * v,
							y2 - (kMinWidthT - 1) * Math.cos(rad) * v - kMinWidthT * Math.sin(rad) * v);
					} else {
						poly.push(x2 - (kMinWidthT - 1) * Math.sin(rad) * v, y2 + (kMinWidthT - 1) * Math.cos(rad) * v);
						poly.push(
							x2 + 2 * Math.cos(rad) * v - (kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v,
							y2 + 2 * Math.sin(rad) * v + (kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
						poly.push(
							x2 - (kMinWidthT + kage.kWidth * 5) * Math.sin(rad) * v,
							y2 + (kMinWidthT + kage.kWidth * 5) * Math.cos(rad) * v);
						poly.push(
							x2 + (kMinWidthT - 1) * Math.sin(rad) * v - kMinWidthT * Math.cos(rad) * v,
							y2 - (kMinWidthT - 1) * Math.cos(rad) * v - kMinWidthT * Math.sin(rad) * v);
					}
					polygons.push(poly);
				}

				if (a1 === 22) { // SHIKAKU MIGIUE UROKO NANAME DEMO MASSUGU MUKI
					const poly = new Polygon();
					poly.push(x1 - kMinWidthT, y1 - kage.kMinWidthY);
					poly.push(x1, y1 - kage.kMinWidthY - kage.kWidth);
					poly.push(x1 + kMinWidthT + kage.kWidth, y1 + kage.kMinWidthY);
					poly.push(x1 + kMinWidthT, y1 + kMinWidthT - 1);
					poly.push(x1 - kMinWidthT, y1 + kMinWidthT + 4);
					polygons.push(poly);
				}

				if (a2 === 13 && opt2 === 4) { // for new GTH box's left bottom corner MUKI KANKEINASHI
					const poly = new Polygon();
					let m = 0;
					if (x1 > x2 && y1 !== y2) {
						m = Math.floor((x1 - x2) / (y2 - y1) * 3);
					}
					poly.push(x2 + m, y2 - kage.kMinWidthY * 5);
					poly.push(x2 - kMinWidthT * 2 + m, y2);
					poly.push(x2 - kage.kMinWidthY + m, y2 + kage.kMinWidthY * 5);
					poly.push(x2 + kMinWidthT + m, y2 + kage.kMinWidthY);
					poly.push(x2 + m, y2);
					polygons.push(poly);
				}

				const XX = Math.sin(rad) * v;
				const XY = Math.cos(rad) * v * -1;
				const YX = Math.cos(rad) * v;
				const YY = Math.sin(rad) * v;

				if (a1 === 0) { // beginning of the storke
					const poly = new Polygon();
					poly.push(
						x1 + kMinWidthT * XX + (kage.kMinWidthY * 0.5) * YX,
						y1 + kMinWidthT * XY + (kage.kMinWidthY * 0.5) * YY);
					poly.push(
						x1 + (kMinWidthT + kMinWidthT * 0.5) * XX + (kage.kMinWidthY * 0.5 + kage.kMinWidthY) * YX,
						y1 + (kMinWidthT + kMinWidthT * 0.5) * XY + (kage.kMinWidthY * 0.5 + kage.kMinWidthY) * YY);
					poly.push(
						x1 + kMinWidthT * XX + (kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2) * YX - 2 * XX,
						y1 + kMinWidthT * XY + (kage.kMinWidthY * 0.5 + kage.kMinWidthY * 2) * YY + 1 * XY);
					polygons.push(poly);
				}
			}
		}
	} else { // gothic
		if (tx1 === tx2) { // if TATE stroke, use y-axis
			let x1;
			let y1;
			let x2;
			let y2;
			let a1;
			let a2;
			if (ty1 > ty2) {
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

			if (a1 % 10 === 2) {
				y1 -= kage.kWidth;
			}
			if (a2 % 10 === 2) {
				y2 += kage.kWidth;
			}
			if (a1 % 10 === 3) {
				y1 -= kage.kWidth * kage.kKakato;
			}
			if (a2 % 10 === 3) {
				y2 += kage.kWidth * kage.kKakato;
			}

			const poly = new Polygon();
			poly.push(x1 - kage.kWidth, y1);
			poly.push(x2 - kage.kWidth, y2);
			poly.push(x2 + kage.kWidth, y2);
			poly.push(x1 + kage.kWidth, y1);
			// poly.reverse(); // for fill-rule

			polygons.push(poly);
		} else if (ty1 === ty2) { // if YOKO stroke, use x-axis
			let x1;
			let y1;
			let x2;
			let y2;
			let a1;
			let a2;
			if (tx1 > tx2) {
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
			if (a1 % 10 === 2) {
				x1 -= kage.kWidth;
			}
			if (a2 % 10 === 2) {
				x2 += kage.kWidth;
			}
			if (a1 % 10 === 3) {
				x1 -= kage.kWidth * kage.kKakato;
			}
			if (a2 % 10 === 3) {
				x2 += kage.kWidth * kage.kKakato;
			}

			const poly = new Polygon();
			poly.push(x1, y1 - kage.kWidth);
			poly.push(x2, y2 - kage.kWidth);
			poly.push(x2, y2 + kage.kWidth);
			poly.push(x1, y1 + kage.kWidth);

			polygons.push(poly);
		} else { // for others, use x-axis
			let x1;
			let y1;
			let x2;
			let y2;
			let a1;
			let a2;
			if (tx1 > tx2) {
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
			const rad = Math.atan((y2 - y1) / (x2 - x1));
			if (a1 % 10 === 2) {
				x1 -= kage.kWidth * Math.cos(rad);
				y1 -= kage.kWidth * Math.sin(rad);
			}
			if (a2 % 10 === 2) {
				x2 += kage.kWidth * Math.cos(rad);
				y2 += kage.kWidth * Math.sin(rad);
			}
			if (a1 % 10 === 3) {
				x1 -= kage.kWidth * Math.cos(rad) * kage.kKakato;
				y1 -= kage.kWidth * Math.sin(rad) * kage.kKakato;
			}
			if (a2 % 10 === 3) {
				x2 += kage.kWidth * Math.cos(rad) * kage.kKakato;
				y2 += kage.kWidth * Math.sin(rad) * kage.kKakato;
			}

			// SUICHOKU NO ICHI ZURASHI HA Math.sin TO Math.cos NO IREKAE + x-axis MAINASU KA
			const poly = new Polygon();
			poly.push(x1 + Math.sin(rad) * kage.kWidth, y1 - Math.cos(rad) * kage.kWidth);
			poly.push(x2 + Math.sin(rad) * kage.kWidth, y2 - Math.cos(rad) * kage.kWidth);
			poly.push(x2 - Math.sin(rad) * kage.kWidth, y2 + Math.cos(rad) * kage.kWidth);
			poly.push(x1 - Math.sin(rad) * kage.kWidth, y1 + Math.cos(rad) * kage.kWidth);

			polygons.push(poly);
		}
	}
}