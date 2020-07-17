# Changelog

## [Unreleased]

## [0.3.0] - 2020-07-17
### Added
- `Polygons` and `Buhin` are accessible as `Kage`'s static properties.
- The script for use in browser environment is now included in the tarball.

### Changed
- Stylistic parameters are moved from `Kage` to `Kage.kFont`.
```diff
 const kage = new Kage();
-kage.kMinWidthY = 3;
-kage.kMinWidthT = 8;
+kage.kFont.kMinWidthY = 3;
+kage.kFont.kMinWidthT = 8;
 // ... the same goes for other parameters ...
```
- Assigning a value to `Kage.kShotai` now resets all stylistic parameters. Set `Kage.kShotai` before modifying any stylistic parameter.

### Deprecated
- Passing size as a parameter to `Kage` constructor is now deprecated. Use `Kage.kFont.setSize(size)` instead.
```diff
-const kage = new Kage(1);
+const kage = new Kage();
+kage.kFont.setSize(1);
```

## [0.2.3] - 2020-07-13
### Changed
- Improve compatibility with the original engine for glyphs using reflect and/or rotate operations.

### Fixed
- Fixed vertical reflection (`0:97`).

## [0.2.2] - 2020-07-12
### Fixed
- `Kage.makeGlyphSeparated` now supports reflect and rotate operations.

## [0.2.1] - 2020-06-05
### Added
- Added `Kage.makeGlyphSeparated`.

## [0.2.0] - 2020-06-05


[Unreleased]: https://github.com/kurgm/kage-engine/compare/v0.3.0...master
[0.3.0]: https://github.com/kurgm/kage-engine/compare/v0.2.3...v0.3.0
[0.2.3]: https://github.com/kurgm/kage-engine/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/kurgm/kage-engine/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/kurgm/kage-engine/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/kurgm/kage-engine/releases/tag/v0.2.0