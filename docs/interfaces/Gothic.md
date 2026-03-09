[**@kurgm/kage-engine**](../README.md)

***

[@kurgm/kage-engine](../README.md) / Gothic

# Interface: Gothic

Defined in: [font/gothic/index.ts:165](https://github.com/kurgm/kage-engine/blob/master/src/font/gothic/index.ts#L165)

Gothic-style font (ゴシック体).

## Extends

- [`Mincho`](Mincho.md)

## Implements

- `FontInterface`

## Properties

### kAdjustKakatoL

> **kAdjustKakatoL**: `number`[]

Defined in: [font/mincho/index.ts:260](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L260)

Length of 左下カド's カカト in mincho for each shortening level (0 to 3) and 413 (左下zh用新).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustKakatoL`](Mincho.md#kadjustkakatol)

***

### kAdjustKakatoR

> **kAdjustKakatoR**: `number`[]

Defined in: [font/mincho/index.ts:263](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L263)

Length of 右下カド's カカト in mincho for each shortening level (0 to 3).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustKakatoR`](Mincho.md#kadjustkakator)

***

### kAdjustKakatoRangeX

> **kAdjustKakatoRangeX**: `number`

Defined in: [font/mincho/index.ts:266](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L266)

Width of the collision box below カカト for shortening adjustment.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustKakatoRangeX`](Mincho.md#kadjustkakatorangex)

***

### kAdjustKakatoRangeY

> **kAdjustKakatoRangeY**: `number`[]

Defined in: [font/mincho/index.ts:269](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L269)

Height of the collision box below カカト for each shortening adjustment level (0 to 3).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustKakatoRangeY`](Mincho.md#kadjustkakatorangey)

***

### kAdjustKakatoStep

> **kAdjustKakatoStep**: `number`

Defined in: [font/mincho/index.ts:272](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L272)

Number of カカト shortening levels. Must be set to 3.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustKakatoStep`](Mincho.md#kadjustkakatostep)

***

### kAdjustMageStep

> **kAdjustMageStep**: `number`

Defined in: [font/mincho/index.ts:297](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L297)

Parameter for thinning adjustment of the latter half of mincho-style 折れ strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustMageStep`](Mincho.md#kadjustmagestep)

***

### kAdjustTateStep

> **kAdjustTateStep**: `number`

Defined in: [font/mincho/index.ts:295](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L295)

Parameter for thinning adjustment of mincho-style vertical strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustTateStep`](Mincho.md#kadjusttatestep)

***

### kAdjustUroko2Length

> **kAdjustUroko2Length**: `number`

Defined in: [font/mincho/index.ts:293](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L293)

Parameter for shrinking adjustment of ウロコ based on the density of horizontal strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUroko2Length`](Mincho.md#kadjusturoko2length)

***

### kAdjustUroko2Step

> **kAdjustUroko2Step**: `number`

Defined in: [font/mincho/index.ts:291](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L291)

Number of ウロコ shrinking levels by adjustment based on the density of horizontal strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUroko2Step`](Mincho.md#kadjusturoko2step)

***

### kAdjustUrokoLength

> **kAdjustUrokoLength**: `number`[]

Defined in: [font/mincho/index.ts:282](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L282)

Threshold length of horizontal strokes for shrinking its ウロコ for each adjustment level ([kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep) to 1).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUrokoLength`](Mincho.md#kadjusturokolength)

***

### kAdjustUrokoLengthStep

> **kAdjustUrokoLengthStep**: `number`

Defined in: [font/mincho/index.ts:285](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L285)

Number of ウロコ shrinking levels by adjustment using collision detection.

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUrokoLengthStep`](Mincho.md#kadjusturokolengthstep)

***

### kAdjustUrokoLine

> **kAdjustUrokoLine**: `number`[]

Defined in: [font/mincho/index.ts:288](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L288)

Size of the collision box to the left of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking adjustment level ([kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep) to 1).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUrokoLine`](Mincho.md#kadjusturokoline)

***

### kAdjustUrokoX

> **kAdjustUrokoX**: `number`[]

Defined in: [font/mincho/index.ts:276](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L276)

Size of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking level (0 to max([kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep), [kAdjustUroko2Step](Mincho.md#kadjusturoko2step))).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUrokoX`](Mincho.md#kadjusturokox)

***

### kAdjustUrokoY

> **kAdjustUrokoY**: `number`[]

Defined in: [font/mincho/index.ts:279](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L279)

Size of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking level (0 to max([kAdjustUrokoLengthStep](Mincho.md#kadjusturokolengthstep), [kAdjustUroko2Step](Mincho.md#kadjusturoko2step))).

#### Inherited from

[`Mincho`](Mincho.md).[`kAdjustUrokoY`](Mincho.md#kadjusturokoy)

***

### kKakato

> **kKakato**: `number`

Defined in: [font/mincho/index.ts:247](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L247)

Size of カカト in gothic.

#### Inherited from

[`Mincho`](Mincho.md).[`kKakato`](Mincho.md#kkakato)

***

### kL2RDfatten

> **kL2RDfatten**: `number`

Defined in: [font/mincho/index.ts:249](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L249)

Width at the end of 右払い relative to `2 * kMinWidthT`.

#### Inherited from

[`Mincho`](Mincho.md).[`kL2RDfatten`](Mincho.md#kl2rdfatten)

***

### kMage

> **kMage**: `number`

Defined in: [font/mincho/index.ts:251](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L251)

Size of the curve at the end of 左ハネ, and at the middle of 折れ and 乙線 strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kMage`](Mincho.md#kmage)

***

### kMinWidthT

> **kMinWidthT**: `number`

Defined in: [font/mincho/index.ts:240](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L240)

Half of the width of mincho-style vertical (thicker) strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kMinWidthT`](Mincho.md#kminwidtht)

***

### kMinWidthU

> **kMinWidthU**: `number`

Defined in: [font/mincho/index.ts:238](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L238)

Determines the size of ウロコ at the 開放 end of mincho-style horizontal strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kMinWidthU`](Mincho.md#kminwidthu)

***

### kMinWidthY

> **kMinWidthY**: `number`

Defined in: [font/mincho/index.ts:236](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L236)

Half of the width of mincho-style horizontal (thinner) strokes.

#### Inherited from

[`Mincho`](Mincho.md).[`kMinWidthY`](Mincho.md#kminwidthy)

***

### kRate

> **kRate**: `number` = `100`

Defined in: [font/mincho/index.ts:234](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L234)

Precision for polygon approximation of curving strokes.
It must be a positive divisor of 1000. A smaller `kRate` will result in
smoother curves approximated with a larger number of points (roughly
2 × 1000 / `kRate` per curve stroke).

#### Inherited from

[`Mincho`](Mincho.md).[`kRate`](Mincho.md#krate)

***

### kUseCurve

> **kUseCurve**: `boolean`

Defined in: [font/mincho/index.ts:256](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L256)

Whether to use off-curve points to approximate curving strokes
with quadratic Bézier curves (experimental).

#### Implementation of

`FontInterface.kUseCurve`

#### Inherited from

[`Mincho`](Mincho.md).[`kUseCurve`](Mincho.md#kusecurve)

***

### kWidth

> **kWidth**: `number`

Defined in: [font/mincho/index.ts:245](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L245)

Half of the width of gothic-style strokes.
Also used to determine the size of mincho's ornamental elements.

#### Inherited from

[`Mincho`](Mincho.md).[`kWidth`](Mincho.md#kwidth)

***

### shotai

> `readonly` **shotai**: [`KShotai`](../enumerations/KShotai.md) = `KShotai.kGothic`

Defined in: [font/gothic/index.ts:166](https://github.com/kurgm/kage-engine/blob/master/src/font/gothic/index.ts#L166)

#### Implementation of

`FontInterface.shotai`

#### Overrides

[`Mincho`](Mincho.md).[`shotai`](Mincho.md#shotai)

## Methods

### setSize()

> **setSize**(`size?`): `void`

Defined in: [font/mincho/index.ts:303](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L303)

#### Parameters

##### size?

`number`

#### Returns

`void`

#### Implementation of

`FontInterface.setSize`

#### Inherited from

[`Mincho`](Mincho.md).[`setSize`](Mincho.md#setsize)
