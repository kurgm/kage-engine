import { Polygon } from "../../polygon";
import { Polygons } from "../../polygons";
import { Stroke } from "../../stroke";
import { hypot, normalize, round } from "../../util";
import { FontInterface, StrokeDrawer } from "..";
import { KShotai } from "../shotai";

import { cdDrawBezier, cdDrawCurve, cdDrawLine } from "./cd";

interface MinchoAdjustedStroke {
	readonly stroke: Stroke;

	/** Value computed by {@link Mincho.adjustKirikuchi} if a1 = 2 and a2 = 32 and x1 &gt; x2 and y1 &lt; y2; otherwise equals to a2_opt_1 */
	kirikuchiAdjustment: number;
	/** Value computed by {@link Mincho.adjustTate} if a1 in {1,3,7} and x1 = x2; otherwise equals to a2_opt_2 + a2_opt_3 * 10 */
	tateAdjustment: number;

	/** Value computed by {@link Mincho.adjustHane} if a1 in {1,2,6} and a3 = 4; otherwise equals to a3_opt_1 */
	haneAdjustment: number;
	/** Value computed by {@link Mincho.adjustUroko} or {@link Mincho.adjustUroko2} if a1 = 1 and a3 = 0; otherwise equals to a3_opt */
	urokoAdjustment: number;
	/** Value computed by {@link Mincho.adjustKakato} if a1 = 1 and a3 in {13,23}; otherwise equals to a3_opt */
	kakatoAdjustment: number;
	/** Value computed by {@link Mincho.adjustMage} if a1 = 3 and y2 = y3; otherwise equals to a3_opt_2 */
	mageAdjustment: number;
}

function selectPolygonsRect(
	polygons: Polygons, x1: number, y1: number, x2: number, y2: number
): Polygon[] {
	return polygons.array.filter((polygon) => (
		polygon.array.every(({ x, y }) => x1 <= x && x <= x2 && y1 <= y && y <= y2)
	));
}

/** @internal */
export function dfTransform(
	polygons: Polygons,
	x1: number, y1: number, x2: number, y2: number,
	a2_100: number, a3_100: number, a2_opt: number, a3_opt: number
): void {
	if (a2_100 === 98 && a2_opt === 0) {
		const dx = x1 + x2, dy = 0;
		for (const polygon of selectPolygonsRect(polygons, x1, y1, x2, y2)) {
			polygon.reflectX().translate(dx, dy).floor();
		}
	} else if (a2_100 === 97 && a2_opt === 0) {
		const dx = 0, dy = y1 + y2;
		for (const polygon of selectPolygonsRect(polygons, x1, y1, x2, y2)) {
			polygon.reflectY().translate(dx, dy).floor();
		}
	} else if (a2_100 === 99 && a2_opt === 0) {
		if (a3_100 === 1 && a3_opt === 0) {
			const dx = x1 + y2, dy = y1 - x1;
			for (const polygon of selectPolygonsRect(polygons, x1, y1, x2, y2)) {
				// polygon.translate(-x1, -y2).rotate90().translate(x1, y1);
				polygon.rotate90().translate(dx, dy).floor();
			}
		} else if (a3_100 === 2 && a3_opt === 0) {
			const dx = x1 + x2, dy = y1 + y2;
			for (const polygon of selectPolygonsRect(polygons, x1, y1, x2, y2)) {
				polygon.rotate180().translate(dx, dy).floor();
			}
		} else if (a3_100 === 3 && a3_opt === 0) {
			const dx = x1 - y1, dy = y2 + x1;
			for (const polygon of selectPolygonsRect(polygons, x1, y1, x2, y2)) {
				// polygon.translate(-x1, -y1).rotate270().translate(x1, y2);
				polygon.rotate270().translate(dx, dy).floor();
			}
		}
	}
}


