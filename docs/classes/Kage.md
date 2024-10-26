[**@kurgm/kage-engine**](../README.md) • **Docs**

***

[@kurgm/kage-engine](../README.md) / Kage

# Class: Kage

The entry point for KAGE engine (Kanji-glyph Automatic Generating Engine).
It generates glyph outlines from a kanji's stroke data described in a dedicated
intermediate format called [KAGE data](https://glyphwiki.org/wiki/GlyphWiki:KAGE%e3%83%87%e3%83%bc%e3%82%bf%e4%bb%95%e6%a7%98).

KAGE data may contain references to other glyphs (components), which are
resolved using a storage at its [kBuhin](Kage.md#kbuhin) property. The data for the
referenced glyphs must be registered to the storage prior to generating the outline.

The font (mincho or gothic) can be changed with its [kShotai](Kage.md#kshotai) property.
The font parameters (stroke width, etc.) can be configured with properties of
[kFont](Kage.md#kfont).

## See

[Kage.makeGlyph](Kage.md#makeglyph), [Kage.makeGlyph2](Kage.md#makeglyph2), [Kage.makeGlyph3](Kage.md#makeglyph3) and
    [Kage.makeGlyphSeparated](Kage.md#makeglyphseparated) for usage examples.

## Constructors

### new Kage()

> **new Kage**(`size`?): [`Kage`](Kage.md)

#### Parameters

• **size?**: `number`

#### Returns

[`Kage`](Kage.md)

#### Defined in

[kage.ts:86](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L86)

## Properties

### kBuhin

> **kBuhin**: [`Buhin`](Buhin.md)

A storage from which components are looked up.

#### Defined in

[kage.ts:80](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L80)

***

### kFont

> **kFont**: [`Font`](../type-aliases/Font.md)

Provides the way to configure parameters of the currently selected font.
Its parameters are reset to the default values when [Kage.kShotai](Kage.md#kshotai) is set.

#### Example

```ts
const kage = new Kage();
kage.kFont.kRate = 50;
kage.kFont.kWidth = 3;
```

#### Defined in

[kage.ts:49](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L49)

***

### kGothic

> `readonly` **kGothic**: [`kGothic`](../enumerations/KShotai.md#kgothic) = `KShotai.kGothic`

An alias of [KShotai.kGothic](../enumerations/KShotai.md#kgothic).

#### See

[Kage.kShotai](Kage.md#kshotai) for usage.

#### Defined in

[kage.ts:37](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L37)

***

### kMincho

> `readonly` **kMincho**: [`kMincho`](../enumerations/KShotai.md#kmincho) = `KShotai.kMincho`

An alias of [KShotai.kMincho](../enumerations/KShotai.md#kmincho).

#### See

[Kage.kShotai](Kage.md#kshotai) for usage.

#### Defined in

[kage.ts:32](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L32)

***

### Buhin

> `readonly` `static` **Buhin**: *typeof* [`Buhin`](Buhin.md)

An alias of Buhin constructor.

#### Defined in

[kage.ts:24](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L24)

***

### Polygons

> `readonly` `static` **Polygons**: *typeof* [`Polygons`](Polygons.md)

An alias of Polygons constructor.

#### Defined in

[kage.ts:26](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L26)

## Accessors

### kShotai

> `get` **kShotai**(): [`KShotai`](../enumerations/KShotai.md)

Gets or sets the font as [KShotai](../enumerations/KShotai.md). Setting this property resets all the
font parameters in [Kage.kFont](Kage.md#kfont). Defaults to [KShotai.kMincho](../enumerations/KShotai.md#kmincho).

#### Example

```ts
const kage = new Kage();
kage.kShotai = kage.kGothic;
```

> `set` **kShotai**(`shotai`): `void`

#### Parameters

• **shotai**: [`KShotai`](../enumerations/KShotai.md)

#### Returns

[`KShotai`](../enumerations/KShotai.md)

#### Defined in

[kage.ts:61](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L61)

***

### kUseCurve

> `get` **kUseCurve**(): `boolean`

Whether to generate contours with off-curve points.
An alias of [Kage.kFont](Kage.md#kfont).kUseCurve.

> `set` **kUseCurve**(`value`): `void`

#### Parameters

• **value**: `boolean`

#### Returns

`boolean`

#### Defined in

[kage.ts:72](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L72)

## Methods

### makeGlyph()

> **makeGlyph**(`polygons`, `buhin`): `void`

Renders the glyph of the given name. Existing data in `polygons` (if any) are
NOT cleared; new glyph is "overprinted".

#### Parameters

• **polygons**: [`Polygons`](Polygons.md)

A [Polygons](Polygons.md) instance on which the glyph is rendered.

• **buhin**: `string`

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

#### Defined in

[kage.ts:106](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L106)

***

### makeGlyph2()

> **makeGlyph2**(`polygons`, `data`): `void`

Renders the glyph of the given KAGE data. Existing data in `polygons` (if any) are
NOT cleared; new glyph is "overprinted".

#### Parameters

• **polygons**: [`Polygons`](Polygons.md)

A [Polygons](Polygons.md) instance on which the glyph is rendered.

• **data**: `string`

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

#### Defined in

[kage.ts:124](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L124)

***

### makeGlyph3()

> **makeGlyph3**(`data`): [`Polygons`](Polygons.md)[]

Renders each stroke of the given KAGE data on separate instances of
[Polygons](Polygons.md).

#### Parameters

• **data**: `string`

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

#### Defined in

[kage.ts:148](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L148)

***

### makeGlyphSeparated()

> **makeGlyphSeparated**(`data`): [`Polygons`](Polygons.md)[]

Renders each KAGE data fragment in the given array on separate instances of
[Polygons](Polygons.md), with stroke parameters adjusted as if all the fragments joined
together compose a single glyph.

#### Parameters

• **data**: readonly `string`[]

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

#### Defined in

[kage.ts:182](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L182)
