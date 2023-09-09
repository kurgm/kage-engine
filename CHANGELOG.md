# Changelog

## [Unreleased]
### Added
- Gothic glyphs now support stroke type 4 (otsu-curve as in 乙) and 6 (complex curve).
- Gothic glyphs now support reflection and rotation operations.

### Fixed
- Fixed the bug that gothic glyphs sometimes lack left hooks or upward hooks.

## [0.4.0] - 2022-03-02
### Added
- Added TSDoc to the public APIs in the type definition files (`lib/*.d.ts`). Internal methods are now marked `@internal`.

### Fixed
- Fixed incompatibility with the original engine in some edge cases.
- Fixed the type definition of `Polygons.generateSVG(curve)`: its parameter is now optional (defaults to `false`).
- Fixed the type definition of `Kage.kFont` so that the font parameters (`kage.kFont.kMinWidthU` etc.) are correctly typed.

## [0.3.1] - 2020-07-19
### Added
- Added support for new head stroke type 27 (roofed narrow as in right-top corner of 乁).
- Added font parameter `kMinWidthU`, which controls the size of uroko (open end of horizontal stroke).

### Changed
- Changed tail width of `2:x:4` strokes where x ≥ 1000.

### Fixed
- Fixed the problem of top-left corner turning over under some conditions.
- Fixed routine of checking for crossing with otsu strokes.

## [0.3.0] - 2020-07-17
### Added
- Added `Buhin` to exported members of entry point.
- `Polygons` and `Buhin` are accessible as `Kage`'s static properties.
- The script for use in browser environment is now included in the tarball.

### Changed
- Font parameters are moved from `Kage` to `Kage.kFont`.
```diff
 const kage = new Kage();
-kage.kMinWidthY = 3;
-kage.kMinWidthT = 8;
+kage.kFont.kMinWidthY = 3;
+kage.kFont.kMinWidthT = 8;
 // ... the same goes for other parameters ...
```
- Assigning a value to `Kage.kShotai` now resets all font parameters to the default values. Set `Kage.kShotai` before modifying any font parameter.

### Deprecated
- Passing size as a parameter to `Kage` constructor is now deprecated. Use `Kage.kFont.setSize(size)` instead.
```diff
-const kage = new Kage(1);
+const kage = new Kage();
+kage.kFont.setSize(1);
```

## [0.2.3] - 2020-07-13
### Changed
- Improved compatibility with the original engine for glyphs using reflect and/or rotate operations.

### Fixed
- Fixed vertical reflection (`0:97`).

## [0.2.2] - 2020-07-12
### Fixed
- `Kage.makeGlyphSeparated` now supports reflect and rotate operations.

## [0.2.1] - 2020-06-05
### Added
- Added `Kage.makeGlyphSeparated`.

## [0.2.0] - 2020-06-05


[Unreleased]: https://github.com/kurgm/kage-engine/compare/v0.4.0...master
[0.4.0]: https://github.com/kurgm/kage-engine/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/kurgm/kage-engine/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/kurgm/kage-engine/compare/v0.2.3...v0.3.0
[0.2.3]: https://github.com/kurgm/kage-engine/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/kurgm/kage-engine/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/kurgm/kage-engine/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/kurgm/kage-engine/releases/tag/v0.2.0