function dfDrawFont(
	font: Mincho, polygons: Polygons,
	{
		stroke: {
			a1_100,
			a2_100, a2_opt, a2_opt_1, a2_opt_2, a2_opt_3,
			a3_100, a3_opt, a3_opt_1, a3_opt_2,
			x1, y1, x2, y2, x3, y3, x4, y4,
		},
		kirikuchiAdjustment, tateAdjustment,
		haneAdjustment, urokoAdjustment, kakatoAdjustment, mageAdjustment,
	}: MinchoAdjustedStroke): void {

	switch (a1_100) { // ... no need to divide
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
				cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100 + a2_opt_1 * 100, 1, tateAdjustment, 0, 0);
				cdDrawCurve(
					font, polygons,
					tx1, ty1, x2, y2,
					x2 - font.kMage * (((font.kAdjustTateStep + 4) - tateAdjustment) / (font.kAdjustTateStep + 4)), y2,
					1, 14, tateAdjustment % 10, haneAdjustment, Math.floor(tateAdjustment / 10), a3_opt_2);
			} else {
				cdDrawLine(
					font, polygons, x1, y1, x2, y2,
					a2_100 + a2_opt_1 * 100, a3_100, tateAdjustment, urokoAdjustment, kakatoAdjustment);
			}
			break;
		}
		case 2: {
			// case 12: // ... no need
			if (a3_100 === 4) {
				const [dx1, dy1] = (x2 === x3)
					? [0, -font.kMage] // ?????
					: (y2 === y3)
						? [-font.kMage, 0] // ?????
						: normalize([x2 - x3, y2 - y3], font.kMage);
				const tx1 = x3 + dx1;
				const ty1 = y3 + dy1;
				cdDrawCurve(
					font, polygons, x1, y1, x2, y2, tx1, ty1,
					a2_100 + kirikuchiAdjustment * 100, 0, a2_opt_2, 0, a2_opt_3, 0);
				cdDrawCurve(font, polygons, tx1, ty1, x3, y3, x3 - font.kMage, y3, 2, 14, a2_opt_2, haneAdjustment, 0, a3_opt_2);
			} else {
				cdDrawCurve(
					font, polygons, x1, y1, x2, y2, x3, y3,
					a2_100 + kirikuchiAdjustment * 100, (a3_100 === 5 && a3_opt === 0) ? 15 : a3_100,
					a2_opt_2, a3_opt_1, a2_opt_3, a3_opt_2);
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

			cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100 + a2_opt_1 * 100, 1, tateAdjustment, 0, 0);
			cdDrawCurve(font, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, tateAdjustment, mageAdjustment);

			if (!(a3_100 === 5 && a3_opt_1 === 0 && !((x2 < x3 && x3 - tx2 > 0) || (x2 > x3 && tx2 - x3 > 0)))) { // for closer position
				const opt2 = (a3_100 === 5 && a3_opt_1 === 0) ? 0 : a3_opt_1 + mageAdjustment * 10;
				cdDrawLine(font, polygons, tx2, ty2, x3, y3,
					6, a3_100, mageAdjustment, opt2, opt2); // bolder by force
			}
			break;
		}
		case 12: {
			cdDrawCurve(
				font, polygons, x1, y1, x2, y2, x3, y3,
				a2_100 + a2_opt_1 * 100, 1, a2_opt_2, 0, a2_opt_3, 0);
			cdDrawLine(font, polygons, x3, y3, x4, y4, 6, a3_100, 0, a3_opt, a3_opt);
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

			cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100 + a2_opt_1 * 100, 1, a2_opt_2 + a2_opt_3 * 10, 0, 0);
			cdDrawCurve(font, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, 0, 0);

			if (!(a3_100 === 5 && a3_opt === 0 && x3 - tx2 <= 0)) { // for closer position
				cdDrawLine(font, polygons, tx2, ty2, x3, y3, 6, a3_100, 0, a3_opt, a3_opt); // bolder by force
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
				cdDrawBezier(
					font, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1,
					a2_100 + a2_opt_1 * 100, 1, a2_opt_2, 0, a2_opt_3, 0);
				cdDrawCurve(font, polygons, tx1, ty1, x4, y4, x4 - font.kMage, y4, 1, 14, 0, haneAdjustment, 0, a3_opt_2);
			} else {
				cdDrawBezier(
					font, polygons, x1, y1, x2, y2, x3, y3, x4, y4,
					a2_100 + a2_opt_1 * 100, (a3_100 === 5 && a3_opt === 0) ? 15 : a3_100,
					a2_opt_2, a3_opt_1, a2_opt_3, a3_opt_2);
			}
			break;
		}
		case 7: {
			cdDrawLine(font, polygons, x1, y1, x2, y2, a2_100 + a2_opt_1 * 100, 1, tateAdjustment, 0, 0);
			cdDrawCurve(
				font, polygons, x2, y2, x3, y3, x4, y4,
				1, a3_100, tateAdjustment % 10, a3_opt_1, Math.floor(tateAdjustment / 10), a3_opt_2);
			break;
		}
		case 9: // may not be exist ... no need
			// kageCanvas[y1][x1] = 0;
			// kageCanvas[y2][x2] = 0;
			break;
		default:
			break;
	}
}

