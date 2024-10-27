# KAGE engine

[![npm badge](https://img.shields.io/npm/v/@kurgm/kage-engine)](https://www.npmjs.com/package/@kurgm/kage-engine)

KAGE/engine (Kanji-glyph Automatic Generating Engine) is a set of scripts that renders kanji glyphs described in [KAGE format](https://glyphwiki.org/wiki/GlyphWiki:KAGE%e3%83%87%e3%83%bc%e3%82%bf%e4%bb%95%e6%a7%98).
It is a part of the KAGE system, which also includes a glyph design editor, a TrueType font generator, etc.

くろごま（[利用者:twe](https://glyphwiki.org/wiki/User:twe)）が改変したKAGEエンジンです。  
This repository contains the KAGE engine modified by @kurgm (a.k.a. [User:twe](https://glyphwiki.org/wiki/User:twe)).

[デモページ Demo page](https://kurgm.github.io/kage-engine/)

## Usage

### Installation

You can install the package in your project using npm:
```console
$ npm install @kurgm/kage-engine
```
Then you can use `import` or `require` to load the module in your code:
```js
// ES style
import { Kage, Polygons } from "@kurgm/kage-engine";

// CommonJS style
const { Kage, Polygons } = require("@kurgm/kage-engine");
```

Alternatively, you can load the bundled file from a CDN in your web page:
```html
<script src="https://unpkg.com/@kurgm/kage-engine@0.5.0/dist/kage.min.js"></script>
```
This will define only `Kage` in the global scope. You can access `Polygons` and `Buhin` as `Kage`'s properties:
```js
const Polygons = Kage.Polygons;
const Buhin = Kage.Buhin;
```

### Drawing glyphs

*See [docs](docs/classes/Kage.md) for more detailed API documentation (of development version).*

```js
// First create a Kage instance
const kage = new Kage();

// Put glyph data to draw into `kage.kBuhin`
kage.kBuhin.push("u6f22", "99:150:0:9:12:73:200:u6c35-07:0:-10:50$99:0:0:54:10:190:199:u26c29-07");

// Put data of included components as well
kage.kBuhin.push("u6c35-07", "2:7:8:42:12:99:23:124:35$2:7:8:20:62:75:71:97:85$2:7:8:12:123:90:151:81:188$2:2:7:63:144:109:118:188:51");
kage.kBuhin.push("u26c29-07", "1:0:0:18:29:187:29$1:0:0:73:10:73:48$1:0:0:132:10:132:48$1:12:13:44:59:44:87$1:2:2:44:59:163:59$1:22:23:163:59:163:87$1:2:2:44:87:163:87$1:0:0:32:116:176:116$1:0:0:21:137:190:137$7:32:7:102:59:102:123:102:176:10:190$2:7:0:105:137:126:169:181:182");

// Draw the glyph in an instance of `Polygons`
const polygons = new Polygons();
kage.makeGlyph(polygons, "u6f22");

// Convert to SVG and print it to the console
console.log(polygons.generateSVG());
```

There are also other samples available in the [samples](samples/) directory.

## 改変したところ

フォーク元 ([kamichikoichi/kage-engine](https://github.com/kamichikoichi/kage-engine)) から改変したところを以下に述べます。

### 1. API仕様の変更

- [`Mincho`](docs/classes/Mincho.md), [`Gothic`](docs/classes/Gothic.md)クラスを新設し、書体特有のパラメータを `Kage` クラスから移動しました。
    - パラメータは[`Kage.kFont`](docs/classes/Kage.md#kfont)経由で調整可能です（`kage.kFont.kMinWidthT` など）。
- [`Kage.makeGlyphSeparated`](docs/classes/Kage.md#makeglyphseparated)を追加しました。
    - [kage-editor](https://github.com/kurgm/kage-editor)用です。

### 2. コードの整理

型チェックを行うため、コード全体をTypeScriptに書き換えました。

その上で、
- ほぼ同様の処理が複数箇所に重複して記述されている状態を解消しようとしています。
    - 同じ処理が重複して記述されている状態は、後に修正を行う際の修正漏れにつながります。
    - 実際に、重複を解消して1箇所にまとめる過程で、過去の修正漏れと思しき点が多く見つかっています。（下記参照）
    - ちなみに大部分の重複は「水平のとき」「垂直のとき」「斜めのとき」の分岐によるものであり、この分岐を回転行列を計算する関数に抽出して、残りの処理に回転行列の値を使うことで重複を解消しています。
- 自動調整されるパラメータに個別の名前をつけるなど、コードの可読性を改善しようとしています。

ただしコードの整理は、さまざまな入力に対して前と“ほぼ”変わらない出力が得られるように行っています。（詳しくは[出力比較用スクリプト](https://github.com/kurgm/kage-engine-compare)を見てください）

ただし、書体は明朝体で書体パラメータはデフォルト値から変更されないという仮定を置いているほか、入力データに対し以下の仮定を置いており、これら仮定に反する場合出力が大きく変わる可能性があります。

- 部品をすべて分解した際に、制御点に(±0, ±0)を複数持つ筆画は存在しない
- 筆画データの3列目までは非負整数である（1列目が0または99である場合を除く）
- 筆画データ内の数値は有限値である（`Infinity` や `-Infinity` は存在しない）

整理の過程で以下に挙げるようなバグ？が見つかっていますが、非漢字グリフに影響が出る可能性があるためわざと挙動は変えないようにしています。修正は影響を精査してから行う予定です。

- 普通の漢字グリフで出現しうると思われるもの
    - 「直線」の縦画または「折れ」「乙線」「縦払い」で、頭形状「開放」の形状が筆画の角度によって微妙に異なる
    - 「折れ」「乙線」で尾形状「開放」・「上ハネ」の丸の形状が一定でなく、後半が水平のとき・垂直のとき・それ以外のときでそれぞれ異なる
    - 「直線」「折れ」「乙線」「縦払い」の頭形状「右上カド」や「直線」の尾形状「左下zh用新」の形状が、ストロークが垂直かどうかで少し異なる
    - 「直線」「折れ」「乙線」「縦払い」の「接続(縦)」で、ストロークが垂直かどうかでY座標が異なる
    - 「折れ」「乙線」の筆画の尾形状「上ハネ」の形状が、後半が水平かどうかで少し異なる（目ではほぼ分からないレベルですが）
- 普通の漢字グリフでは出現しないと思われるもの
    - 「曲線（複曲線）」の筆画で尾形状が「止め」・「右ハネ」の場合に（2つ目の）中間点→終点が水平左向きまたは垂直上向きの場合に最後の丸が見えなくなる
    - 「曲線（複曲線）」の筆画で「細入り→右払い」で（2つ目の）中間点→終点が水平左向き・垂直上向き・垂直下向きの場合に形状がおかしくなる
    - 「折れ」の筆画で尾形状が「上ハネ」で後半が水平でない左向きの場合に、ハネがやや細い
    - その他、始点または終点が垂直上向きや水平左向きの筆画で各種の頭形状や尾形状の向きがおかしくなることがある

などなど……（[GlyphWiki:バグ報告](http://glyphwiki.org/wiki/GlyphWiki:%E3%83%90%E3%82%B0%E5%A0%B1%E5%91%8A)にもKAGEエンジンのバグが報告されています）

## License / ライセンス

GPL v3
