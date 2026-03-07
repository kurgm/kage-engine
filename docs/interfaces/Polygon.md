[**@kurgm/kage-engine**](../README.md)

***

[@kurgm/kage-engine](../README.md) / Polygon

# Interface: Polygon

Defined in: [polygon.ts:32](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L32)

Represents a single contour of a rendered glyph.

A contour that a Polygon represents is a closed curve made up of straight line
segments or quadratic Bézier curve segments. A Polygon is represented as a
series of [Point](Point.md)'s, each of which is an on-curve point or an off-curve
point. Two consecutive on-curve points form a line segment. A sequence of
two on-curve points with an off-curve point in between forms a curve segment.
The last point and the first point of a Polygon form a line segment that closes
the loop (if the two points differ).

## Properties

### \[iterator\]()

> **\[iterator\]**: (`this`) => `Iterator`\<`Readonly`\<[`Point`](Point.md)\>\>

Defined in: [polygon.ts:239](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L239)

Iterates over its points.

#### Parameters

##### this

`this`

#### Returns

`Iterator`\<`Readonly`\<[`Point`](Point.md)\>\>

An iterator of its [Point](Point.md)s.

#### Example

```ts
for (const { x, y, off } of polygon) {
	// ...
}
```

## Accessors

### array

#### Get Signature

> **get** **array**(): readonly `Readonly`\<[`Point`](Point.md)\>[]

Defined in: [polygon.ts:70](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L70)

A read-only array consisting of the points in this contour.

Modifications to this array do NOT affect the contour;
use the [set](#set) method to modify the contour.

##### Example

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

##### See

 - [Polygon.length](#length) is faster if you only need the length.
 - [Polygon.get](#get) is faster if you need just one element.

##### Returns

readonly `Readonly`\<[`Point`](Point.md)\>[]

***

### length

#### Get Signature

> **get** **length**(): `number`

Defined in: [polygon.ts:75](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L75)

The number of points in this contour.

##### Returns

`number`

## Methods

### clone()

> **clone**(): `Polygon`

Defined in: [polygon.ts:224](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L224)

Creates a deep copy of this Polygon.

#### Returns

`Polygon`

A new Polygon instance.

***

### concat()

> **concat**(`poly`): `void`

Defined in: [polygon.ts:195](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L195)

Appends the points from the contour of another Polygon to the end of
this contour. The other Polygon is not mutated.

#### Parameters

##### poly

`Polygon`

The other Polygon to be appended.

#### Returns

`void`

***

### get()

> **get**(`index`): `Readonly`\<[`Point`](Point.md)\>

Defined in: [polygon.ts:171](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L171)

Retrieves a point from its contour. Throws an error if the index is
out of bounds.

#### Parameters

##### index

`number`

The index in the contour of the point to be retrieved.

#### Returns

`Readonly`\<[`Point`](Point.md)\>

A read-only point object. Modifications made to the returned
object do NOT affect the values of the point in this Polygon's contour;
use the [set](#set) method to modify the contour.

#### Example

```ts
for (let i = 0; i < polygon.length; i++) {
	const point = polygon.get(i);
	// ...
}
```

***

### push()

> **push**(`x`, `y`, `off?`): `void`

Defined in: [polygon.ts:118](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L118)

Appends a point to the end of its contour.

#### Parameters

##### x

`number`

The x-coordinate of the appended point.

##### y

`number`

The y-coordinate of the appended point.

##### off?

`boolean` = `false`

Whether the appended point is an off-curve point. Defaults to `false`.

#### Returns

`void`

***

### reverse()

> **reverse**(): `void`

Defined in: [polygon.ts:186](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L186)

Reverses the order of points in its contour.

#### Returns

`void`

***

### set()

> **set**(`index`, `x`, `y`, `off?`): `void`

Defined in: [polygon.ts:139](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L139)

Modifies a point in its contour.

#### Parameters

##### index

`number`

The index in the contour of the point to be modified.

##### x

`number`

The new x-coordinate of the point.

##### y

`number`

The new y-coordinate of the point.

##### off?

`boolean` = `false`

Whether the new point is an off-curve point. Defaults to `false`.

#### Returns

`void`

***

### shift()

> **shift**(): `void`

Defined in: [polygon.ts:205](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L205)

Removes the first point from its contour. Does nothing if the contour is empty.

#### Returns

`void`

***

### unshift()

> **unshift**(`x`, `y`, `off?`): `void`

Defined in: [polygon.ts:215](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L215)

Inserts a new point at the beginning of its contour.

#### Parameters

##### x

`number`

The x-coordinate of the inserted point.

##### y

`number`

The y-coordiante of the inserted point.

##### off?

`boolean` = `false`

Whether the inserted point is an off-curve point. Defaults to `false`.

#### Returns

`void`
