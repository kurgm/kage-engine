import assert from "node:assert";
import { suite, test } from "node:test";

import { Kage, type Point, Polygons } from "../src/index.ts";

function signedAreaOfPoints(pts: readonly Readonly<Point>[]) {
	let s = 0;
	const n = pts.length;
	for (let i = 0; i < n; i++) {
		const a = pts[i];
		const b = pts[(i + 1) % n];
		s += (b.x - a.x) * (b.y + a.y);
	}
	return s;
}

await suite("Polygons#normalizeWinding", async () => {
	await test("Empty / degenerate polygons are accepted without error.", () => {
		const polygons = new Polygons();
		polygons.normalizeWinding();
		// empty Polygons stays empty
		assert.strictEqual(polygons.array.length, 0);
	});

	await test("Render a glyph that produces multiple polygons with mixed winding, then verify that normalizeWinding leaves them all with the same orientation.", () => {
		const kage = new Kage();
		const polygons = new Polygons();
		// 龍 — many overlapping strokes; mixed winding is observed in output.
		kage.kBuhin.push("u9f8d", "1:0:2:26:32:158:32$2:22:7:158:32:133:54:100:78$1:0:4:100:74:100:181");
		kage.makeGlyph(polygons, "u9f8d");
		// the test glyph produces at least one polygon
		assert(polygons.array.length > 0);

		// Default direction: cw.
		polygons.normalizeWinding();

		for (const poly of polygons.array) {
			const area = signedAreaOfPoints(poly.array);
			// Empty / collinear polygons with area === 0 are allowed (untouched).
			assert(area >= 0, `cw normalization keeps area >= 0 (got ${area})`);
		}

		// Switch to ccw and verify all polygons flip.
		polygons.normalizeWinding("ccw");

		for (const poly of polygons.array) {
			const area = signedAreaOfPoints(poly.array);
			assert(area <= 0, `ccw normalization keeps area <= 0 (got ${area})`);
		}
	});

	await test("Idempotency: applying normalizeWinding twice yields the same result as once.", () => {
		const kage = new Kage();
		const polygons1 = new Polygons();
		const polygons2 = new Polygons();
		kage.kBuhin.push("u9f8d", "1:0:2:26:32:158:32$2:22:7:158:32:133:54:100:78$1:0:4:100:74:100:181");
		kage.makeGlyph(polygons1, "u9f8d");
		kage.makeGlyph(polygons2, "u9f8d");

		polygons1.normalizeWinding("cw");
		polygons2.normalizeWinding("cw");
		polygons2.normalizeWinding("cw");

		// same polygon count
		assert.strictEqual(polygons1.array.length, polygons2.array.length);
		for (let i = 0; i < polygons1.array.length; i++) {
			const a1 = polygons1.array[i].array;
			const a2 = polygons2.array[i].array;
			assert.deepStrictEqual(a1, a2);
		}
	});
});
