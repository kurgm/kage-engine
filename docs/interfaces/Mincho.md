[**@kurgm/kage-engine**](../README.md)

***

[@kurgm/kage-engine](../README.md) / Mincho

# Interface: Mincho

Defined in: [font/mincho/index.ts:225](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L225)

Mincho-style font (明朝体).

## Extended by

- [`Gothic`](Gothic.md)

## Implements

- `FontInterface`

## Properties

### kAdjustKakatoL

> **kAdjustKakatoL**: `number`[]

Defined in: [font/mincho/index.ts:260](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L260)

Length of 左下カド's カカト in mincho for each shortening level (0 to 3) and 413 (左下zh用新).

***

### kAdjustKakatoR

> **kAdjustKakatoR**: `number`[]

Defined in: [font/mincho/index.ts:263](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L263)

Length of 右下カド's カカト in mincho for each shortening level (0 to 3).

***

### kAdjustKakatoRangeX

> **kAdjustKakatoRangeX**: `number`

Defined in: [font/mincho/index.ts:266](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L266)

Width of the collision box below カカト for shortening adjustment.

***

### kAdjustKakatoRangeY

> **kAdjustKakatoRangeY**: `number`[]

Defined in: [font/mincho/index.ts:269](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L269)

Height of the collision box below カカト for each shortening adjustment level (0 to 3).

***

### kAdjustKakatoStep

> **kAdjustKakatoStep**: `number`

Defined in: [font/mincho/index.ts:272](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L272)

Number of カカト shortening levels. Must be set to 3.

***

### kAdjustMageStep

> **kAdjustMageStep**: `number`

Defined in: [font/mincho/index.ts:297](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L297)

Parameter for thinning adjustment of the latter half of mincho-style 折れ strokes.

***

### kAdjustTateStep

> **kAdjustTateStep**: `number`

Defined in: [font/mincho/index.ts:295](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L295)

Parameter for thinning adjustment of mincho-style vertical strokes.

***

### kAdjustUroko2Length

> **kAdjustUroko2Length**: `number`

Defined in: [font/mincho/index.ts:293](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L293)

Parameter for shrinking adjustment of ウロコ based on the density of horizontal strokes.

***

### kAdjustUroko2Step

> **kAdjustUroko2Step**: `number`

Defined in: [font/mincho/index.ts:291](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L291)

Number of ウロコ shrinking levels by adjustment based on the density of horizontal strokes.

***

### kAdjustUrokoLength

> **kAdjustUrokoLength**: `number`[]

Defined in: [font/mincho/index.ts:282](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L282)

Threshold length of horizontal strokes for shrinking its ウロコ for each adjustment level ([kAdjustUrokoLengthStep](#kadjusturokolengthstep) to 1).

***

### kAdjustUrokoLengthStep

> **kAdjustUrokoLengthStep**: `number`

Defined in: [font/mincho/index.ts:285](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L285)

Number of ウロコ shrinking levels by adjustment using collision detection.

***

### kAdjustUrokoLine

> **kAdjustUrokoLine**: `number`[]

Defined in: [font/mincho/index.ts:288](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L288)

Size of the collision box to the left of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking adjustment level ([kAdjustUrokoLengthStep](#kadjusturokolengthstep) to 1).

***

### kAdjustUrokoX

> **kAdjustUrokoX**: `number`[]

Defined in: [font/mincho/index.ts:276](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L276)

Size of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking level (0 to max([kAdjustUrokoLengthStep](#kadjusturokolengthstep), [kAdjustUroko2Step](#kadjusturoko2step))).

***

### kAdjustUrokoY

> **kAdjustUrokoY**: `number`[]

Defined in: [font/mincho/index.ts:279](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L279)

Size of ウロコ at the 開放 end of mincho-style horizontal strokes for each shrinking level (0 to max([kAdjustUrokoLengthStep](#kadjusturokolengthstep), [kAdjustUroko2Step](#kadjusturoko2step))).

***

### kKakato

> **kKakato**: `number`

Defined in: [font/mincho/index.ts:247](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L247)

Size of カカト in gothic.

***

### kL2RDfatten

> **kL2RDfatten**: `number`

Defined in: [font/mincho/index.ts:249](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L249)

Width at the end of 右払い relative to `2 * kMinWidthT`.

***

### kMage

> **kMage**: `number`

Defined in: [font/mincho/index.ts:251](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L251)

Size of the curve at the end of 左ハネ, and at the middle of 折れ and 乙線 strokes.

***

### kMinWidthT

> **kMinWidthT**: `number`

Defined in: [font/mincho/index.ts:240](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L240)

Half of the width of mincho-style vertical (thicker) strokes.

***

### kMinWidthU

> **kMinWidthU**: `number`

Defined in: [font/mincho/index.ts:238](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L238)

Determines the size of ウロコ at the 開放 end of mincho-style horizontal strokes.

***

### kMinWidthY

> **kMinWidthY**: `number`

Defined in: [font/mincho/index.ts:236](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L236)

Half of the width of mincho-style horizontal (thinner) strokes.

***

### kRate

> **kRate**: `number` = `100`

Defined in: [font/mincho/index.ts:234](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L234)

Precision for polygon approximation of curving strokes.
It must be a positive divisor of 1000. A smaller `kRate` will result in
smoother curves approximated with a larger number of points (roughly
2 × 1000 / `kRate` per curve stroke).

***

### kUseCurve

> **kUseCurve**: `boolean`

Defined in: [font/mincho/index.ts:256](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L256)

Whether to use off-curve points to approximate curving strokes
with quadratic Bézier curves (experimental).

#### Implementation of

`FontInterface.kUseCurve`

***

### kWidth

> **kWidth**: `number`

Defined in: [font/mincho/index.ts:245](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L245)

Half of the width of gothic-style strokes.
Also used to determine the size of mincho's ornamental elements.

***

### shotai

> `readonly` **shotai**: [`KShotai`](../enumerations/KShotai.md) = `KShotai.kMincho`

Defined in: [font/mincho/index.ts:226](https://github.com/kurgm/kage-engine/blob/master/src/font/mincho/index.ts#L226)

#### Implementation of

`FontInterface.shotai`

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
