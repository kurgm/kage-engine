import type { Polygons } from "../polygons.ts";
import type { Stroke } from "../stroke.ts";
import Mincho from "./mincho/index.ts";
import Gothic from "./gothic/index.ts";
import { KShotai } from "./shotai.ts";

export { KShotai } from "./shotai.ts";

/** @internal */
export type StrokeDrawer = (polygons: Polygons) => void;

/** @internal */
export interface FontInterface {
	readonly shotai: KShotai;
	kUseCurve: boolean;
	setSize(size?: number): void;
	getDrawers(strokes: Stroke[]): StrokeDrawer[];
}

export { default as Mincho } from "./mincho/index.ts";
export { default as Gothic } from "./gothic/index.ts";

export type Font = Mincho | Gothic;

export function select(shotai: KShotai): Font {
	switch (shotai) {
		case KShotai.kMincho:
			return new Mincho();
		default:
			return new Gothic();
	}
}
