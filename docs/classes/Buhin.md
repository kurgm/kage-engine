[**@kurgm/kage-engine**](../README.md)

***

[@kurgm/kage-engine](../README.md) / Buhin

# Class: Buhin

Defined in: [buhin.ts:4](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L4)

A key-value store that maps a glyph name to a string of KAGE data.

## Constructors

### Constructor

> **new Buhin**(): `Buhin`

Defined in: [buhin.ts:8](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L8)

#### Returns

`Buhin`

## Methods

### push()

> **push**(`name`, `data`): `void`

Defined in: [buhin.ts:43](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L43)

Adds or updates an element with the given glyph name and KAGE data.
It is an alias for the [set](#set) method.

#### Parameters

##### name

`string`

The name of the glyph.

##### data

`string`

The KAGE data.

#### Returns

`void`

***

### search()

> **search**(`name`): `string`

Defined in: [buhin.ts:30](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L30)

Searches the store for the given glyph name and returns the corresponding
KAGE data.

#### Parameters

##### name

`string`

The name of the glyph to be looked up.

#### Returns

`string`

The KAGE data if found, otherwise an empty string.

***

### set()

> **set**(`name`, `data`): `void`

Defined in: [buhin.ts:20](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L20)

Adds or updates an element with the given glyph name and KAGE data.

#### Parameters

##### name

`string`

The name of the glyph.

##### data

`string`

The KAGE data.

#### Returns

`void`
