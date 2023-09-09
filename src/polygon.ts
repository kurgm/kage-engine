/** Represents an element of {@link Polygon}. */
export interface Point {
	/** The x-coordinate of the point. */
	x: number;
	/** The y-coordinate of the point. */
	y: number;
	/**
	 * Whether the point is an off-curve point, i.e. a control point in a quadratic
	 * Bézier curve.
	 */
	off: boolean;
}

/**
 * The same as {@link Point} except that the `off` property is optional.
 * When `off` is omitted, it is treated as an on-curve point (`off: false`).
 * Used in the parameter type of {@link Polygon}'s constructor.
 */
export type PointOptOff = Omit<Point, "off"> & Partial<Pick<Point, "off">>;

/**
 * Represents a single contour of a rendered glyph.
 *
 * A contour that a Polygon represents is a closed curve made up of straight line
 * segments or quadratic Bézier curve segments. A Polygon is represented as a
 * series of {@link Point}'s, each of which is an on-curve point or an off-curve
 * point. Two consecutive on-curve points define a line segment. A sequence of
 * two on-curve points with an off-curve point in between defines a curve segment.
 * The last point and the first point of a Polygon define a line segment that closes
 * the loop (if the two points differ).
 */
export class Polygon {
	protected readonly _precision: number = 10;
	protected _array: Point[];

	/**
	 * A read-only array consisting of the points in this contour.
	 *
	 * Modifications to this array do NOT affect the contour;
	 * call {@link set} method to modify the contour.
	 *
	 * @example
	 * ```ts
	 * for (const point of polygon.array) {
	 * 	// ...
	 * }
	 * ```
	 *
	 * Note that the computation of coordinates of all the points is performed
	 * every time this property is accessed. To get a better performance, consider
	 * caching the result in a variable when you need to access the array repeatedly.
	 * ```ts
	 * // DO:
	 * const array = polygon.array;
	 * for (let i = 0; i < array.length; i++) {
	 * 	const point = array[i];
	 * 	// ...
	 * }
	 * 
	 * // DON'T:
	 * for (let i = 0; i < polygon.array.length; i++) {
	 * 	const point = polygon.array[i];
	 * 	// ...
	 * }
	 * ```
	 *
	 * @see {@link Polygon.length} is faster if you only need the length.
	 * @see {@link Polygon.get} is faster if you need just one element.
	 */
	public get array(): readonly Readonly<Point>[] {
		return this._array.map((_, i) => this.get(i));
	}
	/** The number of points in this contour. */
	// Added by @kurgm
	public get length(): number {
		return this._array.length;
	}
	/**
	 * Construct the `Polygon` object. If the argument `length` is given,
	 * constructed object has contour of size `length` whose members are all
	 * initialized to the origin point (0, 0). Otherwise the contour has
	 * no points.
	 * @param length The initial number of points in the contour.
	 */
	constructor(length?: number);
	/**
	 * Construct the `Polygon` object with the given points as its contour.
	 * @param points The points in the contour.
	 * @internal
	 */
	// Added by @kurgm
	constructor(points: readonly PointOptOff[]);

	constructor(param?: number | readonly PointOptOff[]) {
		// property
		this._array = [];
		// initialize
		if (param) {
			if (typeof param === "number") {
				for (let i = 0; i < param; i++) {
					this.push(0, 0, false);
				}
			} else {
				for (const { x, y, off } of param) {
					this.push(x, y, off);
				}
			}
		}
	}

	// method
	/**
	 * Appends a point at the end of its contour.
	 * @param x The x-coordinate of the appended point.
	 * @param y The y-coordiante of the appended point.
	 * @param off Whether the appended point is an off-curve point. Defaults to `false`.
	 */
	public push(x: number, y: number, off: boolean = false): void {
		this._array.push(this.createInternalPoint(x, y, off));
	}

	/**
	 * Appends a point at the end of its contour.
	 * @param point The appended point.
	 * @internal
	 */
	// Added by @kurgm
	public pushPoint(point: PointOptOff): void {
		this.push(point.x, point.y, point.off);
	}

	/**
	 * Mutates a point in its contour.
	 * @param index The index in the contour of the point to be mutated.
	 * @param x The new x-coordinate of the point.
	 * @param y The new y-coordinate of the point.
	 * @param off Whether the new point is an off-curve point. Defaults to `false`.
	 */
	public set(index: number, x: number, y: number, off: boolean = false): void {
		this._array[index] = this.createInternalPoint(x, y, off);
	}

	/**
	 * Mutates a point in its contour.
	 * @param index The index in the contour of the point to be mutated.
	 * @param point A point of the new coordinate values. Omitting `off` property makes
	 *     the point an on-curve point (as if `off: false` were specified).
	 * @internal
	 */
	// Added by @kurgm
	public setPoint(index: number, point: PointOptOff): void {
		this.set(index, point.x, point.y, point.off);
	}

