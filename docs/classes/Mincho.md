[@kurgm/kage-engine](../README.md) / Mincho

# Class: Mincho

Mincho style font.

## Hierarchy

- **`Mincho`**

  ↳ [`Gothic`](Gothic.md)

## Implements

- `FontInterface`

## Table of contents

### Constructors

- [constructor](Mincho.md#constructor)

### Properties

- [kAdjustKakatoL](Mincho.md#kadjustkakatol)
- [kAdjustKakatoR](Mincho.md#kadjustkakator)
- [kAdjustKakatoRangeX](Mincho.md#kadjustkakatorangex)
- [kAdjustKakatoRangeY](Mincho.md#kadjustkakatorangey)
- [kAdjustKakatoStep](Mincho.md#kadjustkakatostep)
- [kAdjustMageStep](Mincho.md#kadjustmagestep)
- [kAdjustTateStep](Mincho.md#kadjusttatestep)
- [kAdjustUroko2Length](Mincho.md#kadjusturoko2length)
- [kAdjustUroko2Step](Mincho.md#kadjusturoko2step)
- [kAdjustUrokoLength](Mincho.md#kadjusturokolength)
- [kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep)
- [kAdjustUrokoLine](Mincho.md#kadjusturokoline)
- [kAdjustUrokoX](Mincho.md#kadjusturokox)
- [kAdjustUrokoY](Mincho.md#kadjusturokoy)
- [kKakato](Mincho.md#kkakato)
- [kL2RDfatten](Mincho.md#kl2rdfatten)
- [kMage](Mincho.md#kmage)
- [kMinWidthT](Mincho.md#kminwidtht)
- [kMinWidthU](Mincho.md#kminwidthu)
- [kMinWidthY](Mincho.md#kminwidthy)
- [kRate](Mincho.md#krate)
- [kUseCurve](Mincho.md#kusecurve)
- [kWidth](Mincho.md#kwidth)
- [shotai](Mincho.md#shotai)

### Methods

- [setSize](Mincho.md#setsize)

## Constructors

### constructor

• **new Mincho**()

#### Defined in

[font/mincho/index.ts:299](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L299)

## Properties

### kAdjustKakatoL

• **kAdjustKakatoL**: `number`[]

Length of 左下カド's カカト in mincho for each shortening level (0 to 3) and 413 (左下zh用新).

#### Defined in

[font/mincho/index.ts:260](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L260)

___

### kAdjustKakatoR

• **kAdjustKakatoR**: `number`[]

Length of 右下カド's カカト in mincho for each shortening level (0 to 3).

#### Defined in

[font/mincho/index.ts:263](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L263)

___

### kAdjustKakatoRangeX

• **kAdjustKakatoRangeX**: `number`

Width of the collision box below カカト for shortening adjustment.

#### Defined in

[font/mincho/index.ts:266](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L266)

___

### kAdjustKakatoRangeY

• **kAdjustKakatoRangeY**: `number`[]

Height of the collision box below カカト for each shortening adjustment level (0 to 3).

#### Defined in

[font/mincho/index.ts:269](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L269)

___

### kAdjustKakatoStep

• **kAdjustKakatoStep**: `number`

Number of カカト shortening levels. Must be set to 3.

#### Defined in

[font/mincho/index.ts:272](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L272)

___

### kAdjustMageStep

• **kAdjustMageStep**: `number`

Parameter for thinning adjustment of latter half of mincho-style 折れ strokes.

#### Defined in

[font/mincho/index.ts:297](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L297)

___

### kAdjustTateStep

• **kAdjustTateStep**: `number`

Parameter for thinning adjustment of mincho-style vertical strokes.

#### Defined in

[font/mincho/index.ts:295](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L295)

___

### kAdjustUroko2Length

• **kAdjustUroko2Length**: `number`

Parameter for shrinking adjustment of ウロコ using density of horizontal strokes.

#### Defined in

[font/mincho/index.ts:293](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L293)

___

### kAdjustUroko2Step

• **kAdjustUroko2Step**: `number`

Number of ウロコ shrinking levels by adjustment using density of horizontal strokes.

#### Defined in

[font/mincho/index.ts:291](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L291)

___

### kAdjustUrokoLength

• **kAdjustUrokoLength**: `number`[]

Threshold length of horizontal strokes for shrinking its ウロコ for each adjustment level ([kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep) to 1).

#### Defined in

[font/mincho/index.ts:282](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L282)

___

### kAdjustUrokoLengthStep

• **kAdjustUrokoLengthStep**: `number`

Number of ウロコ shrinking levels by adjustment using collision detection.

#### Defined in

[font/mincho/index.ts:285](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L285)

___

### kAdjustUrokoLine

• **kAdjustUrokoLine**: `number`[]

Size of the collision box to the left of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking adjustment level ([kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep) to 1).

#### Defined in

[font/mincho/index.ts:288](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L288)

___

### kAdjustUrokoX

• **kAdjustUrokoX**: `number`[]

Size of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking level (0 to max([kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep), [kAdjustUroko2Step](Mincho.md#kadjusturoko2step))).

#### Defined in

[font/mincho/index.ts:276](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L276)

___

### kAdjustUrokoY

• **kAdjustUrokoY**: `number`[]

Size of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking level (0 to max([kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep), [kAdjustUroko2Step](Mincho.md#kadjusturoko2step))).

#### Defined in

[font/mincho/index.ts:279](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L279)

___

### kKakato

• **kKakato**: `number`

Size of カカト in gothic.

#### Defined in

[font/mincho/index.ts:247](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L247)

___

### kL2RDfatten

• **kL2RDfatten**: `number`

Width at the end of 右払い relative to `2 * kMinWidthT`.

#### Defined in

[font/mincho/index.ts:249](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L249)

___

### kMage

• **kMage**: `number`

Size of curve at the end of 左ハネ, and at the middle of 折れ and 乙線 strokes.

#### Defined in

[font/mincho/index.ts:251](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L251)

___

### kMinWidthT

• **kMinWidthT**: `number`

Half of the width of mincho-style vertical (thicker) strokes.

#### Defined in

[font/mincho/index.ts:240](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L240)

___

### kMinWidthU

• **kMinWidthU**: `number`

Determines the size of ウロコ at the 開放 end of mincho-style horizontal strokes.

#### Defined in

[font/mincho/index.ts:238](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L238)

___

### kMinWidthY

• **kMinWidthY**: `number`

Half of the width of mincho-style horizontal (thinner) strokes.

#### Defined in

[font/mincho/index.ts:236](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L236)

___

### kRate

• **kRate**: `number` = `100`

Precision for polygon approximation of curving strokes.
It must be a positive divisor of 1000. The smaller `kRate` will give
smoother curves approximated with the larger number of points (roughly
2 × 1000 / `kRate` per one curve stroke).

#### Defined in

[font/mincho/index.ts:234](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L234)

___

### kUseCurve

• **kUseCurve**: `boolean`

Whether to use off-curve points to approximate curving strokes
with quadratic Bézier curve (experimental).

#### Implementation of

FontInterface.kUseCurve

#### Defined in

[font/mincho/index.ts:256](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L256)

___

### kWidth

• **kWidth**: `number`

Half of the width of gothic-style strokes.
Also used to determine the size of mincho's ornamental elements.

#### Defined in

[font/mincho/index.ts:245](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L245)

___

### shotai

• `Readonly` **shotai**: [`KShotai`](../enums/KShotai.md) = `KShotai.kMincho`

#### Implementation of

FontInterface.shotai

#### Defined in

[font/mincho/index.ts:226](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L226)

## Methods

### setSize

▸ **setSize**(`size?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size?` | `number` |

#### Returns

`void`

#### Implementation of

FontInterface.setSize

#### Defined in

[font/mincho/index.ts:303](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L303)
