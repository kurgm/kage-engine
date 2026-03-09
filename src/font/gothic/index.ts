import { Polygons } from "../../polygons.js";
import { Stroke } from "../../stroke.js";
import { hypot, normalize } from "../../util.js";
import { FontInterface, StrokeDrawer } from "../index.js";
import { KShotai } from "../shotai.js";

import { cdDrawBezier, cdDrawCurve, cdDrawLine } from "./cd.js";
import Mincho, { dfTransform } from "../mincho/index.js";

function dfDrawFont(
	font: Gothic, polygons: Polygons,
	{
		a1_100, a2_100, a2_opt,
		a3_100, a3_opt, a3_opt_1,
		x1, y1, x2, y2, x3, y3, x4, y4,
	}: Stroke): void {

	switch (a1_100) {
		case 0:
			dfTransform(polygons, x1, y1, x2, y2, a2_100, a3_100, a2_opt, a3_opt);
			break;
		case 1: {
			if (a3_100 === 4) {
				const [dx1, dy1] = (x1 === x2 && y1 === y2)
					? [0, font.kMage] // ?????
					: normalize([x1 - x2, y1 - y2], font.kMage);
				const tx1 = x2 + dx1;
				const ty1 = y2 + dy1;
				cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100, 1);
				cdDrawCurve(font, polygons, tx1, ty1, x2, y2, x2 - font.kMage * 2, y2 - font.kMage * 0.5, 1, 0);
			} else {
				cdDrawLine(font, polygons, x1, y1, x2, y2, a2_100, a3_100);
			}
			break;
		}
		case 2:
		case 12: {
			if (a3_100 === 4) {
				const [dx1, dy1] = (x2 === x3)
					? [0, -font.kMage] // ?????
					: (y2 === y3)
						? [-font.kMage, 0] // ?????
						: normalize([x2 - x3, y2 - y3], font.kMage);
				const tx1 = x3 + dx1;
				const ty1 = y3 + dy1;
				cdDrawCurve(font, polygons, x1, y1, x2, y2, tx1, ty1, a2_100, 1);
				cdDrawCurve(font, polygons, tx1, ty1, x3, y3, x3 - font.kMage * 2, y3 - font.kMage * 0.5, 1, 0);
			} else if (a3_100 === 5 && a3_opt === 0) {
				const tx1 = x3 + font.kMage;
				const ty1 = y3;
				const tx2 = tx1 + font.kMage * 0.5;
				const ty2 = y3 - font.kMage * 2;
				cdDrawCurve(font, polygons, x1, y1, x2, y2, x3, y3, a2_100, 1);
				cdDrawCurve(font, polygons, x3, y3, tx1, ty1, tx2, ty2, 1, 0);
			} else {
				cdDrawCurve(font, polygons, x1, y1, x2, y2, x3, y3, a2_100, a3_100);
			}
			break;
		}
		case 3: {
			const [dx1, dy1] = (x1 === x2 && y1 === y2)
				? [0, font.kMage] // ?????
				: normalize([x1 - x2, y1 - y2], font.kMage);
			const tx1 = x2 + dx1;
			const ty1 = y2 + dy1;
			const [dx2, dy2] = (x2 === x3 && y2 === y3)
				? [0, -font.kMage] // ?????
				: normalize([x3 - x2, y3 - y2], font.kMage);
			const tx2 = x2 + dx2;
			const ty2 = y2 + dy2;

			cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100, 1);
			cdDrawCurve(font, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1);

			if (a3_100 === 5 && a3_opt_1 === 0) {
				const tx3 = x3 - font.kMage;
				const ty3 = y3;
				const tx4 = x3 + font.kMage * 0.5;
				const ty4 = y3 - font.kMage * 2;

				cdDrawLine(font, polygons, tx2, ty2, tx3, ty3, 1, 1);
				cdDrawCurve(font, polygons, tx3, ty3, x3, y3, tx4, ty4, 1, 0);
			} else {
				cdDrawLine(font, polygons, tx2, ty2, x3, y3, 1, a3_100);
			}
			break;
		}
		case 4: {
			let rate = hypot(x3 - x2, y3 - y2) / 120 * 6;
			if (rate > 6) {
				rate = 6;
			}
			const [dx1, dy1] = (x1 === x2 && y1 === y2)
				? [0, font.kMage * rate] // ?????
				: normalize([x1 - x2, y1 - y2], font.kMage * rate);
			const tx1 = x2 + dx1;
			const ty1 = y2 + dy1;
			const [dx2, dy2] = (x2 === x3 && y2 === y3)
				? [0, -font.kMage * rate] // ?????
				: normalize([x3 - x2, y3 - y2], font.kMage * rate);
			const tx2 = x2 + dx2;
			const ty2 = y2 + dy2;

			cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100, 1);
			cdDrawCurve(font, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1);
			if (a3_100 === 5 && a3_opt === 0) {
				const tx3 = x3 - font.kMage;
				const ty3 = y3;
				const tx4 = x3 + font.kMage * 0.5;
				const ty4 = y3 - font.kMage * 2;

				cdDrawLine(font, polygons, tx2, ty2, tx3, ty3, 1, 1);
				cdDrawCurve(font, polygons, tx3, ty3, x3, y3, tx4, ty4, 1, 0);
			} else {
				cdDrawLine(font, polygons, tx2, ty2, x3, y3, 1, a3_100);
			}
			break;
		}
		case 6: {
			if (a3_100 === 4) {
				const [dx1, dy1] = (x3 === x4)
					? [0, -font.kMage] // ?????
					: (y3 === y4)
						? [-font.kMage, 0] // ?????
						: normalize([x3 - x4, y3 - y4], font.kMage);
				const tx1 = x4 + dx1;
				const ty1 = y4 + dy1;
				cdDrawBezier(font, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1, a2_100, 1);
				cdDrawCurve(font, polygons, tx1, ty1, x4, y4, x4 - font.kMage * 2, y4 - font.kMage * 0.5, 1, 0);
			} else if (a3_100 === 5 && a3_opt === 0) {
				const tx1 = x4 - font.kMage;
				const ty1 = y4;
				const tx2 = x4 + font.kMage * 0.5;
				const ty2 = y4 - font.kMage * 2;
				/*
				cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
				cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, tx1, ty1, 1, 1);
				 */
				cdDrawBezier(font, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1, a2_100, 1);
				cdDrawCurve(font, polygons, tx1, ty1, x4, y4, tx2, ty2, 1, 0);
			} else {
				/*
				cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
				cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, x4, y4, 1, a3);
				 */
				cdDrawBezier(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2_100, a3_100);
			}
			break;
		}
		case 7: {
			cdDrawLine(font, polygons, x1, y1, x2, y2, a2_100, 1);
			cdDrawCurve(font, polygons, x2, y2, x3, y3, x4, y4, 1, a3_100);
			break;
		}
		case 9: // may not be exist
			// kageCanvas[y1][x1] = 0;
			// kageCanvas[y2][x2] = 0;
			break;
		default:
			break;
	}
}

/** Gothic-style font (ゴシック体). */
class Gothic extends Mincho implements FontInterface {
	public override readonly shotai: KShotai = KShotai.kGothic;
	/** @internal */
	public override getDrawers(strokesArray: Stroke[]): StrokeDrawer[] {
		return strokesArray.map((stroke) => (polygons: Polygons) => {
			dfDrawFont(this, polygons, stroke);
		});
	}
}

export default Gothic;