/** Mincho style font. */
class Mincho implements FontInterface {
	public readonly shotai: KShotai = KShotai.kMincho;

	/**
	 * Precision for polygon approximation of curving strokes.
	 * It must be a positive divisor of 1000. The smaller `kRate` will give
	 * smoother curves approximated with the larger number of points (roughly
	 * 2 × 1000 / `kRate` per one curve stroke).
	 */
	public kRate: number = 100; // must divide 1000
	/** Half of the width of mincho-style horizontal (thinner) strokes. */
	public kMinWidthY: number;
	/** Determines the size of ウロコ at the 開放 end of mincho-style horizontal strokes. */
	public kMinWidthU: number;
	/** Half of the width of mincho-style vertical (thicker) strokes. */
	public kMinWidthT: number;
	/**
	 * Half of the width of gothic-style strokes.
	 * Also used to determine the size of mincho's ornamental elements.
	 */
	public kWidth: number;
	/** Size of カカト in gothic. */
	public kKakato: number;
	/** Width at the end of 右払い relative to `2 * kMinWidthT`. */
	public kL2RDfatten: number;
	/** Size of curve at the end of 左ハネ, and at the middle of 折れ and 乙線 strokes. */
	public kMage: number;
	/**
	 * Whether to use off-curve points to approximate curving strokes
	 * with quadratic Bézier curve (experimental).
	 */
	public kUseCurve: boolean;

	/** Length of 左下カド's カカト in mincho for each shortening level (0 to 3) and 413 (左下zh用新). */
	// for KAKATO adjustment 000,100,200,300,400
	public kAdjustKakatoL: number[];
	/** Length of 右下カド's カカト in mincho for each shortening level (0 to 3). */
	// for KAKATO adjustment 000,100,200,300
	public kAdjustKakatoR: number[];
	/** Width of the collision box below カカト for shortening adjustment. */
	// check area width
	public kAdjustKakatoRangeX: number;
	/** Height of the collision box below カカト for each shortening adjustment level (0 to 3). */
	// 3 steps of checking
	public kAdjustKakatoRangeY: number[];
	/** Number of カカト shortening levels. Must be set to 3. */
	// number of steps
	public kAdjustKakatoStep: number;

	/** Size of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking level (0 to max({@link kAdjustUrokoLengthStep}, {@link kAdjustUroko2Step})). */
	// for UROKO adjustment 000,100,200,300
	public kAdjustUrokoX: number[];
	/** Size of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking level (0 to max({@link kAdjustUrokoLengthStep}, {@link kAdjustUroko2Step})). */
	// for UROKO adjustment 000,100,200,300
	public kAdjustUrokoY: number[];
	/** Threshold length of horizontal strokes for shrinking its ウロコ for each adjustment level ({@link kAdjustUrokoLengthStep} to 1). */
	// length for checking
	public kAdjustUrokoLength: number[];
	/** Number of ウロコ shrinking levels by adjustment using collision detection. */
	// number of steps
	public kAdjustUrokoLengthStep: number;
	/** Size of the collision box to the left of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking adjustment level ({@link kAdjustUrokoLengthStep} to 1). */
	// check for crossing. corresponds to length
	public kAdjustUrokoLine: number[];

