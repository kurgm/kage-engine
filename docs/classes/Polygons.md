[**@kurgm/kage-engine**](../README.md) • **Docs**

***

[@kurgm/kage-engine](../README.md) / Polygons

# Class: Polygons

Represents the rendered glyph.

A glyph is represented as a series of [Polygon](Polygon.md)'s.
The contained [Polygon](Polygon.md)'s can be accessed by the [array](Polygons.md#array) property.

## Constructors

### new Polygons()

> **new Polygons**(): [`Polygons`](Polygons.md)

#### Returns

[`Polygons`](Polygons.md)

#### Defined in

[polygons.ts:29](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L29)

## Properties

### \[iterator\]()

> **\[iterator\]**: (`this`) => `Iterator`\<[`Polygon`](Polygon.md), `any`, `any`\>

Iterates over its contours.

#### Parameters

• **this**: `this`

#### Returns

`Iterator`\<[`Polygon`](Polygon.md), `any`, `any`\>

An iterator of its [Polygon](Polygon.md) elements.

#### Example

```ts
for (const polygon of polygons) {
	// ...
}
```

#### Defined in

[polygons.ts:159](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L159)

***

### array

> **array**: [`Polygon`](Polygon.md)[]

Stores the rendered glyph as an array of instances of [Polygon](Polygon.md).

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

#### Defined in

[polygons.ts:27](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L27)

## Methods

### clear()

> **clear**(): `void`

Clears the content.

#### Returns

`void`

#### Defined in

[polygons.ts:35](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L35)

***

### generateEPS()

> **generateEPS**(): `string`

Generates a string in EPS format that represents the rendered glyph.

#### Returns

`string`

The string representation of the rendered glyph in EPS format.

#### Defined in

[polygons.ts:121](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L121)

***

### generateSVG()

> **generateSVG**(`curve`?): `string`

Generates a string in SVG format that represents the rendered glyph.

#### Parameters

• **curve?**: `boolean`

Set to true to use `<path />` format or set to false to use
    `<polygon />` format. Must be set to true if the glyph was rendered with
    `kage.kFont.kUseCurve = true`. The `<polygon />` format is used if
    unspecified.

#### Returns

`string`

The string representation of the rendered glyph in SVG format.

#### Defined in

[polygons.ts:84](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L84)

***

### push()

> **push**(`polygon`): `void`

Appends a new [Polygon](Polygon.md) to the end of the array.
Nothing is performed if `polygon` is not a valid polygon.

#### Parameters

• **polygon**: [`Polygon`](Polygon.md)

An instance of [Polygon](Polygon.md) to be appended.

#### Returns

`void`

#### Defined in

[polygons.ts:44](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L44)
