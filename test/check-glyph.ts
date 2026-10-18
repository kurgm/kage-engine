import assert from "node:assert";
import { suite, test } from "node:test";

import { type BuhinMissingHandler, Kage } from "../src/index.ts";

const STROKE = "1:0:0:10:10:190:10";

function ref(name: string) {
	return `99:0:0:0:0:200:200:${name}`;
}

await suite("Kage#checkGlyph", async () => {
	await test("A glyph without references is ok.", () => {
		const kage = new Kage();
		kage.kBuhin.push("a", STROKE);
		assert.strictEqual(kage.checkGlyph("a"), "ok");
	});

	await test("A glyph whose components all exist is ok.", () => {
		const kage = new Kage();
		kage.kBuhin.push("a", `${ref("b")}$${STROKE}`);
		kage.kBuhin.push("b", ref("c"));
		kage.kBuhin.push("c", STROKE);
		assert.strictEqual(kage.checkGlyph("a"), "ok");
	});

	await test("A component referenced more than once is not mistaken for a loop.", () => {
		const kage = new Kage();
		// a -> b -> d, a -> c -> d, a -> d
		kage.kBuhin.push("a", `${ref("b")}$${ref("c")}$${ref("d")}`);
		kage.kBuhin.push("b", ref("d"));
		kage.kBuhin.push("c", ref("d"));
		kage.kBuhin.push("d", STROKE);
		assert.strictEqual(kage.checkGlyph("a"), "ok");
	});

	await test("A missing glyph is notFound.", () => {
		const kage = new Kage();
		assert.strictEqual(kage.checkGlyph("a"), "notFound");
	});

	await test("A missing component, however deep, is notFound.", () => {
		const kage = new Kage();
		kage.kBuhin.push("a", ref("b"));
		kage.kBuhin.push("b", `${STROKE}$${ref("c")}`);
		assert.strictEqual(kage.checkGlyph("a"), "notFound");
	});

	await test("A glyph registered with empty data is notFound.", () => {
		const kage = new Kage();
		kage.kBuhin.push("a", ref("b"));
		kage.kBuhin.push("b", "");
		assert.strictEqual(kage.checkGlyph("a"), "notFound");
	});

	await test("A self reference is a loop.", () => {
		const kage = new Kage();
		kage.kBuhin.push("a", `${STROKE}$${ref("a")}`);
		assert.strictEqual(kage.checkGlyph("a"), "loop");
	});

	await test("An indirect cycle is a loop, including one not through the root.", () => {
		const kage = new Kage();
		kage.kBuhin.push("a", ref("b"));
		kage.kBuhin.push("b", ref("a"));
		assert.strictEqual(kage.checkGlyph("a"), "loop");

		// root -> x -> y -> z -> x
		kage.kBuhin.push("root", ref("x"));
		kage.kBuhin.push("x", ref("y"));
		kage.kBuhin.push("y", ref("z"));
		kage.kBuhin.push("z", `${STROKE}$${ref("x")}`);
		assert.strictEqual(kage.checkGlyph("root"), "loop");
	});

	await test("The first problem in depth-first order is reported.", () => {
		const kage = new Kage();
		kage.kBuhin.push("loop", ref("loop"));
		kage.kBuhin.push("missingFirst", `${ref("missing")}$${ref("loop")}`);
		kage.kBuhin.push("loopFirst", `${ref("loop")}$${ref("missing")}`);
		assert.strictEqual(kage.checkGlyph("missingFirst"), "notFound");
		assert.strictEqual(kage.checkGlyph("loopFirst"), "loop");
	});

	await test("Results do not leak between calls.", () => {
		const kage = new Kage();
		kage.kBuhin.push("a", ref("a"));
		kage.kBuhin.push("b", STROKE);
		assert.strictEqual(kage.checkGlyph("a"), "loop");
		assert.strictEqual(kage.checkGlyph("b"), "ok");
		assert.strictEqual(kage.checkGlyph("a"), "loop");
	});

	await test("Components supplied by Buhin#onMissing are followed.", () => {
		const kage = new Kage();
		const lazy: Record<string, string> = { b: ref("c"), c: STROKE };
		const asked: string[] = [];
		const onMissing: BuhinMissingHandler = (name) => {
			asked.push(name);
			return lazy[name];
		};
		kage.kBuhin.onMissing = onMissing;
		kage.kBuhin.push("a", ref("b"));
		assert.strictEqual(kage.checkGlyph("a"), "ok");
		assert.deepStrictEqual(asked, ["b", "c"]);

		kage.kBuhin.push("d", ref("e"));
		assert.strictEqual(kage.checkGlyph("d"), "notFound");
	});

	await test("Glyphs that pass the check render without throwing.", () => {
		const kage = new Kage();
		kage.kBuhin.push("a", `${ref("b")}$${ref("b")}`);
		kage.kBuhin.push("b", STROKE);
		assert.strictEqual(kage.checkGlyph("a"), "ok");
		assert.strictEqual(kage.makeGlyph3(kage.kBuhin.search("a")).length, 2);
	});
});

await suite("Kage#checkGlyph2", async () => {
	await test("Empty data is ok.", () => {
		const kage = new Kage();
		assert.strictEqual(kage.checkGlyph2(""), "ok");
	});

	await test("Data is checked the same way as a named glyph.", () => {
		const kage = new Kage();
		kage.kBuhin.push("b", STROKE);
		kage.kBuhin.push("loop", ref("loop"));
		assert.strictEqual(kage.checkGlyph2(`${STROKE}$${ref("b")}`), "ok");
		assert.strictEqual(kage.checkGlyph2(ref("missing")), "notFound");
		assert.strictEqual(kage.checkGlyph2(ref("loop")), "loop");
	});
});
