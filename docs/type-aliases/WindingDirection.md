[**@kurgm/kage-engine**](../README.md)

***

[@kurgm/kage-engine](../README.md) / WindingDirection

# Type Alias: WindingDirection

> **WindingDirection** = `"cw"` \| `"ccw"`

Defined in: [polygons.ts:11](https://github.com/kurgm/kage-engine/blob/master/src/polygons.ts#L11)

The winding direction of a polygon's vertex order. Used by
[Polygons.normalizeWinding](../classes/Polygons.md#normalizewinding) to choose the target orientation.

- `"cw"` — clockwise (in a y-axis-down coordinate system, i.e. the system
   used internally by KAGE — `signedArea > 0`).
- `"ccw"` — counter-clockwise (`signedArea < 0`).