	/** Number of ウロコ shrinking levels by adjustment using density of horizontal strokes. */
	public kAdjustUroko2Step: number;
	/** Parameter for shrinking adjustment of ウロコ using density of horizontal strokes. */
	public kAdjustUroko2Length: number;
	/** Parameter for thinning adjustment of mincho-style vertical strokes. */
	public kAdjustTateStep: number;
	/** Parameter for thinning adjustment of latter half of mincho-style 折れ strokes. */
	public kAdjustMageStep: number;

	public constructor() {
		this.setSize();
	}

	public setSize(size?: number): void {
		if (size === 1) {
			this.kMinWidthY = 1.2;
			this.kMinWidthT = 3.6;
			this.kWidth = 3;
			this.kKakato = 1.8;
			this.kL2RDfatten = 1.1;
			this.kMage = 6;
			this.kUseCurve = false;

			this.kAdjustKakatoL = [8, 5, 3, 1, 0];
			this.kAdjustKakatoR = [4, 3, 2, 1];
			this.kAdjustKakatoRangeX = 12;
			this.kAdjustKakatoRangeY = [1, 11, 14, 18];
			this.kAdjustKakatoStep = 3;

			this.kAdjustUrokoX = [14, 12, 9, 7];
			this.kAdjustUrokoY = [7, 6, 5, 4];
			this.kAdjustUrokoLength = [13, 21, 30];
			this.kAdjustUrokoLengthStep = 3;
			this.kAdjustUrokoLine = [13, 15, 18];
		} else {
			this.kMinWidthY = 2;
			this.kMinWidthU = 2;
			this.kMinWidthT = 6;
			this.kWidth = 5;
			this.kKakato = 3;
			this.kL2RDfatten = 1.1;
			this.kMage = 10;
			this.kUseCurve = false;

			this.kAdjustKakatoL = [14, 9, 5, 2, 0];
			this.kAdjustKakatoR = [8, 6, 4, 2];
			this.kAdjustKakatoRangeX = 20;
			this.kAdjustKakatoRangeY = [1, 19, 24, 30];
			this.kAdjustKakatoStep = 3;

			this.kAdjustUrokoX = [24, 20, 16, 12];
			this.kAdjustUrokoY = [12, 11, 9, 8];
			this.kAdjustUrokoLength = [22, 36, 50];
			this.kAdjustUrokoLengthStep = 3;
			this.kAdjustUrokoLine = [22, 26, 30];

			this.kAdjustUroko2Step = 3;
			this.kAdjustUroko2Length = 40;

			this.kAdjustTateStep = 4;

			this.kAdjustMageStep = 5;
		}
	}

	/** @internal */
	public getDrawers(strokesArray: Stroke[]): StrokeDrawer[] {
		return this.adjustStrokes(strokesArray).map((adjStroke) => (polygons: Polygons) => {
			dfDrawFont(this, polygons, adjStroke);
		});
	}

