import { Buhin } from "./buhin.js";
import { Polygons } from "./polygons.js";
import { stretch, Stroke } from "./stroke.js";
import { KShotai, Font, select as selectFont } from "./font/index.js";

/**
 * The entry point for KAGE engine (Kanji-glyph Automatic Generating Engine).
 * It generates glyph outlines from a kanji's stroke data described in a dedicated
 * intermediate format called {@link https://glyphwiki.org/wiki/GlyphWiki:KAGE%e3%83%87%e3%83%bc%e3%82%bf%e4%bb%95%e6%a7%98 | KAGE data}.
 *
 * KAGE data may contain references to other glyphs (components), which are
 * resolved using a storage at its {@link kBuhin} property. The data for the
 * referenced glyphs must be registered to the storage prior to generating the outline.
 *
 * The font (mincho or gothic) can be changed with its {@link kShotai} property.
 * The font parameters (stroke width, etc.) can be configured with properties of
 * {@link kFont}.
 *
 * @see {@link Kage.makeGlyph}, {@link Kage.makeGlyph2}, {@link Kage.makeGlyph3} and
 *     {@link Kage.makeGlyphSeparated} for usage examples.
 */
export class Kage {
	/** An alias of Buhin constructor. */
	static readonly Buhin = Buhin;
	/** An alias of Polygons constructor. */
	static readonly Polygons = Polygons;

	/**
	 * An alias of {@link KShotai.kMincho}.
	 * @see {@link Kage.kShotai} for usage.
	 */
	public readonly kMincho = KShotai.kMincho;
	/**
	 * An alias of {@link KShotai.kGothic}.
	 * @see {@link Kage.kShotai} for usage.
	 */
	public readonly kGothic = KShotai.kGothic;

	/**
	 * Provides the way to configure parameters of the currently selected font.
	 * Its parameters are reset to the default values when {@link Kage.kShotai} is set.
	 * @example
	 * ```ts
	 * const kage = new Kage();
	 * kage.kFont.kRate = 50;
	 * kage.kFont.kWidth = 3;
	 * ```
	 */
	public kFont: Font = selectFont(KShotai.kMincho);

	// properties
	/**
	 * Gets or sets the font as {@link KShotai}. Setting this property resets all the
	 * font parameters in {@link Kage.kFont}. Defaults to {@link KShotai.kMincho}.
	 * @example
	 * ```ts
	 * const kage = new Kage();
	 * kage.kShotai = kage.kGothic;
	 * ```
	 */
	public get kShotai(): KShotai {
		return this.kFont.shotai;
	}
	public set kShotai(shotai: KShotai) {
		this.kFont = selectFont(shotai);
	}

	/**
	 * Whether to generate contours with off-curve points.
	 * An alias of {@link Kage.kFont}.kUseCurve.
	 */
	public get kUseCurve(): boolean {
		return this.kFont.kUseCurve;
	}
	public set kUseCurve(value: boolean) {
		this.kFont.kUseCurve = value;
	}

	/** A storage from which components are looked up. */
	public kBuhin: Buhin;

	// Probably this can be removed. Keeping here just in case someone is using it...
	/** @internal */
	readonly stretch = stretch;

	constructor(size?: number) {
		this.kFont.setSize(size);

		this.kBuhin = new Buhin();
	}
	// method
	/**
	 * Renders the glyph of the given name. Existing data in `polygons` (if any) are
	 * NOT cleared; new glyph is "overprinted".
	 * @example
	 * ```ts
	 * const kage = new Kage();
	 * kage.kBuhin.push("uXXXX", "1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
	 * const polygons = new Polygons();
	 * kage.makeGlyph(polygons, "uXXXX");
	 * const svg = polygons.generateSVG(); // now `svg` has the string of the rendered glyph
	 * ```
	 * @param polygons A {@link Polygons} instance on which the glyph is rendered.
	 * @param buhin The name of the glyph to be rendered.
	 */
	public makeGlyph(polygons: Polygons, buhin: string): void {
		const glyphData = this.kBuhin.search(buhin);
		this.makeGlyph2(polygons, glyphData);
	}

	/**
	 * Renders the glyph of the given KAGE data. Existing data in `polygons` (if any) are
	 * NOT cleared; new glyph is "overprinted".
	 * @example
	 * ```ts
	 * const kage = new Kage();
	 * const polygons = new Polygons();
	 * kage.makeGlyph2(polygons, "1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
	 * const svg = polygons.generateSVG(); // now `svg` has the string of the rendered glyph
	 * ```
	 * @param polygons A {@link Polygons} instance on which the glyph is rendered.
	 * @param data The KAGE data to be rendered (in which lines are delimited by `"$"`).
	 */
	public makeGlyph2(polygons: Polygons, data: string): void {
		if (data !== "") {
			const strokesArray = this.getEachStrokes(data);
			const drawers = this.kFont.getDrawers(strokesArray);
			for (const draw of drawers) {
				draw(polygons);
			}
		}
	}

