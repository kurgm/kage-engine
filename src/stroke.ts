import { isCross, isCrossBox } from "./2d.js";

export function stretch(dp: number, sp: number, p: number, min: number, max: number): number {
	let p1;
	let p2;
	let p3;
	let p4;
	if (p < sp + 100) {
		p1 = min;
		p3 = min;
		p2 = sp + 100;
		p4 = dp + 100;
	} else {
		p1 = sp + 100;
		p3 = dp + 100;
		p2 = max;
		p4 = max;
	}
	return Math.floor(((p - p1) / (p2 - p1)) * (p4 - p3) + p3);
}

/** @internal */
export class Stroke {
	public readonly a1_100: number;
	public readonly a1_opt: number;

	public readonly a2_100: number;
	public readonly a2_opt: number;
	public readonly a2_opt_1: number;
	public readonly a2_opt_2: number;
	public readonly a2_opt_3: number;

	public readonly a3_100: number;
	public readonly a3_opt: number;
	public readonly a3_opt_1: number;
	public readonly a3_opt_2: number;

	public x1: number;
	public y1: number;
	public x2: number;
	public y2: number;
	public x3: number;
	public y3: number;
	public x4: number;
	public y4: number;

	constructor(data: number[]) {
		[
			this.a1_100,
			this.a2_100,
			this.a3_100,
			this.x1,
			this.y1,
			this.x2,
			this.y2,
			this.x3,
			this.y3,
			this.x4,
			this.y4,
		] = data;

		this.a1_opt = Math.floor(this.a1_100 / 100);
		this.a1_100 %= 100;

		this.a2_opt = Math.floor(this.a2_100 / 100);
		this.a2_100 %= 100;
		this.a2_opt_1 = this.a2_opt % 10;
		this.a2_opt_2 = Math.floor(this.a2_opt / 10) % 10;
		this.a2_opt_3 = Math.floor(this.a2_opt / 100);

		this.a3_opt = Math.floor(this.a3_100 / 100);
		this.a3_100 %= 100;
		this.a3_opt_1 = this.a3_opt % 10;
		this.a3_opt_2 = Math.floor(this.a3_opt / 10);
	}

	public getControlSegments(): [number, number, number, number][] {
		const res: [number, number, number, number][] = [];
		const a1 = this.a1_opt === 0
			? this.a1_100
			: 1; // ?????
		switch (a1) {
			case 0:
			case 8:
			case 9:
				break;
			case 6:
			case 7:
				res.unshift([this.x3, this.y3, this.x4, this.y4]);
			// falls through
			case 2:
			case 12:
			case 3:
			case 4:
				res.unshift([this.x2, this.y2, this.x3, this.y3]);
			// falls through
			default:
				res.unshift([this.x1, this.y1, this.x2, this.y2]);
		}
		return res;
	}

	public isCross(bx1: number, by1: number, bx2: number, by2: number): boolean {
		return this.getControlSegments().some(([x1, y1, x2, y2]) => (
			isCross(x1, y1, x2, y2, bx1, by1, bx2, by2)
		));
	}

	public isCrossBox(bx1: number, by1: number, bx2: number, by2: number): boolean {
		return this.getControlSegments().some(([x1, y1, x2, y2]) => (
			isCrossBox(x1, y1, x2, y2, bx1, by1, bx2, by2)
		));
	}

	public stretch(
		sx: number, sx2: number, sy: number, sy2: number,
		bminX: number, bmaxX: number, bminY: number, bmaxY: number): void {
		this.x1 = stretch(sx, sx2, this.x1, bminX, bmaxX);
		this.y1 = stretch(sy, sy2, this.y1, bminY, bmaxY);
		this.x2 = stretch(sx, sx2, this.x2, bminX, bmaxX);
		this.y2 = stretch(sy, sy2, this.y2, bminY, bmaxY);
		if (!(this.a1_100 === 99 && this.a1_opt === 0)) { // always true
			this.x3 = stretch(sx, sx2, this.x3, bminX, bmaxX);
			this.y3 = stretch(sy, sy2, this.y3, bminY, bmaxY);
			this.x4 = stretch(sx, sx2, this.x4, bminX, bmaxX);
			this.y4 = stretch(sy, sy2, this.y4, bminY, bmaxY);
		}
	}

	public getBox(): { minX: number, maxX: number, minY: number, maxY: number } {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		const a1 = this.a1_opt === 0
			? this.a1_100
			: 6; // ?????
		switch (a1) {
			default:
				minX = Math.min(minX, this.x4);
				maxX = Math.max(maxX, this.x4);
				minY = Math.min(minY, this.y4);
				maxY = Math.max(maxY, this.y4);
			// falls through
			case 2:
			case 3:
			case 4:
				minX = Math.min(minX, this.x3);
				maxX = Math.max(maxX, this.x3);
				minY = Math.min(minY, this.y3);
				maxY = Math.max(maxY, this.y3);
			// falls through
			case 1:
			case 99: // unnecessary?
				minX = Math.min(minX, this.x1, this.x2);
				maxX = Math.max(maxX, this.x1, this.x2);
				minY = Math.min(minY, this.y1, this.y2);
				maxY = Math.max(maxY, this.y1, this.y2);
			// falls through
			case 0:
		}
		return { minX, maxX, minY, maxY };
	}
}