	/** @internal */
	public adjustStrokes(strokesArray: Stroke[]): MinchoAdjustedStroke[] {
		const adjustedStrokes = strokesArray.map((stroke): MinchoAdjustedStroke => {
			const { a2_opt_1, a2_opt_2, a2_opt_3, a3_opt, a3_opt_1, a3_opt_2 } = stroke;
			return {
				stroke,

				// a2:
				// - 100s place: adjustKirikuchi (when 2:X32);
				// - 1000s place: adjustTate (when {1,3,7})
				kirikuchiAdjustment: a2_opt_1,
				tateAdjustment: a2_opt_2 + a2_opt_3 * 10,

				// a3:
				// - 100s place: adjustHane (when {1,2,6}::X04), adjustUroko/adjustUroko2 (when 1::X00),
				//               adjustKakato (when 1::X{13,23});
				// - 1000s place: adjustMage (when 3)
				haneAdjustment: a3_opt_1,
				urokoAdjustment: a3_opt,
				kakatoAdjustment: a3_opt,
				mageAdjustment: a3_opt_2,
			};
		});
		this.adjustHane(adjustedStrokes);
		this.adjustMage(adjustedStrokes);
		this.adjustTate(adjustedStrokes);
		this.adjustKakato(adjustedStrokes);
		this.adjustUroko(adjustedStrokes);
		this.adjustUroko2(adjustedStrokes);
		this.adjustKirikuchi(adjustedStrokes);
		return adjustedStrokes;
	}

	protected adjustHane(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		const vertSegments: { stroke: Stroke; x: number; y1: number; y2: number; }[] = [];
		for (const { stroke } of adjStrokes) {
			if (stroke.a1_100 === 1 && stroke.a1_opt === 0 && stroke.x1 === stroke.x2) {
				vertSegments.push({
					stroke,
					x: stroke.x1,
					y1: stroke.y1,
					y2: stroke.y2,
				});
			}
		}
		for (const adjStroke of adjStrokes) {
			const { stroke } = adjStroke;
			if ((stroke.a1_100 === 1 || stroke.a1_100 === 2 || stroke.a1_100 === 6) && stroke.a1_opt === 0
				&& stroke.a3_100 === 4 && stroke.a3_opt === 0) {
				let lpx: number; // lastPointX
				let lpy: number; // lastPointY
				if (stroke.a1_100 === 1) {
					lpx = stroke.x2;
					lpy = stroke.y2;
				} else if (stroke.a1_100 === 2) {
					lpx = stroke.x3;
					lpy = stroke.y3;
				} else {
					lpx = stroke.x4;
					lpy = stroke.y4;
				}
				let mn = Infinity; // mostNear
				if (lpx + 18 < 100) {
					mn = lpx + 18;
				}
				for (const { stroke: stroke2, x, y1, y2 } of vertSegments) {
					if (stroke !== stroke2
						&& lpx - x < 100 && x < lpx
						&& y1 <= lpy && y2 >= lpy) {
						mn = Math.min(mn, lpx - x);
					}
				}
				if (mn !== Infinity) {
					adjStroke.haneAdjustment += 7 - Math.floor(mn / 15);
				}
			}
		}
		return adjStrokes;
	}

	protected adjustMage(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		const horiSegments: { stroke: Stroke; adjStroke: MinchoAdjustedStroke; isTarget: boolean; y: number; x1: number; x2: number; }[] = [];
		for (const adjStroke of adjStrokes) {
			const { stroke } = adjStroke;
			if (stroke.a1_100 === 1 && stroke.a1_opt === 0 && stroke.y1 === stroke.y2) {
				horiSegments.push({
					stroke,
					adjStroke,
					isTarget: false,
					y: stroke.y2,
					x1: stroke.x1,
					x2: stroke.x2,
				});
			} else if (stroke.a1_100 === 3 && stroke.a1_opt === 0 && stroke.y2 === stroke.y3) {
				horiSegments.push({
					stroke,
					adjStroke,
					isTarget: true,
					y: stroke.y2,
					x1: stroke.x2,
					x2: stroke.x3,
				});
			}
		}
		for (const { adjStroke, stroke, isTarget, y, x1, x2 } of horiSegments) {
			if (isTarget) {
				for (const { stroke: stroke2, y: other_y, x1: other_x1, x2: other_x2 } of horiSegments) {
					if (stroke !== stroke2
						&& !(x1 + 1 > other_x2 || x2 - 1 < other_x1)
						&& round(Math.abs(y - other_y)) < this.kMinWidthT * this.kAdjustMageStep) {
						adjStroke.mageAdjustment += this.kAdjustMageStep - Math.floor(Math.abs(y - other_y) / this.kMinWidthT);
						if (adjStroke.mageAdjustment > this.kAdjustMageStep) {
							adjStroke.mageAdjustment = this.kAdjustMageStep;
						}
					}
				}
			}
		}
		return adjStrokes;
	}

