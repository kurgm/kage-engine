[**@kurgm/kage-engine**](../README.md)

***

[@kurgm/kage-engine](../README.md) / Polygons

# Class: Polygons

Defined in: [polygons.ts:9](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L9)

Represents a rendered glyph.

A glyph is represented as a series of [Polygon](../interfaces/Polygon.md) instances.
The contained [Polygon](../interfaces/Polygon.md)'s can be accessed by the [array](#array) property.

## Constructors

### Constructor

> **new Polygons**(): `Polygons`

Defined in: [polygons.ts:29](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L29)

#### Returns

`Polygons`

## Properties

### \[iterator\]()

> **\[iterator\]**: (`this`) => `Iterator`\<[`Polygon`](../interfaces/Polygon.md)\>

Defined in: [polygons.ts:159](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L159)

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

Defined in: [polygons.ts:27](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L27)

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

Defined in: [polygons.ts:35](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L35)

Clears the content.

#### Returns

`void`

***

### generateEPS()

> **generateEPS**(): `string`

Defined in: [polygons.ts:121](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L121)

Generates a string in EPS format that represents the rendered glyph.

#### Returns

`string`

The string representation of the rendered glyph in EPS format.

***

### generateSVG()

> **generateSVG**(`curve?`): `string`

Defined in: [polygons.ts:84](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L84)

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

### push()

> **push**(`polygon`): `void`

Defined in: [polygons.ts:44](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L44)

Appends a new [Polygon](../interfaces/Polygon.md) to the end of the array.
Does nothing if `polygon` is not a valid polygon.

#### Parameters

##### polygon

[`Polygon`](../interfaces/Polygon.md)

A [Polygon](../interfaces/Polygon.md) instance to be appended.

#### Returns

`void`
