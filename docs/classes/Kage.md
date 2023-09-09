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

**`see`** [Kage.makeGlyph](Kage.md#makeglyph), [Kage.makeGlyph2](Kage.md#makeglyph2), [Kage.makeGlyph3](Kage.md#makeglyph3) and
    [Kage.makeGlyphSeparated](Kage.md#makeglyphseparated) for usage examples.

## Table of contents

### Constructors

- [constructor](Kage.md#constructor)

### Properties

- [kBuhin](Kage.md#kbuhin)
- [kFont](Kage.md#kfont)
- [kGothic](Kage.md#kgothic)
- [kMincho](Kage.md#kmincho)
- [Buhin](Kage.md#buhin)
- [Polygons](Kage.md#polygons)

### Accessors

- [kShotai](Kage.md#kshotai)
- [kUseCurve](Kage.md#kusecurve)

### Methods

- [makeGlyph](Kage.md#makeglyph)
- [makeGlyph2](Kage.md#makeglyph2)
- [makeGlyph3](Kage.md#makeglyph3)
- [makeGlyphSeparated](Kage.md#makeglyphseparated)

## Constructors

### constructor

• **new Kage**(`size?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `size?` | `number` |

#### Defined in

[kage.ts:86](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L86)

## Properties

### kBuhin

• **kBuhin**: [`Buhin`](Buhin.md)

A storage from which components are looked up.

#### Defined in

[kage.ts:80](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L80)

___

### kFont

• **kFont**: [`Font`](../README.md#font)

Provides the way to configure parameters of the currently selected font.
Its parameters are reset to the default values when [Kage.kShotai](Kage.md#kshotai) is set.

**`example`**
```ts
const kage = new Kage();
kage.kFont.kRate = 50;
kage.kFont.kWidth = 3;
```

#### Defined in

[kage.ts:49](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L49)

___

### kGothic

• `Readonly` **kGothic**: [`kGothic`](../enums/KShotai.md#kgothic) = `KShotai.kGothic`

An alias of [KShotai.kGothic](../enums/KShotai.md#kgothic).

**`see`** [Kage.kShotai](Kage.md#kshotai) for usage.

#### Defined in

[kage.ts:37](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L37)

___

### kMincho

• `Readonly` **kMincho**: [`kMincho`](../enums/KShotai.md#kmincho) = `KShotai.kMincho`

An alias of [KShotai.kMincho](../enums/KShotai.md#kmincho).

**`see`** [Kage.kShotai](Kage.md#kshotai) for usage.

#### Defined in

[kage.ts:32](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L32)

___

### Buhin

▪ `Static` `Readonly` **Buhin**: typeof [`Buhin`](Buhin.md) = `Buhin`

An alias of Buhin constructor.

#### Defined in

[kage.ts:24](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L24)

___

### Polygons

▪ `Static` `Readonly` **Polygons**: typeof [`Polygons`](Polygons.md) = `Polygons`

An alias of Polygons constructor.

#### Defined in

[kage.ts:26](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L26)

## Accessors

### kShotai

• `get` **kShotai**(): [`KShotai`](../enums/KShotai.md)

Gets or sets the font as [KShotai](../enums/KShotai.md). Setting this property resets all the
font parameters in [Kage.kFont](Kage.md#kfont). Defaults to [KShotai.kMincho](../enums/KShotai.md#kmincho).

**`example`**
```ts
const kage = new Kage();
kage.kShotai = kage.kGothic;
```

#### Returns

[`KShotai`](../enums/KShotai.md)

#### Defined in

[kage.ts:61](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L61)

• `set` **kShotai**(`shotai`): `void`

Gets or sets the font as [KShotai](../enums/KShotai.md). Setting this property resets all the
font parameters in [Kage.kFont](Kage.md#kfont). Defaults to [KShotai.kMincho](../enums/KShotai.md#kmincho).

**`example`**
```ts
const kage = new Kage();
kage.kShotai = kage.kGothic;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `shotai` | [`KShotai`](../enums/KShotai.md) |

#### Returns

`void`

#### Defined in

[kage.ts:64](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L64)

___

### kUseCurve

• `get` **kUseCurve**(): `boolean`

Whether to generate contours with off-curve points.
An alias of [Kage.kFont](Kage.md#kfont).kUseCurve.

#### Returns

`boolean`

#### Defined in

[kage.ts:72](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L72)

• `set` **kUseCurve**(`value`): `void`

Whether to generate contours with off-curve points.
An alias of [Kage.kFont](Kage.md#kfont).kUseCurve.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[kage.ts:75](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L75)

## Methods

### makeGlyph

▸ **makeGlyph**(`polygons`, `buhin`): `void`

Renders the glyph of the given name. Existing data in `polygons` (if any) are
NOT cleared; new glyph is "overprinted".

**`example`**
```ts
const kage = new Kage();
kage.kBuhin.push("uXXXX", "1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
const polygons = new Polygons();
kage.makeGlyph(polygons, "uXXXX");
const svg = polygons.generateSVG(); // now `svg` has the string of the rendered glyph
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `polygons` | [`Polygons`](Polygons.md) | A [Polygons](Kage.md#polygons) instance on which the glyph is rendered. |
| `buhin` | `string` | The name of the glyph to be rendered. |

#### Returns

`void`

#### Defined in

[kage.ts:106](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L106)

___

### makeGlyph2

▸ **makeGlyph2**(`polygons`, `data`): `void`

Renders the glyph of the given KAGE data. Existing data in `polygons` (if any) are
NOT cleared; new glyph is "overprinted".

**`example`**
```ts
const kage = new Kage();
const polygons = new Polygons();
kage.makeGlyph2(polygons, "1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
const svg = polygons.generateSVG(); // now `svg` has the string of the rendered glyph
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `polygons` | [`Polygons`](Polygons.md) | A [Polygons](Kage.md#polygons) instance on which the glyph is rendered. |
| `data` | `string` | The KAGE data to be rendered (in which lines are delimited by `"$"`). |

#### Returns

`void`

#### Defined in

[kage.ts:124](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L124)

___

### makeGlyph3

▸ **makeGlyph3**(`data`): [`Polygons`](Polygons.md)[]

Renders each stroke of the given KAGE data on separate instances of
[Polygons](Kage.md#polygons).

**`example`**
```ts
const kage = new Kage();
const array = kage.makeGlyph3("1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
console.log(array.length); // => 2
console.log(array[0] instanceof Polygons); // => true
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `string` | The KAGE data to be rendered (in which lines are delimited by `"$"`). |

#### Returns

[`Polygons`](Polygons.md)[]

An array of [Polygons](Kage.md#polygons) instances holding the rendered data
    of each stroke in the glyph.

#### Defined in

[kage.ts:148](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L148)

___

### makeGlyphSeparated

▸ **makeGlyphSeparated**(`data`): [`Polygons`](Polygons.md)[]

Renders each KAGE data fragment in the given array on separate instances of
[Polygons](Kage.md#polygons), with stroke parameters adjusted as if all the fragments joined
together compose a single glyph.

**`example`**
```ts
const kage = new Kage();
const array = kage.makeGlyphSeparated([
	"2:7:8:31:16:32:53:16:65",
	"1:2:2:32:31:176:31$2:22:7:176:31:170:43:156:63",
]);
console.log(array.length); // => 2
console.log(array[0] instanceof Polygons); // => true
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | readonly `string`[] | An array of KAGE data fragments (in which lines are delimited by `"$"`)     to be rendered. |

#### Returns

[`Polygons`](Polygons.md)[]

An array of [Polygons](Kage.md#polygons) instances holding the rendered data
    of each KAGE data fragment.

#### Defined in

[kage.ts:182](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L182)
