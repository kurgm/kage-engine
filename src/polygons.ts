import { Polygon } from "./polygon.js";

/**
 * Represents a rendered glyph.
 *
 * A glyph is represented as a series of {@link Polygon} instances.
 * The contained {@link Polygon}'s can be accessed by the {@link array} property.
 */
export class Polygons {
	/**
	 * Stores the rendered glyph as an array of {@link Polygon} instances.
	 * @example
	 * ```ts
	 * const polygons = new Polygons();
	 * kage.makeGlyph(polygons, someGlyphName);
	 * for (const poly of polygons.array) {
	 * 	let first = true;
	 * 	for (const { x, y } of poly.array) {
	 * 		if (first) ctx.moveTo(x, y);
	 * 		else ctx.lineTo(x, y);
	 * 		first = false;
	 * 	}
	 * 	ctx.closePath();
	 * }
	 * ```
	 */
	public array: Polygon[];

	constructor() {
		// property
		this.array = [];
	}
	// method
	/** Clears the content. */
	public clear(): void {
		this.array = [];
	}

	/**
	 * Appends a new {@link Polygon} to the end of the array.
	 * Does nothing if `polygon` is not a valid polygon.
	 * @param polygon - A {@link Polygon} instance to be appended.
	 */
	public push(polygon: Polygon): void {
		// only a simple check
		let minx = 200;
		let maxx = 0;
		let miny = 200;
		let maxy = 0;
		if (polygon.length < 3) {
			return;
		}
		polygon.floor();
		for (const { x, y } of polygon.array) {
			if (x < minx) {
				minx = x;
			}
			if (x > maxx) {
				maxx = x;
			}
			if (y < miny) {
				miny = y;
			}
			if (y > maxy) {
				maxy = y;
			}
			if (isNaN(x) || isNaN(y)) {
				return;
			}
		}
		if (minx !== maxx && miny !== maxy) {
			this.array.push(polygon);
		}
	}

	/**
	 * Generates a string in SVG format that represents the rendered glyph.
	 * @param curve - Set to true to use the `<path />` format, or set to false to
	 * use the `<polygon />` format. Must be set to true if the glyph was rendered
	 * with `kage.kFont.kUseCurve = true`. Defaults to false (the `<polygon />` format
	 * is used).
	 * @returns The string representation of the rendered glyph in SVG format.
	 */
	public generateSVG(curve?: boolean): string {
		let buffer = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
			+ 'version="1.1" baseProfile="full" viewBox="0 0 200 200" width="200" height="200">\n';
		if (curve) {
			for (const { array } of this.array) {
				let mode = "L";
				buffer += '<path d="';
				for (let j = 0; j < array.length; j++) {
					if (j === 0) {
						buffer += "M ";
					} else if (array[j].off) {
						buffer += "Q ";
						mode = "Q";
					} else if (mode === "Q" && !array[j - 1].off) {
						buffer += "L ";
					} else if (mode === "L" && j === 1) {
						buffer += "L ";
					}
					buffer += `${array[j].x},${array[j].y} `;
				}
				buffer += 'Z" fill="black" />\n';
			}
		} else {
			buffer += '<g fill="black">\n';
			buffer += this.array.map(({ array }) => `<polygon points="${
				array.map(({ x, y }) => `${x},${y} `).join("")
			}" />\n`).join("");
			buffer += "</g>\n";
		}
		buffer += "</svg>\n";
		return buffer;
	}

	/**
	 * Generates a string in EPS format that represents the rendered glyph.
	 * @returns The string representation of the rendered glyph in EPS format.
	 */
	public generateEPS(): string {
		let buffer = "";
		buffer += `\
%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 -208 1024 816
%%Pages: 0
%%Title: Kanji glyph
%%Creator: GlyphWiki powered by KAGE system
%%CreationDate: ${new Date().toString()}
%%EndComments
%%EndProlog
`;
		for (const { array } of this.array) {
			for (let j = 0; j < array.length; j++) {
				buffer += `${array[j].x * 5} ${1000 - array[j].y * 5 - 200} `;
				if (j === 0) {
					buffer += "newpath\nmoveto\n";
				} else {
					buffer += "lineto\n";
				}
			}
			buffer += "closepath\nfill\n";
		}
		buffer += "%%EOF\n";
		return buffer;
	}

	/**
	 * Iterates over its contours.
	 * @returns An iterator of its {@link Polygon} elements.
	 * @example
	 * ```ts
	 * for (const polygon of polygons) {
	 * 	// ...
	 * }
	 * ```
	 */
	// Added by @kurgm
	public [Symbol.iterator]: (this: this) => Iterator<Polygon>;
	static {
		if (typeof Symbol !== "undefined" && Symbol.iterator) {
			Polygons.prototype[Symbol.iterator] = function () {
				return this.array[Symbol.iterator]();
			};
		}
	}
}
