[**@kurgm/kage-engine**](../README.md)

***

[@kurgm/kage-engine](../README.md) / BuhinMissingHandler

# Type Alias: BuhinMissingHandler()

> **BuhinMissingHandler** = (`name`) => `string` \| `undefined`

Defined in: [buhin.ts:25](https://github.com/kurgm/kage-engine/blob/master/src/buhin.ts#L25)

Callback invoked when [Buhin.search](../classes/Buhin.md#search) is called for a name that has no
registered data. The return value, if a string, is used as the lookup result;
returning `undefined` (or omitting the return) preserves the default behavior
of returning `""`.

Useful for surfacing data inconsistencies that would otherwise be silently
dropped by the engine — for example, while building fonts from large dumps
where a missing buhin causes downstream `99:` instructions to disappear
without any warning.

## Parameters

### name

`string`

## Returns

`string` \| `undefined`

## Example

```ts
// Log warnings for every missing buhin while keeping the default fallback:
kage.kBuhin.onMissing = (name) => {
  console.warn(`Buhin "${name}" is missing`);
};

// Or fail fast:
kage.kBuhin.onMissing = (name) => {
  throw new Error(`Buhin "${name}" is missing`);
};
```