	protected adjustTate(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		const vertSegments: { stroke: Stroke; adjStroke: MinchoAdjustedStroke; x: number; y1: number; y2: number; }[] = [];
		for (const adjStroke of adjStrokes) {
			const { stroke } = adjStroke;
			if ((stroke.a1_100 === 1 || stroke.a1_100 === 3 || stroke.a1_100 === 7) && stroke.a1_opt === 0 && stroke.x1 === stroke.x2) {
				vertSegments.push({
					stroke,
					adjStroke,
					x: stroke.x1,
					y1: stroke.y1,
					y2: stroke.y2,
				});
			}
		}
		for (const { adjStroke, stroke, x, y1, y2 } of vertSegments) {
			for (const { stroke: stroke2, x: other_x, y1: other_y1, y2: other_y2 } of vertSegments) {
				if (stroke !== stroke2
					&& !(y1 + 1 > other_y2 || y2 - 1 < other_y1)
					&& round(Math.abs(x - other_x)) < this.kMinWidthT * this.kAdjustTateStep) {
					adjStroke.tateAdjustment += this.kAdjustTateStep - Math.floor(Math.abs(x - other_x) / this.kMinWidthT);
					if (adjStroke.tateAdjustment > this.kAdjustTateStep
						|| adjStroke.tateAdjustment === this.kAdjustTateStep && (stroke.a2_opt_1 !== 0 || stroke.a2_100 !== 0)) {
						adjStroke.tateAdjustment = this.kAdjustTateStep;
					}
				}
			}
		}
		return adjStrokes;
	}

	protected adjustKakato(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		for (const adjStroke of adjStrokes) {
			const { stroke } = adjStroke;
			if (stroke.a1_100 === 1 && stroke.a1_opt === 0
				&& (stroke.a3_100 === 13 || stroke.a3_100 === 23) && stroke.a3_opt === 0) {
				for (let k = 0; k < this.kAdjustKakatoStep; k++) {
					if (adjStrokes.some(({ stroke: stroke2 }) =>
						stroke !== stroke2 &&
						stroke2.isCrossBox(
							stroke.x2 - this.kAdjustKakatoRangeX / 2,
							stroke.y2 + this.kAdjustKakatoRangeY[k],
							stroke.x2 + this.kAdjustKakatoRangeX / 2,
							stroke.y2 + this.kAdjustKakatoRangeY[k + 1]))
						|| round(stroke.y2 + this.kAdjustKakatoRangeY[k + 1]) > 200 // adjust for baseline
						|| round(stroke.y2 - stroke.y1) < this.kAdjustKakatoRangeY[k + 1] // for thin box
					) {
						adjStroke.kakatoAdjustment = 3 - k;
						break;
					}
				}
			}
		}
		return adjStrokes;
	}

