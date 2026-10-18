[**@kurgm/kage-engine**](../README.md)

***

[@kurgm/kage-engine](../README.md) / CheckGlyphResult

# Type Alias: CheckGlyphResult

> **CheckGlyphResult** = `"ok"` \| `"notFound"` \| `"loop"`

Defined in: [kage.ts:12](https://github.com/kurgm/kage-engine/blob/master/src/kage.ts#L12)

The result of [Kage.checkGlyph](../classes/Kage.md#checkglyph) and [Kage.checkGlyph2](../classes/Kage.md#checkglyph2).
- `"ok"`: the glyph can be rendered.
- `"notFound"`: the glyph or one of its components is not found.
- `"loop"`: the component references contain a cycle.
