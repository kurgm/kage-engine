[**@kurgm/kage-engine**](../README.md) • **Docs**

***

[@kurgm/kage-engine](../README.md) / Gothic

# Class: Gothic

Gothic-style font (ゴシック体).

## Extends

- [`Mincho`](Mincho.md)

## Implements

- `FontInterface`

## Constructors

### new Gothic()

> **new Gothic**(): [`Gothic`](Gothic.md)

#### Returns

[`Gothic`](Gothic.md)

#### Inherited from

[`Mincho`](Mincho.md).[`constructor`](Mincho.md#constructors)

#### Defined in

[font/mincho/index.ts:299](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L299)

## Properties

### kAdjustKakatoL

> **kAdjustKakatoL**: `number`[]

Length of 左下カド's カカト in mincho for each shortening level (0 to 3) and 413 (左下zh用新).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustKakatoL`](Mincho.md#kadjustkakatol)

#### Defined in

[font/mincho/index.ts:260](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L260)

***

### kAdjustKakatoR

> **kAdjustKakatoR**: `number`[]

Length of 右下カド's カカト in mincho for each shortening level (0 to 3).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustKakatoR`](Mincho.md#kadjustkakator)

#### Defined in

[font/mincho/index.ts:263](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L263)

***

### kAdjustKakatoRangeX

> **kAdjustKakatoRangeX**: `number`

Width of the collision box below カカト for shortening adjustment.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustKakatoRangeX`](Mincho.md#kadjustkakatorangex)

#### Defined in

[font/mincho/index.ts:266](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L266)

***

### kAdjustKakatoRangeY

> **kAdjustKakatoRangeY**: `number`[]

Height of the collision box below カカト for each shortening adjustment level (0 to 3).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustKakatoRangeY`](Mincho.md#kadjustkakatorangey)

#### Defined in

[font/mincho/index.ts:269](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L269)

***

### kAdjustKakatoStep

> **kAdjustKakatoStep**: `number`

Number of カカト shortening levels. Must be set to 3.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustKakatoStep`](Mincho.md#kadjustkakatostep)

#### Defined in

[font/mincho/index.ts:272](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L272)

***

### kAdjustMageStep

> **kAdjustMageStep**: `number`

Parameter for thinning adjustment of the latter half of mincho-style 折れ strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustMageStep`](Mincho.md#kadjustmagestep)

#### Defined in

[font/mincho/index.ts:297](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L297)

***

### kAdjustTateStep

> **kAdjustTateStep**: `number`

Parameter for thinning adjustment of mincho-style vertical strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustTateStep`](Mincho.md#kadjusttatestep)

#### Defined in

[font/mincho/index.ts:295](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L295)

***

### kAdjustUroko2Length

> **kAdjustUroko2Length**: `number`

Parameter for shrinking adjustment of ウロコ based on the density of horizontal strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUroko2Length`](Mincho.md#kadjusturoko2length)

#### Defined in

[font/mincho/index.ts:293](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L293)

***

### kAdjustUroko2Step

> **kAdjustUroko2Step**: `number`

Number of ウロコ shrinking levels by adjustment based on the density of horizontal strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUroko2Step`](Mincho.md#kadjusturoko2step)

#### Defined in

[font/mincho/index.ts:291](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L291)

***

### kAdjustUrokoLength

> **kAdjustUrokoLength**: `number`[]

Threshold length of horizontal strokes for shrinking its ウロコ for each adjustment level ([kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep) to 1).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUrokoLength`](Mincho.md#kadjusturokolength)

#### Defined in

[font/mincho/index.ts:282](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L282)

***

### kAdjustUrokoLengthStep

> **kAdjustUrokoLengthStep**: `number`

Number of ウロコ shrinking levels by adjustment using collision detection.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUrokoLengthStep`](Mincho.md#kadjusturokolengthstep)

#### Defined in

[font/mincho/index.ts:285](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L285)

***

### kAdjustUrokoLine

> **kAdjustUrokoLine**: `number`[]

Size of the collision box to the left of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking adjustment level ([kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep) to 1).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUrokoLine`](Mincho.md#kadjusturokoline)

#### Defined in

[font/mincho/index.ts:288](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L288)

***

### kAdjustUrokoX

> **kAdjustUrokoX**: `number`[]

Size of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking level (0 to max([kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep), [kAdjustUroko2Step](Mincho.md#kadjusturoko2step))).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUrokoX`](Mincho.md#kadjusturokox)

#### Defined in

[font/mincho/index.ts:276](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L276)

***

### kAdjustUrokoY

> **kAdjustUrokoY**: `number`[]

Size of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking level (0 to max([kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep), [kAdjustUroko2Step](Mincho.md#kadjusturoko2step))).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUrokoY`](Mincho.md#kadjusturokoy)

#### Defined in

[font/mincho/index.ts:279](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L279)

***

### kKakato

> **kKakato**: `number`

Size of カカト in gothic.

#### Inherited from

[`Mincho`](Mincho.md).[`kKakato`](Mincho.md#kkakato)

#### Defined in

[font/mincho/index.ts:247](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L247)

***

### kL2RDfatten

> **kL2RDfatten**: `number`

Width at the end of 右払い relative to `2 * kMinWidthT`.

#### Inherited from

[`Mincho`](Mincho.md).[`kL2RDfatten`](Mincho.md#kl2rdfatten)

#### Defined in

[font/mincho/index.ts:249](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L249)

***

### kMage

> **kMage**: `number`

Size of the curve at the end of 左ハネ, and at the middle of 折れ and 乙線 strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kMage`](Mincho.md#kmage)

#### Defined in

[font/mincho/index.ts:251](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L251)

***

### kMinWidthT

> **kMinWidthT**: `number`

Half of the width of mincho-style vertical (thicker) strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kMinWidthT`](Mincho.md#kminwidtht)

#### Defined in

[font/mincho/index.ts:240](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L240)

***

### kMinWidthU

> **kMinWidthU**: `number`

Determines the size of ウロコ at the 開放 end of mincho-style horizontal strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kMinWidthU`](Mincho.md#kminwidthu)

#### Defined in

[font/mincho/index.ts:238](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L238)

***

### kMinWidthY

> **kMinWidthY**: `number`

Half of the width of mincho-style horizontal (thinner) strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kMinWidthY`](Mincho.md#kminwidthy)

#### Defined in

[font/mincho/index.ts:236](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L236)

***

### kRate

> **kRate**: `number` = `100`

Precision for polygon approximation of curving strokes.
It must be a positive divisor of 1000. A smaller `kRate` will result in
smoother curves approximated with a larger number of points (roughly
2 × 1000 / `kRate` per curve stroke).

#### Inherited from

[`Mincho`](Mincho.md).[`kRate`](Mincho.md#krate)

#### Defined in

[font/mincho/index.ts:234](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L234)

***

### kUseCurve

> **kUseCurve**: `boolean`

Whether to use off-curve points to approximate curving strokes
with quadratic Bézier curves (experimental).

#### Implementation of

`FontInterface.kUseCurve`

#### Inherited from

[`Mincho`](Mincho.md).[`kUseCurve`](Mincho.md#kusecurve)

#### Defined in

[font/mincho/index.ts:256](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L256)

***

### kWidth

> **kWidth**: `number`

Half of the width of gothic-style strokes.
Also used to determine the size of mincho's ornamental elements.

#### Inherited from

[`Mincho`](Mincho.md).[`kWidth`](Mincho.md#kwidth)

#### Defined in

[font/mincho/index.ts:245](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L245)

***

### shotai

> `readonly` **shotai**: [`KShotai`](../enumerations/KShotai.md) = `KShotai.kGothic`

#### Implementation of

`FontInterface.shotai`

#### Overrides

[`Mincho`](Mincho.md).[`shotai`](Mincho.md#shotai)

#### Defined in

[font/gothic/index.ts:166](https://github.com/kurgm/kage-engine/blob/master/src/font/gothic/index.ts#L166)

## Methods

### setSize()

> **setSize**(`size`?): `void`

#### Parameters

• **size?**: `number`

#### Returns

`void`

#### Implementation of

`FontInterface.setSize`

#### Inherited from

[`Mincho`](Mincho.md).[`setSize`](Mincho.md#setsize)

#### Defined in

[font/mincho/index.ts:303](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L303)
