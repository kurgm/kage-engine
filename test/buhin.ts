import assert from "node:assert";
import { mock, suite, test } from "node:test";

import { Buhin, type BuhinMissingHandler, Kage, Polygons } from "../src/index.ts";

await suite("Buhin#onMissing", async () => {
	await test("Default behavior: missing names return an empty string without invoking any callback.", () => {
		const b = new Buhin();
		b.push("foo", "1:0:0:10:10:20:20");

		// search returns registered data
		assert.strictEqual(b.search("foo"), "1:0:0:10:10:20:20");
		// search returns an empty string for missing names by default
		assert.strictEqual(b.search("bar"), "");
		// onMissing defaults to null
		assert.strictEqual(b.onMissing, null);
	});

	await test("onMissing fires for missing names and is not invoked for registered ones.", () => {
		const b = new Buhin();
		b.push("foo", "1:0:0:10:10:20:20");
		const onMissing = mock.fn<BuhinMissingHandler>(() => undefined);
		b.onMissing = onMissing;

		// registered name skips onMissing
		assert.strictEqual(b.search("foo"), "1:0:0:10:10:20:20");
		// onMissing not called for present name
		assert.strictEqual(onMissing.mock.callCount(), 0);

		// missing name still returns an empty string when handler returns undefined
		assert.strictEqual(b.search("bar"), "");
		// onMissing called with the missing name
		assert.strictEqual(onMissing.mock.callCount(), 1);
		assert.deepStrictEqual(onMissing.mock.calls[0].arguments, ["bar"]);
	});

	await test("onMissing returning a string is used as the lookup result.", () => {
		const b = new Buhin();
		b.onMissing = () => "1:0:0:0:0:200:200";

		// string return overrides default
		assert.strictEqual(b.search("anything"), "1:0:0:0:0:200:200");
	});

	await test("onMissing throwing propagates to the caller (fail-fast pattern).", () => {
		const b = new Buhin();
		b.onMissing = (name) => {
			throw new Error(`missing: ${name}`);
		};

		// throw propagates from onMissing
		assert.throws(
			() => {
				b.search("bar");
			},
			{ message: /missing: bar/ }
		);
	});

	await test("onMissing is consulted only when the name is genuinely absent — even if the stored value is the empty string, the registered entry takes precedence.", () => {
		const b = new Buhin();
		b.set("empty", "");
		const onMissing = mock.fn<BuhinMissingHandler>(() => "fallback");
		b.onMissing = onMissing;

		// stored empty string is returned without invoking onMissing
		assert.strictEqual(b.search("empty"), "");
		// onMissing not called when name is registered
		assert.strictEqual(onMissing.mock.callCount(), 0);
	});

	await test("End-to-end: a missing 99: target surfaces through onMissing during makeGlyph.", () => {
		const kage = new Kage();
		const onMissing = mock.fn<BuhinMissingHandler>(() => undefined);
		kage.kBuhin.onMissing = onMissing;
		// Reference an unregistered buhin from a 99: stroke.
		kage.kBuhin.push("dummy", "99:0:0:0:0:200:200:not-registered");

		const polygons = new Polygons();
		kage.makeGlyph(polygons, "dummy");

		// onMissing surfaces missing 99: targets during makeGlyph
		assert.strictEqual(onMissing.mock.callCount(), 1);
		assert.deepStrictEqual(onMissing.mock.calls[0].arguments, ["not-registered"]);
	});
});