	/**
	 * Renders each stroke of the given KAGE data on separate instances of
	 * {@link Polygons}.
	 * @example
	 * ```ts
	 * const kage = new Kage();
	 * const array = kage.makeGlyph3("1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
	 * console.log(array.length); // => 2
	 * console.log(array[0] instanceof Polygons); // => true
	 * ```
	 * @param data The KAGE data to be rendered (in which lines are delimited by `"$"`).
	 * @returns An array of {@link Polygons} instances holding the rendered data
	 *     of each stroke in the glyph.
	 */
	public makeGlyph3(data: string): Polygons[] {
		const result: Polygons[] = [];
		if (data !== "") {
			const strokesArray = this.getEachStrokes(data);
			const drawers = this.kFont.getDrawers(strokesArray);
			for (const draw of drawers) {
				const polygons = new Polygons();
				draw(polygons);
				result.push(polygons);
			}
		}
		return result;
	}

	/**
	 * Renders each KAGE data fragment in the given array on separate instances of
	 * {@link Polygons}, with stroke parameters adjusted as if all the fragments joined
	 * together compose a single glyph.
	 * @example
	 * ```ts
	 * const kage = new Kage();
	 * const array = kage.makeGlyphSeparated([
	 * 	"2:7:8:31:16:32:53:16:65",
	 * 	"1:2:2:32:31:176:31$2:22:7:176:31:170:43:156:63",
	 * ]);
	 * console.log(array.length); // => 2
	 * console.log(array[0] instanceof Polygons); // => true
	 * ```
	 * @param data An array of KAGE data fragments (in which lines are delimited by `"$"`)
	 *     to be rendered.
	 * @returns An array of {@link Polygons} instances holding the rendered data
	 *     of each KAGE data fragment.
	 */
	// Added by @kurgm
	public makeGlyphSeparated(data: readonly string[]): Polygons[] {
		const strokesArrays = data.map((subdata) => this.getEachStrokes(subdata));
		const drawers = this.kFont.getDrawers(
			strokesArrays.reduce((left, right) => left.concat(right), [])
		);
		const polygons = new Polygons();
		let strokeIndex = 0;
		return strokesArrays.map(({ length: strokeCount }) => {
			const startIndex = polygons.array.length;
			for (const draw of drawers.slice(strokeIndex, strokeIndex + strokeCount)) {
				draw(polygons);
			}
			strokeIndex += strokeCount;
			const result = new Polygons();
			result.array = polygons.array.slice(startIndex);
			return result;
		});
	}

	protected getEachStrokes(glyphData: string): Stroke[] {
		let strokesArray: Stroke[] = [];
		const strokes = glyphData.split("$");
		for (const stroke of strokes) {
			const columns = stroke.split(":");
			if (Math.floor(+columns[0]) !== 99) {
				strokesArray.push(new Stroke([
					Math.floor(+columns[0]),
					Math.floor(+columns[1]),
					Math.floor(+columns[2]),
					Math.floor(+columns[3]),
					Math.floor(+columns[4]),
					Math.floor(+columns[5]),
					Math.floor(+columns[6]),
					Math.floor(+columns[7]),
					Math.floor(+columns[8]),
					Math.floor(+columns[9]),
					Math.floor(+columns[10]),
				]));
			} else {
				const buhin = this.kBuhin.search(columns[7]);
				if (buhin !== "") {
					strokesArray = strokesArray.concat(this.getEachStrokesOfBuhin(
						buhin,
						Math.floor(+columns[3]), Math.floor(+columns[4]),
						Math.floor(+columns[5]), Math.floor(+columns[6]),
						Math.floor(+columns[1]), Math.floor(+columns[2]),
						Math.floor(+columns[9]), Math.floor(+columns[10])));
				}
			}
		}
		return strokesArray;
	}

	protected getEachStrokesOfBuhin(
		buhin: string,
		x1: number, y1: number,
		x2: number, y2: number,
		sx: number, sy: number,
		sx2: number, sy2: number): Stroke[] {
		const strokes = this.getEachStrokes(buhin);
		const box = this.getBox(strokes);
		if (sx !== 0 || sy !== 0) {
			if (sx > 100) {
				sx -= 200;
			} else {
				sx2 = 0;
				sy2 = 0;
			}
		}
		for (const stroke of strokes) {
			if (sx !== 0 || sy !== 0) {
				stroke.stretch(sx, sx2, sy, sy2, box.minX, box.maxX, box.minY, box.maxY);
			}
			stroke.x1 = x1 + stroke.x1 * (x2 - x1) / 200;
			stroke.y1 = y1 + stroke.y1 * (y2 - y1) / 200;
			stroke.x2 = x1 + stroke.x2 * (x2 - x1) / 200;
			stroke.y2 = y1 + stroke.y2 * (y2 - y1) / 200;
			stroke.x3 = x1 + stroke.x3 * (x2 - x1) / 200;
			stroke.y3 = y1 + stroke.y3 * (y2 - y1) / 200;
			stroke.x4 = x1 + stroke.x4 * (x2 - x1) / 200;
			stroke.y4 = y1 + stroke.y4 * (y2 - y1) / 200;
		}
		return strokes;
	}

	protected getBox(strokes: Stroke[]): { minX: number, maxX: number, minY: number, maxY: number } {
		let minX = 200;
		let minY = 200;
		let maxX = 0;
		let maxY = 0;

		for (const stroke of strokes) {
			const {
				minX: sminX,
				maxX: smaxX,
				minY: sminY,
				maxY: smaxY,
			} = stroke.getBox();
			minX = Math.min(minX, sminX);
			maxX = Math.max(maxX, smaxX);
			minY = Math.min(minY, sminY);
			maxY = Math.max(maxY, smaxY);
		}
		return { minX, maxX, minY, maxY };
	}
}
