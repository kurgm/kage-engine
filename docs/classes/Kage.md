[**@kurgm/kage-engine**](../README.md)

***

[@kurgm/kage-engine](../README.md) / Kage

# Class: Kage

Defined in: [kage.ts:30](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L30)

The entry point for the KAGE engine (Kanji-glyph Automatic Generating Engine).
It generates glyph outlines from kanji stroke data described in a dedicated
intermediate format called [KAGE data](https://glyphwiki.org/wiki/GlyphWiki:KAGE%e3%83%87%e3%83%bc%e3%82%bf%e4%bb%95%e6%a7%98).

KAGE data may contain references to other glyphs (components), which are
resolved using a storage in its [kBuhin](#kbuhin) property. The data for the
referenced glyphs must be registered in the storage prior to generating the outline.

The font (mincho or gothic) can be changed using the [kShotai](#kshotai) property.
Font parameters (stroke width, etc.) can be configured using properties of
[kFont](#kfont).

## See

[Kage.makeGlyph](#makeglyph), [Kage.makeGlyph2](#makeglyph2), [Kage.makeGlyph3](#makeglyph3) and
[Kage.makeGlyphSeparated](#makeglyphseparated) for usage examples.

## Constructors

### Constructor

> **new Kage**(`size?`): `Kage`

Defined in: [kage.ts:94](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L94)

#### Parameters

##### size?

`number`

#### Returns

`Kage`

## Properties

### kBuhin

> **kBuhin**: [`Buhin`](Buhin.md)

Defined in: [kage.ts:88](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L88)

A storage used to look up components.

***

### kFont

> **kFont**: [`Font`](../type-aliases/Font.md)

Defined in: [kage.ts:57](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L57)

Allows configuration of the parameters for the currently selected font.
Its parameters reset to their default values when [Kage.kShotai](#kshotai) is set.

#### Example

```ts
const kage = new Kage();
kage.kFont.kRate = 50;
kage.kFont.kWidth = 3;
```

***

### kGothic

> `readonly` **kGothic**: `1` = `KShotai.kGothic`

Defined in: [kage.ts:45](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L45)

An alias for [KShotai.kGothic](../enumerations/KShotai.md#kgothic).

#### See

[Kage.kShotai](#kshotai) for usage.

***

### kMincho

> `readonly` **kMincho**: `0` = `KShotai.kMincho`

Defined in: [kage.ts:40](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L40)

An alias for [KShotai.kMincho](../enumerations/KShotai.md#kmincho).

#### See

[Kage.kShotai](#kshotai) for usage.

***

### Buhin

> `readonly` `static` **Buhin**: *typeof* [`Buhin`](Buhin.md)

Defined in: [kage.ts:32](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L32)

An alias for Buhin constructor.

***

### Polygons

> `readonly` `static` **Polygons**: *typeof* [`Polygons`](Polygons.md)

Defined in: [kage.ts:34](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L34)

An alias for Polygons constructor.

## Accessors

### kShotai

#### Get Signature

> **get** **kShotai**(): [`KShotai`](../enumerations/KShotai.md)

Defined in: [kage.ts:69](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L69)

Gets or sets the font as [KShotai](../enumerations/KShotai.md). Setting this property resets all
font parameters in [Kage.kFont](#kfont). Defaults to [KShotai.kMincho](../enumerations/KShotai.md#kmincho).

##### Example

```ts
const kage = new Kage();
kage.kShotai = kage.kGothic;
```

##### Returns

[`KShotai`](../enumerations/KShotai.md)

#### Set Signature

> **set** **kShotai**(`shotai`): `void`

Defined in: [kage.ts:72](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L72)

##### Parameters

###### shotai

[`KShotai`](../enumerations/KShotai.md)

##### Returns

`void`

***

### kUseCurve

#### Get Signature

> **get** **kUseCurve**(): `boolean`

Defined in: [kage.ts:80](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L80)

Whether to generate contours with off-curve points.
An alias of [Kage.kFont](#kfont).kUseCurve.

##### Returns

`boolean`

#### Set Signature

> **set** **kUseCurve**(`value`): `void`

Defined in: [kage.ts:83](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L83)

##### Parameters

###### value

`boolean`

##### Returns

`void`

## Methods

### checkGlyph()

> **checkGlyph**(`buhin`): [`CheckGlyphResult`](../type-aliases/CheckGlyphResult.md)

Defined in: [kage.ts:231](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L231)

Checks whether the glyph of the given name can be rendered, i.e. whether
the glyph and every component it references (directly or indirectly) are
found in [kBuhin](#kbuhin), and whether the references are free of cycles.

[makeGlyph](#makeglyph) does not perform this check: a missing component is
silently skipped, and a reference cycle makes it recurse until the call
stack overflows. Call this method beforehand when the data comes from an
untrusted source.

#### Parameters

##### buhin

`string`

The name of the glyph to be checked.

#### Returns

[`CheckGlyphResult`](../type-aliases/CheckGlyphResult.md)

`"ok"` if the glyph can be rendered, `"notFound"` if the glyph or
one of its components is not found (or is empty), or `"loop"` if a
reference cycle is detected. When there are several problems, the first
one encountered in a depth-first traversal is reported.

#### Example

```ts
const kage = new Kage();
kage.kBuhin.push("a", "99:0:0:0:0:200:200:b");
kage.kBuhin.push("b", "99:0:0:0:0:200:200:a");
console.log(kage.checkGlyph("a")); // => "loop"
console.log(kage.checkGlyph("c")); // => "notFound"
```

***

### checkGlyph2()

> **checkGlyph2**(`data`): [`CheckGlyphResult`](../type-aliases/CheckGlyphResult.md)

Defined in: [kage.ts:241](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L241)

Same as [checkGlyph](#checkglyph), but checks the given KAGE data instead of
looking up a glyph by name. Empty data is considered renderable.

#### Parameters

##### data

`string`

The KAGE data to be checked (in which lines are delimited by `"$"`).

#### Returns

[`CheckGlyphResult`](../type-aliases/CheckGlyphResult.md)

The same as [checkGlyph](#checkglyph).

***

### makeGlyph()

> **makeGlyph**(`polygons`, `buhin`): `void`

Defined in: [kage.ts:114](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L114)

Renders the glyph of the given name. Existing data in `polygons` (if any) are
NOT cleared; the new glyph is "overprinted".

#### Parameters

##### polygons

[`Polygons`](Polygons.md)

A [Polygons](Polygons.md) instance on which the glyph is rendered.

##### buhin

`string`

The name of the glyph to be rendered.

#### Returns

`void`

#### Example

```ts
const kage = new Kage();
kage.kBuhin.push("uXXXX", "1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
const polygons = new Polygons();
kage.makeGlyph(polygons, "uXXXX");
const svg = polygons.generateSVG(); // now `svg` has the string of the rendered glyph
```

***

### makeGlyph2()

> **makeGlyph2**(`polygons`, `data`): `void`

Defined in: [kage.ts:132](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L132)

Renders the glyph of the given KAGE data. Existing data in `polygons` (if any) are
NOT cleared; the new glyph is "overprinted".

#### Parameters

##### polygons

[`Polygons`](Polygons.md)

A [Polygons](Polygons.md) instance on which the glyph is rendered.

##### data

`string`

The KAGE data to be rendered (in which lines are delimited by `"$"`).

#### Returns

`void`

#### Example

```ts
const kage = new Kage();
const polygons = new Polygons();
kage.makeGlyph2(polygons, "1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
const svg = polygons.generateSVG(); // now `svg` has the string of the rendered glyph
```

***

### makeGlyph3()

> **makeGlyph3**(`data`): [`Polygons`](Polygons.md)[]

Defined in: [kage.ts:155](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L155)

Renders each stroke of the given KAGE data on separate instances of [Polygons](Polygons.md).

#### Parameters

##### data

`string`

The KAGE data to be rendered (in which lines are delimited by `"$"`).

#### Returns

[`Polygons`](Polygons.md)[]

An array of [Polygons](Polygons.md) instances holding the rendered data
of each stroke in the glyph.

#### Example

```ts
const kage = new Kage();
const array = kage.makeGlyph3("1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
console.log(array.length); // => 2
console.log(array[0] instanceof Polygons); // => true
```

***

### makeGlyphSeparated()

> **makeGlyphSeparated**(`data`): [`Polygons`](Polygons.md)[]

Defined in: [kage.ts:189](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L189)

Renders each KAGE data fragment in the given array on separate instances of
[Polygons](Polygons.md), with stroke parameters adjusted as if all fragments together
compose a single glyph.

#### Parameters

##### data

readonly `string`[]

An array of KAGE data fragments (in which lines are delimited by `"$"`)
to be rendered.

#### Returns

[`Polygons`](Polygons.md)[]

An array of [Polygons](Polygons.md) instances holding the rendered data
of each KAGE data fragment.

#### Example

```ts
const kage = new Kage();
const array = kage.makeGlyphSeparated([
	"2:7:8:31:16:32:53:16:65",
	"1:2:2:32:31:176:31$2:22:7:176:31:170:43:156:63",
]);
console.log(array.length); // => 2
console.log(array[0] instanceof Polygons); // => true
```
