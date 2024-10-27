[**@kurgm/kage-engine**](../README.md) • **Docs**

***

[@kurgm/kage-engine](../README.md) / Polygon

# Class: Polygon

Represents a single contour of a rendered glyph.

A contour that a Polygon represents is a closed curve made up of straight line
segments or quadratic Bézier curve segments. A Polygon is represented as a
series of [Point](../interfaces/Point.md)'s, each of which is an on-curve point or an off-curve
point. Two consecutive on-curve points form a line segment. A sequence of
two on-curve points with an off-curve point in between forms a curve segment.
The last point and the first point of a Polygon form a line segment that closes
the loop (if the two points differ).

## Constructors

### new Polygon()

> **new Polygon**(`length`?): [`Polygon`](Polygon.md)

Constructs a `Polygon` object. If the `length` argument is given,
the constructed object represents a contour of size `length`, with all
its points initialized to the origin (0, 0). Otherwise the contour has
no points.

#### Parameters

• **length?**: `number`

The initial number of points in the contour.

#### Returns

[`Polygon`](Polygon.md)

#### Defined in

[polygon.ts:85](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L85)

## Properties

### \[iterator\]()

> **\[iterator\]**: (`this`) => `Iterator`\<`Readonly`\<[`Point`](../interfaces/Point.md)\>, `any`, `any`\>

Iterates over its points.

#### Parameters

• **this**: `this`

#### Returns

`Iterator`\<`Readonly`\<[`Point`](../interfaces/Point.md)\>, `any`, `any`\>

An iterator of its [Point](../interfaces/Point.md)s.

#### Example

```ts
for (const { x, y, off } of polygon) {
	// ...
}
```

#### Defined in

[polygon.ts:239](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L239)

## Accessors

### array

> `get` **array**(): readonly `Readonly`\<[`Point`](../interfaces/Point.md)\>[]

A read-only array consisting of the points in this contour.

Modifications to this array do NOT affect the contour;
use the [set](Polygon.md#set) method to modify the contour.

#### Example

```ts
for (const point of polygon.array) {
	// ...
}
```

Note that the coordinates of all points are computed each time this property
is accessed. If you need to access the array repeatedly, consider storing
the result in a variable to avoid redundant computation.
```ts
// DO:
const array = polygon.array;
for (let i = 0; i < array.length; i++) {
	const point = array[i];
	// ...
}

// DON'T:
for (let i = 0; i < polygon.array.length; i++) {
	const point = polygon.array[i];
	// ...
}
```

#### See

 - [Polygon.length](Polygon.md#length) is faster if you only need the length.
 - [Polygon.get](Polygon.md#get) is faster if you need just one element.

#### Returns

readonly `Readonly`\<[`Point`](../interfaces/Point.md)\>[]

#### Defined in

[polygon.ts:70](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L70)

***

### length

> `get` **length**(): `number`

The number of points in this contour.

#### Returns

`number`

#### Defined in

[polygon.ts:75](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L75)

## Methods

### clone()

> **clone**(): [`Polygon`](Polygon.md)

Creates a deep copy of this Polygon.

#### Returns

[`Polygon`](Polygon.md)

A new [Polygon](Polygon.md) instance.

#### Defined in

[polygon.ts:224](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L224)

***

### concat()

> **concat**(`poly`): `void`

Appends the points from the contour of another [Polygon](Polygon.md) to the end of
this contour. The other Polygon is not mutated.

#### Parameters

• **poly**: [`Polygon`](Polygon.md)

The other [Polygon](Polygon.md) to be appended.

#### Returns

`void`

#### Defined in

[polygon.ts:195](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L195)

***

### get()

> **get**(`index`): `Readonly`\<[`Point`](../interfaces/Point.md)\>

Retrieves a point from its contour. Throws an error if the index is
out of bounds.

#### Parameters

• **index**: `number`

The index in the contour of the point to be retrieved.

#### Returns

`Readonly`\<[`Point`](../interfaces/Point.md)\>

A read-only point object. Modifications made to the returned
object do NOT affect the values of the point in this Polygon's contour;
use the [set](Polygon.md#set) method to modify the contour.

#### Example

```ts
for (let i = 0; i < polygon.length; i++) {
	const point = polygon.get(i);
	// ...
}
```

#### Defined in

[polygon.ts:171](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L171)

***

### push()

> **push**(`x`, `y`, `off`): `void`

Appends a point to the end of its contour.

#### Parameters

• **x**: `number`

The x-coordinate of the appended point.

• **y**: `number`

The y-coordinate of the appended point.

• **off**: `boolean` = `false`

Whether the appended point is an off-curve point. Defaults to `false`.

#### Returns

`void`

#### Defined in

[polygon.ts:118](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L118)

***

### reverse()

> **reverse**(): `void`

Reverses the order of points in its contour.

#### Returns

`void`

#### Defined in

[polygon.ts:186](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L186)

***

### set()

> **set**(`index`, `x`, `y`, `off`): `void`

Modifies a point in its contour.

#### Parameters

• **index**: `number`

The index in the contour of the point to be modified.

• **x**: `number`

The new x-coordinate of the point.

• **y**: `number`

The new y-coordinate of the point.

• **off**: `boolean` = `false`

Whether the new point is an off-curve point. Defaults to `false`.

#### Returns

`void`

#### Defined in

[polygon.ts:139](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L139)

***

### shift()

> **shift**(): `void`

Removes the first point from its contour. Does nothing if the contour is empty.

#### Returns

`void`

#### Defined in

[polygon.ts:205](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L205)

***

### unshift()

> **unshift**(`x`, `y`, `off`): `void`

Inserts a new point at the beginning of its contour.

#### Parameters

• **x**: `number`

The x-coordinate of the inserted point.

• **y**: `number`

The y-coordiante of the inserted point.

• **off**: `boolean` = `false`

Whether the inserted point is an off-curve point. Defaults to `false`.

#### Returns

`void`

#### Defined in

[polygon.ts:215](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L215)
