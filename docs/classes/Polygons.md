[**@kurgm/kage-engine**](../README.md)

***

[@kurgm/kage-engine](../README.md) / Polygons

# Class: Polygons

Defined in: [polygons.ts:19](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L19)

Represents a rendered glyph.

A glyph is represented as a series of [Polygon](../interfaces/Polygon.md) instances.
The contained [Polygon](../interfaces/Polygon.md)'s can be accessed by the [array](#array) property.

## Constructors

### Constructor

> **new Polygons**(): `Polygons`

Defined in: [polygons.ts:39](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L39)

#### Returns

`Polygons`

## Properties

### \[iterator\]

> **\[iterator\]**: (`this`) => `Iterator`\<[`Polygon`](../interfaces/Polygon.md)\>

Defined in: [polygons.ts:216](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L216)

Iterates over its contours.

#### Parameters

##### this

`this`

#### Returns

`Iterator`\<[`Polygon`](../interfaces/Polygon.md)\>

An iterator of its [Polygon](../interfaces/Polygon.md) elements.

#### Example

```ts
for (const polygon of polygons) {
	// ...
}
```

***

### array

> **array**: [`Polygon`](../interfaces/Polygon.md)[]

Defined in: [polygons.ts:37](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L37)

Stores the rendered glyph as an array of [Polygon](../interfaces/Polygon.md) instances.

#### Example

```ts
const polygons = new Polygons();
kage.makeGlyph(polygons, someGlyphName);
for (const poly of polygons.array) {
	let first = true;
	for (const { x, y } of poly.array) {
		if (first) ctx.moveTo(x, y);
		else ctx.lineTo(x, y);
		first = false;
	}
	ctx.closePath();
}
```

## Methods

### clear()

> **clear**(): `void`

Defined in: [polygons.ts:45](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L45)

Clears the content.

#### Returns

`void`

***

### generateEPS()

> **generateEPS**(): `string`

Defined in: [polygons.ts:178](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L178)

Generates a string in EPS format that represents the rendered glyph.

#### Returns

`string`

The string representation of the rendered glyph in EPS format.

***

### generateSVG()

> **generateSVG**(`curve?`): `string`

Defined in: [polygons.ts:141](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L141)

Generates a string in SVG format that represents the rendered glyph.

#### Parameters

##### curve?

`boolean`

Set to true to use the `<path />` format, or set to false to
use the `<polygon />` format. Must be set to true if the glyph was rendered
with `kage.kFont.kUseCurve = true`. Defaults to false (the `<polygon />` format
is used).

#### Returns

`string`

The string representation of the rendered glyph in SVG format.

***

### normalizeWinding()

> **normalizeWinding**(`direction?`): `void`

Defined in: [polygons.ts:120](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L120)

Reverses the vertex order of any contour whose signed area does not match
the requested [WindingDirection](../type-aliases/WindingDirection.md), so all contours share a single
winding orientation.

KAGE assembles each stroke as an independent closed polygon and pushes it
onto [array](#array) without normalizing winding. This is invisible in
environments that fill with `evenodd` rules, but produces white-out
artefacts at stroke intersections under non-zero filling — which is the
default for both SVG `<path>` (when no `fill-rule` is set) and TrueType
`glyf`. Calling this method before passing the polygons to such a
renderer ensures overlapping strokes render as a single filled shape.

#### Parameters

##### direction?

[`WindingDirection`](../type-aliases/WindingDirection.md) = `"cw"`

Target winding direction. Defaults to `"cw"`, which
matches the convention used by TrueType `glyf` outer contours when the
coordinates are flipped to a y-up system. Use `"ccw"` for renderers that
follow the SVG / KAGE-internal y-down convention.

#### Returns

`void`

#### Examples

Preparing polygons for a TrueType `glyf` writer (y-up):
```ts
const polygons = new Polygons();
kage.makeGlyph(polygons, "u9f8d");
polygons.normalizeWinding("ccw"); // KAGE-internal y-down "ccw"
                                  // → glyf y-up "cw" outer contours
```

Producing an SVG `<path>` with non-zero filling:
```ts
polygons.normalizeWinding();
const svg = polygons.generateSVG(true);
```

***

### push()

> **push**(`polygon`): `void`

Defined in: [polygons.ts:54](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L54)

Appends a new [Polygon](../interfaces/Polygon.md) to the end of the array.
Does nothing if `polygon` is not a valid polygon.

#### Parameters

##### polygon

[`Polygon`](../interfaces/Polygon.md)

A [Polygon](../interfaces/Polygon.md) instance to be appended.

#### Returns

`void`
