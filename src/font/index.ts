import { Polygons } from "../polygons.js";
import { Stroke } from "../stroke.js";
import Mincho from "./mincho/index.js";
import Gothic from "./gothic/index.js";
import { KShotai } from "./shotai.js";

export { KShotai } from "./shotai.js";

/** @internal */
export type StrokeDrawer = (polygons: Polygons) => void;

/** @internal */
export interface FontInterface {
	readonly shotai: KShotai;
	kUseCurve: boolean;
	setSize(size?: number): void;
	getDrawers(strokes: Stroke[]): StrokeDrawer[];
}

export { default as Mincho } from "./mincho/index.js";
export { default as Gothic } from "./gothic/index.js";

export type Font = Mincho | Gothic;

export function select(shotai: KShotai): Font {
	switch (shotai) {
		case KShotai.kMincho:
			return new Mincho();
		default:
			return new Gothic();
	}
}
