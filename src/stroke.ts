export function stretch(dp: number, sp: number, p: number, min: number, max: number) {
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

export class Stroke {
	public a1: number;
	public a2: number;
	public a3: number;
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
			this.a1,
			this.a2,
			this.a3,
			this.x1,
			this.y1,
			this.x2,
			this.y2,
			this.x3,
			this.y3,
			this.x4,
			this.y4,
		] = data;
	}

	public getControlSegments() {
		const res: Array<[number, number, number, number]> = [];
		switch (this.a1) {
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
				res.unshift([this.x2, this.y2, this.x3, this.y3]);
			// falls through
			default:
				res.unshift([this.x1, this.y1, this.x2, this.y2]);
		}
		return res;
	}

	public stretch(
		sx: number, sx2: number, sy: number, sy2: number,
		bminX: number, bmaxX: number, bminY: number, bmaxY: number) {
		this.x1 = stretch(sx, sx2, this.x1, bminX, bmaxX);
		this.y1 = stretch(sy, sy2, this.y1, bminY, bmaxY);
		this.x2 = stretch(sx, sx2, this.x2, bminX, bmaxX);
		this.y2 = stretch(sy, sy2, this.y2, bminY, bmaxY);
		if (this.a1 !== 99) {
			this.x3 = stretch(sx, sx2, this.x3, bminX, bmaxX);
			this.y3 = stretch(sy, sy2, this.y3, bminY, bmaxY);
			this.x4 = stretch(sx, sx2, this.x4, bminX, bmaxX);
			this.y4 = stretch(sy, sy2, this.y4, bminY, bmaxY);
		}
	}

	public getBox() {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		switch (this.a1) {
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