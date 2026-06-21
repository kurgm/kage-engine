[**@kurgm/kage-engine**](../README.md)

***

[@kurgm/kage-engine](../README.md) / Buhin

# Class: Buhin

Defined in: [buhin.ts:30](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L30)

A key-value store that maps a glyph name to a string of KAGE data.

## Constructors

### Constructor

> **new Buhin**(): `Buhin`

Defined in: [buhin.ts:43](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L43)

#### Returns

`Buhin`

## Properties

### onMissing

> **onMissing**: [`BuhinMissingHandler`](../type-aliases/BuhinMissingHandler.md) \| `null`

Defined in: [buhin.ts:41](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L41)

Optional callback invoked from [search](#search) whenever a name has no
registered data. See [BuhinMissingHandler](../type-aliases/BuhinMissingHandler.md) for usage.

Defaults to `null` (silent fallback to `""`), preserving the original
behavior so existing callers are unaffected.

## Methods

### push()

> **push**(`name`, `data`): `void`

Defined in: [buhin.ts:91](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L91)

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

Defined in: [buhin.ts:72](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L72)

Searches the store for the given glyph name and returns the corresponding
KAGE data.

If the name is not registered and [onMissing](#onmissing) is set, the callback
is invoked with the name. If the callback returns a string, that value is
used as the lookup result; otherwise the default value `""` is returned.

#### Parameters

##### name

`string`

The name of the glyph to be looked up.

#### Returns

`string`

The KAGE data if found, the value returned by [onMissing](#onmissing)
if it is a string, otherwise an empty string.

***

### set()

> **set**(`name`, `data`): `void`

Defined in: [buhin.ts:56](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L56)

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