	protected adjustUroko(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		for (const adjStroke of adjStrokes) {
			const { stroke } = adjStroke;
			if (stroke.a1_100 === 1 && stroke.a1_opt === 0
				&& stroke.a3_100 === 0 && stroke.a3_opt === 0) { // no operation for TATE
				for (let k = 0; k < this.kAdjustUrokoLengthStep; k++) {
					const [cosrad, sinrad] = (stroke.y1 === stroke.y2) // YOKO
						? [1, 0] // ?????
						: (stroke.x2 - stroke.x1 < 0)
							? normalize([stroke.x1 - stroke.x2, stroke.y1 - stroke.y2]) // for backward compatibility...
							: normalize([stroke.x2 - stroke.x1, stroke.y2 - stroke.y1]);
					const tx = stroke.x2 - this.kAdjustUrokoLine[k] * cosrad - 0.5 * sinrad; // typo? (sinrad should be -sinrad ?)
					const ty = stroke.y2 - this.kAdjustUrokoLine[k] * sinrad - 0.5 * cosrad;

					const tlen = (stroke.y1 === stroke.y2) // YOKO
						? stroke.x2 - stroke.x1 // should be Math.abs(...)?
						: hypot(stroke.y2 - stroke.y1, stroke.x2 - stroke.x1);
					if (round(tlen) < this.kAdjustUrokoLength[k]
						|| adjStrokes.some(({ stroke: stroke2 }) => stroke !== stroke2 && stroke2.isCross(tx, ty, stroke.x2, stroke.y2))) {
						adjStroke.urokoAdjustment = this.kAdjustUrokoLengthStep - k;
						break;
					}
				}
			}
		}
		return adjStrokes;
	}

	protected adjustUroko2(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		const horiSegments: { stroke: Stroke; adjStroke: MinchoAdjustedStroke; isTarget: boolean; y: number; x1: number; x2: number }[] = [];
		for (const adjStroke of adjStrokes) {
			const { stroke } = adjStroke;
			if (stroke.a1_100 === 1 && stroke.a1_opt === 0
				&& stroke.y1 === stroke.y2) {
				horiSegments.push({
					stroke,
					adjStroke,
					isTarget: stroke.a3_100 === 0 && stroke.a3_opt === 0 && adjStroke.urokoAdjustment === 0,
					y: stroke.y1,
					x1: stroke.x1,
					x2: stroke.x2,
				});
			} else if (stroke.a1_100 === 3 && stroke.a1_opt === 0
				&& stroke.y2 === stroke.y3) {
				horiSegments.push({
					stroke,
					adjStroke,
					isTarget: false,
					y: stroke.y2,
					x1: stroke.x2,
					x2: stroke.x3,
				});
			}
		}
		for (const { adjStroke, stroke, isTarget, y, x1, x2 } of horiSegments) {
			if (isTarget) {
				let pressure = 0;
				for (const { stroke: stroke2, y: other_y, x1: other_x1, x2: other_x2 } of horiSegments) {
					if (stroke !== stroke2
						&& !(x1 + 1 > other_x2 || x2 - 1 < other_x1)
						&& round(Math.abs(y - other_y)) < this.kAdjustUroko2Length) {
						pressure += (this.kAdjustUroko2Length - Math.abs(y - other_y)) ** 1.1;
					}
				}
				// const result = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
				// if (stroke.a3 < result) {
				adjStroke.urokoAdjustment = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step);
				// }
			}
		}
		return adjStrokes;
	}

	protected adjustKirikuchi(adjStrokes: MinchoAdjustedStroke[]): MinchoAdjustedStroke[] {
		const horiSegments: { y: number; x1: number; x2: number }[] = [];
		for (const { stroke } of adjStrokes) {
			if (stroke.a1_100 === 1 && stroke.a1_opt === 0 && stroke.y1 === stroke.y2) {
				horiSegments.push({
					y: stroke.y1,
					x1: stroke.x1,
					x2: stroke.x2,
				});
			}
		}
		for (const adjStroke of adjStrokes) {
			const { stroke } = adjStroke;
			if (stroke.a1_100 === 2 && stroke.a1_opt === 0
				&& stroke.a2_100 === 32 && stroke.a2_opt === 0
				&& stroke.x1 > stroke.x2 && stroke.y1 < stroke.y2
				&& horiSegments.some(({ y, x1, x2 }) => ( // no need to skip when i == j
					x1 < stroke.x1 && x2 > stroke.x1 && y === stroke.y1
				))) {
				adjStroke.kirikuchiAdjustment = 1;
			}
		}
		return adjStrokes;
	}
}

export default Mincho;
