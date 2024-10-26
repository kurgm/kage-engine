[**@kurgm/kage-engine**](../README.md) • **Docs**

***

[@kurgm/kage-engine](../README.md) / Polygon

# Class: Polygon

Represents a single contour of a rendered glyph.

A contour that a Polygon represents is a closed curve made up of straight line
segments or quadratic Bézier curve segments. A Polygon is represented as a
series of [Point](../interfaces/Point.md)'s, each of which is an on-curve point or an off-curve
point. Two consecutive on-curve points define a line segment. A sequence of
two on-curve points with an off-curve point in between defines a curve segment.
The last point and the first point of a Polygon define a line segment that closes
the loop (if the two points differ).

## Constructors

### new Polygon()

> **new Polygon**(`length`?): [`Polygon`](Polygon.md)

Construct the `Polygon` object. If the argument `length` is given,
constructed object has contour of size `length` whose members are all
initialized to the origin point (0, 0). Otherwise the contour has
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

> **\[iterator\]**: (`this`) => `Iterator`\<`Readonly`\<[`Point`](../interfaces/Point.md)\>, `any`, `undefined`\>

Iterates over its points.

#### Parameters

• **this**: `this`

#### Returns

`Iterator`\<`Readonly`\<[`Point`](../interfaces/Point.md)\>, `any`, `undefined`\>

An iterator of its [Point](../interfaces/Point.md)s.

#### Example

```ts
for (const { x, y, off } of polygon) {
	// ...
}
```

#### Defined in

[polygon.ts:240](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L240)

## Accessors

### array

> `get` **array**(): readonly `Readonly`\<[`Point`](../interfaces/Point.md)\>[]

A read-only array consisting of the points in this contour.

Modifications to this array do NOT affect the contour;
call [set](Polygon.md#set) method to modify the contour.

#### Example

```ts
for (const point of polygon.array) {
	// ...
}
```

Note that the computation of coordinates of all the points is performed
every time this property is accessed. To get a better performance, consider
caching the result in a variable when you need to access the array repeatedly.
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

[polygon.ts:225](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L225)

***

### concat()

> **concat**(`poly`): `void`

Appends the points in the contour of another [Polygon](Polygon.md) at the end of
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

Retrieves a point in its contour. If the index is out of bounds,
throws an error.

#### Parameters

• **index**: `number`

The index in the contour of the point to be retrieved.

#### Returns

`Readonly`\<[`Point`](../interfaces/Point.md)\>

A read-only point object. Modifications made to the returned
    object do NOT affect the values of the point in the contour;
    call [set](Polygon.md#set) method to modify the contour.

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

Appends a point at the end of its contour.

#### Parameters

• **x**: `number`

The x-coordinate of the appended point.

• **y**: `number`

The y-coordiante of the appended point.

• **off**: `boolean` = `false`

Whether the appended point is an off-curve point. Defaults to `false`.

#### Returns

`void`

#### Defined in

[polygon.ts:118](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L118)

***

### reverse()

> **reverse**(): `void`

Reverses the points in its contour.

#### Returns

`void`

#### Defined in

[polygon.ts:186](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L186)

***

### set()

> **set**(`index`, `x`, `y`, `off`): `void`

Mutates a point in its contour.

#### Parameters

• **index**: `number`

The index in the contour of the point to be mutated.

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

Removes the first point in its contour. If there are no points in the contour,
nothing is performed.

#### Returns

`void`

#### Defined in

[polygon.ts:206](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L206)

***

### unshift()

> **unshift**(`x`, `y`, `off`): `void`

Inserts a new point at the start of its contour.

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

[polygon.ts:216](https://github.com/kurgm/kage-engine/blob/master/src/polygon.ts#L216)
