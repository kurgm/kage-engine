import { Point, PointOptOff, Polygon } from "./polygon.js";
import { normalize } from "./util.js";

/**
 * Calculates global coordinates from local coordinates around a pen
 * using its position and direction.
 * @internal
 */
export class Pen {
	protected x: number;
	protected y: number;
	protected cos_theta = 1;
	protected sin_theta = 0;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	setMatrix2(cos_theta: number, sin_theta: number): this {
		this.cos_theta = cos_theta;
		this.sin_theta = sin_theta;
		return this;
	}

	setLeft(otherX: number, otherY: number): this {
		const [dx, dy] = normalize([otherX - this.x, otherY - this.y]);
		// Given: rotate(theta)((-1, 0)) = (dx, dy)
		// Determine: (cos theta, sin theta) = rotate(theta)((1, 0))
		// = (-dx, -dy)
		this.setMatrix2(-dx, -dy);
		return this;
	}
	setRight(otherX: number, otherY: number): this {
		const [dx, dy] = normalize([otherX - this.x, otherY - this.y]);
		this.setMatrix2(dx, dy);
		return this;
	}
	setUp(otherX: number, otherY: number): this {
		const [dx, dy] = normalize([otherX - this.x, otherY - this.y]);
		// Given: rotate(theta)((0, -1)) = (dx, dy)
		// Determine: (cos theta, sin theta) = rotate(theta)((1, 0))
		// = (-dy, dx)
		this.setMatrix2(-dy, dx);
		return this;
	}
	setDown(otherX: number, otherY: number): this {
		const [dx, dy] = normalize([otherX - this.x, otherY - this.y]);
		this.setMatrix2(dy, -dx);
		return this;
	}

	move(localDx: number, localDy: number): this {
		({ x: this.x, y: this.y } = this.getPoint(localDx, localDy));
		return this;
	}

	getPoint(localX: number, localY: number, off?: boolean): Point {
		return {
			x: this.x + this.cos_theta * localX + -this.sin_theta * localY,
			y: this.y + this.sin_theta * localX + this.cos_theta * localY,
			off,
		};
	}
	getPolygon(localPoints: readonly PointOptOff[]): Polygon {
		return new Polygon(localPoints.map(({ x, y, off }) => this.getPoint(x, y, off)));
	}
}
