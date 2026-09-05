/**
 * Stroke rendering regression test.
 *
 * `test/sample.ts` checks three hand-written glyphs against inlined polygon
 * coordinates. That is precise but narrow: it exercises 10 distinct
 * (stroke type, head type, tail type) combinations, all in mincho with
 * `kUseCurve` off, and never renders gothic at all.
 *
 * This file complements it with breadth rather than precision. It renders a
 * deterministic matrix of stroke type x head type x tail type x geometry,
 * in both shotai, and compares a compact fingerprint of each result against
 * a committed golden file. It is meant to catch *unintended* output changes
 * during refactoring — the failure mode that has historically produced
 * "corrupted gothic output" and "missing hook" bugs in this engine.
 *
 * The fingerprint is (polygon count, point count, sha1 of the rounded
 * coordinates). It does not tell you whether a glyph looks right — only
 * whether it still looks like it did before. Judging correctness is still a
 * visual job.
 *
 * Usage:
 *   node --test test/strokes.ts                         verify against the golden file
 *   node --test --test-update-snapshots test/strokes.ts rewrite the golden file
 *
 * When output changes on purpose, regenerate and *review the diff*: every
 * changed line is a stroke whose shape moved. An unexpectedly large diff
 * means the change was broader than intended.
 */

import { createHash } from "node:crypto";
import path from "node:path";
import test from "node:test";

import { Kage, Polygons, KShotai } from "../src/index.ts";

// ─── Corpus ────────────────────────────────────────────────────────────────
// Everything here is a fixed literal: the corpus must be identical on every
// run and every machine, or the golden file is meaningless.

/** Stroke types that draw an actual stroke. */
const STROKE_TYPES = [1, 2, 3, 4, 6, 7] as const;

/** Head shape base codes (`a2 % 100`). */
const HEAD_TYPES = [0, 1, 2, 6, 7, 12, 22, 27, 32];

/** Tail shape base codes (`a3 % 100`). */
const TAIL_TYPES = [0, 1, 2, 4, 5, 7, 8, 13, 14, 15, 23, 24, 32, 313, 413];

/**
 * Control point sets, as [x1,y1,x2,y2,x3,y3,x4,y4]. Each stroke type uses
 * the prefix it needs. `rl` runs right-to-left and upwards on purpose: the
 * engine's README lists several head/tail shapes that are known to behave
 * oddly when a stroke points that way, so those paths need pinning down too.
 */
const GEOMETRIES = {
	h: [20, 50, 80, 50, 140, 50, 180, 50],
	v: [50, 20, 50, 80, 50, 140, 50, 180],
	d: [30, 30, 70, 80, 120, 130, 170, 175],
	rl: [180, 150, 120, 120, 70, 80, 20, 30],
};

/** How many control point pairs each stroke type consumes. */
const POINT_COUNT = { 1: 2, 2: 3, 3: 3, 4: 3, 6: 4, 7: 4 };

/** Whole-glyph cases: these exercise buhin expansion and the mincho adjust* pass. */
const GLYPH_CASES = [
	{
		id: "glyph:u6f22",
		buhin: {
			"u6f22": "99:150:0:9:12:73:200:u6c35-07:0:-10:50$99:0:0:54:10:190:199:u26c29-07",
			"u6c35-07": "2:7:8:42:12:99:23:124:35$2:7:8:20:62:75:71:97:85$2:7:8:12:123:90:151:81:188$2:2:7:63:144:109:118:188:51",
			"u26c29-07": "1:0:0:18:29:187:29$1:0:0:73:10:73:48$1:0:0:132:10:132:48$1:12:13:44:59:44:87$1:2:2:44:59:163:59$1:22:23:163:59:163:87$1:2:2:44:87:163:87$1:0:0:32:116:176:116$1:0:0:21:137:190:137$7:32:7:102:59:102:123:102:176:10:190$2:7:0:105:137:126:169:181:182",
		},
		name: "u6f22",
	},
	{
		// Nested buhin with stretch parameters (sx > 100, the two-segment mode).
		id: "glyph:stretch",
		buhin: {
			outer: "99:150:0:10:10:190:190:inner:0:-10:50",
			inner: "1:0:2:20:40:180:40$1:12:13:40:40:40:160$2:7:8:60:60:120:100:160:160",
		},
		name: "outer",
	},
	{
		// Transform ops (0:97/98/99) applied to already-drawn polygons.
		id: "glyph:transform",
		buhin: {
			t97: "1:0:2:20:40:180:40$1:12:13:40:40:40:160$0:97:0:0:0:200:200",
			t98: "1:0:2:20:40:180:40$1:12:13:40:40:40:160$0:98:0:0:0:200:200",
			r90: "1:0:2:20:40:180:40$1:12:13:40:40:40:160$0:99:1:0:0:200:200",
			r180: "1:0:2:20:40:180:40$1:12:13:40:40:40:160$0:99:2:0:0:200:200",
			r270: "1:0:2:20:40:180:40$1:12:13:40:40:40:160$0:99:3:0:0:200:200",
		},
		names: ["t97", "t98", "r90", "r180", "r270"],
	},
];