	/**
	 * Retrieves a point in its contour. If the index is out of bounds,
	 * throws an error.
	 * @param index The index in the contour of the point to be retrieved.
	 * @returns A read-only point object. Modifications made to the returned
	 *     object do NOT affect the values of the point in the contour;
	 *     call {@link set} method to modify the contour.
	 * @example
	 * ```ts
	 * for (let i = 0; i < polygon.length; i++) {
	 * 	const point = polygon.get(i);
	 * 	// ...
	 * }
	 * ```
	 */
	// Added by @kurgm
	public get(index: number): Readonly<Point> {
		const { x, y, off } = this._array[index];
		if (this._precision === 0) {
			return { x, y, off };
		}
		return {
			x: x / this._precision,
			y: y / this._precision,
			off,
		};
	}

	/**
	 * Reverses the points in its contour.
	 */
	public reverse(): void {
		this._array.reverse();
	}

	/**
	 * Appends the points in the contour of another {@link Polygon} at the end of
	 * this contour. The other Polygon is not mutated.
	 * @param poly The other {@link Polygon} to be appended.
	 */
	public concat(poly: Polygon): void {
		if (this._precision !== poly._precision) {
			throw new TypeError("Cannot concat polygon's with different precisions");
		}
		this._array = this._array.concat(poly._array);
	}

	/**
	 * Removes the first point in its contour. If there are no points in the contour,
	 * nothing is performed.
	 */
	public shift(): void {
		this._array.shift();
	}

	/**
	 * Inserts a new point at the start of its contour.
	 * @param x The x-coordinate of the inserted point.
	 * @param y The y-coordiante of the inserted point.
	 * @param off Whether the inserted point is an off-curve point. Defaults to `false`.
	 */
	public unshift(x: number, y: number, off: boolean = false): void {
		this._array.unshift(this.createInternalPoint(x, y, off));
	}

	/**
	 * Creates a deep copy of this Polygon.
	 * @returns A new {@link Polygon} instance.
	 */
	// Added by @kurgm
	public clone(): Polygon {
		return new Polygon(this.array);
	}

	/**
	 * Iterates over its points.
	 * @returns An iterator of its {@link Point}s.
	 * @example
	 * ```ts
	 * for (const { x, y, off } of polygon) {
	 * 	// ...
	 * }
	 * ```
	 */
	// Added by @kurgm
	public [Symbol.iterator]: (this: this) => Iterator<Readonly<Point>>;
	static {
		if (typeof Symbol !== "undefined" && Symbol.iterator) {
			Polygon.prototype[Symbol.iterator] = function () {
				let i = 0;
				return {
					next: () => {
						if (i < this._array.length) {
							return {
								done: false,
								value: this.get(i++),
							};
						}
						return { done: true, value: undefined };
					},
				};
			};
		}
	}

	protected createInternalPoint(x: number, y: number, off: boolean = false): Point {
		if (this._precision === 0) {
			return { x, y, off };
		}
		return {
			x: x * this._precision,
			y: y * this._precision,
			off,
		};
	}

	/**
	 * Translates the whole polygon by the given amount.
	 * @param dx The x-amount of translation.
	 * @param dy The y-amount of translation.
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public translate(dx: number, dy: number): this {
		if (this._precision !== 0) {
			dx *= this._precision;
			dy *= this._precision;
		}
		for (const point of this._array) {
			point.x += dx;
			point.y += dy;
		}
		return this;
	}

	/**
	 * Flips the sign of the x-coordinate of each point in the contour.
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public reflectX(): this {
		for (const point of this._array) {
			point.x *= -1;
		}
		return this;
	}

	/**
	 * Flips the sign of the y-coordinate of each point in the contour.
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public reflectY(): this {
		for (const point of this._array) {
			point.y *= -1;
		}
		return this;
	}

	/**
	 * Rotates the whole polygon by 90 degrees clockwise.
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public rotate90(): this {
		for (const point of this._array) {
			const { x, y } = point;
			point.x = -y;
			point.y = x;
		}
		return this;
	}

	/**
	 * Rotates the whole polygon by 180 degrees.
	 * {@link scale}(-1).
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public rotate180(): this {
		for (const point of this._array) {
			point.x *= -1;
			point.y *= -1;
		}
		return this;
	}

	/**
	 * Rotates the whole polygon by 270 degrees clockwise.
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public rotate270(): this {
		for (const point of this._array) {
			const { x, y } = point;
			point.x = y;
			point.y = -x;
		}
		return this;
	}

	/**
	 * @returns This object (for chaining).
	 * @internal
	 */
	// Added by @kurgm
	public floor(): this {
		if (this._precision === 0) {
			return this;
		}
		for (const point of this._array) {
			const { x, y } = point;
			point.x = Math.floor(x);
			point.y = Math.floor(y);
		}
		return this;
	}
}