/**
 * Builds the full list of cases. Each case is
 * `{ id, data, shotai, useCurve }` where `data` is a KAGE data string.
 */
function buildCorpus() {
	const cases = [];
	for (const shotai of [KShotai.kMincho, KShotai.kGothic]) {
		const sName = shotai === KShotai.kMincho ? "m" : "g";
		for (const type of STROKE_TYPES) {
			for (const [gName, coords] of Object.entries(GEOMETRIES)) {
				const points = coords.slice(0, POINT_COUNT[type] * 2).join(":");
				for (const head of HEAD_TYPES) {
					for (const tail of TAIL_TYPES) {
						const data = `${type}:${head}:${tail}:${points}`;
						cases.push({
							id: `${sName}:${type}:${head}:${tail}:${gName}`,
							data,
							shotai,
							useCurve: false,
						});
					}
				}
			}
		}
		// kUseCurve fits the stroke body with bezier curves instead of a
		// polyline. It is a separate code path in cdDrawCurveU and is not
		// covered by test/sample.ts at all, so sample the curve-bearing
		// stroke types with it on.
		for (const type of [2, 4, 6, 7] as const) {
			for (const [gName, coords] of Object.entries(GEOMETRIES)) {
				const points = coords.slice(0, POINT_COUNT[type] * 2).join(":");
				for (const head of [0, 7, 12, 22, 32]) {
					for (const tail of [0, 2, 4, 7, 8, 13, 23]) {
						cases.push({
							id: `${sName}c:${type}:${head}:${tail}:${gName}`,
							data: `${type}:${head}:${tail}:${points}`,
							shotai,
							useCurve: true,
						});
					}
				}
			}
		}
	}
	return cases;
}

// ─── Rendering ─────────────────────────────────────────────────────────────

/**
 * Renders one case and returns its fingerprint: `<polygons> <points> <sha1>`,
 * or `ERROR <message>` if the engine threw.
 *
 * Errors are recorded rather than rethrown on purpose. Some head/tail
 * combinations in the matrix are not meaningful for their stroke type, and
 * what matters is that the engine's response to them stays the same — a
 * combination that starts or stops throwing is exactly the kind of silent
 * behavior change this test exists to catch.
 */
function fingerprint(render: () => Polygons) {
	let polygons;
	try {
		polygons = render();
	} catch (e) {
		return `ERROR ${(e as { message?: string } | null | undefined)?.message ?? String(e)}`;
	}
	const hash = createHash("sha1");
	let pointCount = 0;
	for (const poly of polygons.array) {
		hash.update("|");
		for (const p of poly.array) {
			hash.update(`${p.x},${p.y},${p.off ? 1 : 0};`);
			pointCount++;
			if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) {
				return `ERROR non-finite coordinate (${p.x}, ${p.y})`;
			}
		}
	}
	return `${polygons.array.length} ${pointCount} ${hash.digest("hex")}`;
}

function renderAll() {
	const results = new Map<string, string>();

	for (const c of buildCorpus()) {
		results.set(c.id, fingerprint(() => {
			const kage = new Kage();
			kage.kShotai = c.shotai;
			kage.kUseCurve = c.useCurve;
			const polygons = new Polygons();
			kage.makeGlyph2(polygons, c.data);
			return polygons;
		}));
	}

	for (const g of GLYPH_CASES) {
		for (const shotai of [KShotai.kMincho, KShotai.kGothic]) {
			const sName = shotai === KShotai.kMincho ? "m" : "g";
			for (const name of g.names ?? [g.name]) {
				results.set(`${g.id}:${name}:${sName}`, fingerprint(() => {
					const kage = new Kage();
					kage.kShotai = shotai;
					for (const [k, v] of Object.entries(g.buhin)) {
						kage.kBuhin.push(k, v);
					}
					const polygons = new Polygons();
					kage.makeGlyph(polygons, name);
					return polygons;
				}));
			}
		}
	}

	return results;
}

// ─── Golden file ───────────────────────────────────────────────────────────

function serialize(results: Map<string, string>) {
	const lines = ["# generated by test/strokes.js — regenerate with --test-update-snapshots"];
	for (const [id, fp] of results) {
		lines.push(`${id}\t${fp}`);
	}
	return `${lines.join("\n")}\n`;
}

// ─── Main ──────────────────────────────────────────────────────────────────

await test("stroke rendering", (t) => {
	const results = renderAll();

	t.assert.fileSnapshot(
		results,
		path.join(import.meta.dirname, "strokes-golden.tsv"),
		{
			serializers: [serialize],
		},
	);

	// Report how much of the matrix the engine actually draws, so that a
	// refactor that silently turns strokes into no-ops is visible here too.
	let errors = 0;
	let empty = 0;
	for (const fp of results.values()) {
		if (fp.startsWith("ERROR")) {
			errors++;
		} else if (fp.startsWith("0 ")) {
			empty++;
		}
	}
	console.log(`stroke rendering: ok (${results.size} cases, ${errors} throwing, ${empty} drawing nothing — all unchanged)`);
});
