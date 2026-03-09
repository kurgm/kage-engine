// This code is licensed under CC0

/* global fetch, console */

import { Kage, Polygons, Buhin } from "@kurgm/kage-engine";

// Replace the body of this function as necessary with the code that retrieves
// the glyph data from some external data source of your choice.
// 必要に応じてこの関数の本体をお好きな外部のデータソースからグリフデータを
// 取得するコードに書き換えてください。
/**
 * Fetches the KAGE glyph data of the given glyph name from external data source (GlyphWiki).
 * 外部データソース（グリフウィキ）から与えられたグリフ名の KAGE グリフデータを取得します。
 * @param {string} name name of the glyph to fetch — 取得するグリフの名前
 * @return {Promise<string>} a promise fulfilled with the KAGE data — KAGE データで充足される promise
 */
async function getGlyphData(name) {
	// Call GlyphWiki API. See: https://glyphwiki.org/wiki/GlyphWiki:%e9%ab%98%e5%ba%a6%e3%81%aa%e6%b4%bb%e7%94%a8%e6%96%b9%e6%b3%95
	const url = `https://glyphwiki.org/api/glyph?name=${encodeURIComponent(name)}`;

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Failed to fetch glyph data");
	}
	const result = await response.json();
	return result.data || "";
}

const kage = new Kage();

/**
 * Draw the glyph of the given name, fetching the KAGE data from an external source.
 * 外部ソースから KAGE データを取得して、与えられた名前のグリフを描画します。
 * @param {string} name name of the glyph to draw — 描画するグリフの名前
 * @return {Promise<Polygons>} a promise fulfilled with a newly-created `Polygons` instance that contains the drawn data —
 * 描画されたデータを含む新しく作られた `Polygons` のインスタンスで充足される promise
 */
async function drawGlyph(name) {
	// Fetch KAGE data of all glyphs required to draw the glyph of name `name`.
	// 名前 `name` のグリフを描画するために必要なすべてのグリフの KAGE データを取得します。
	await prepareBuhin(kage.kBuhin, name);

	// Draw the glyph into `polygons` object.
	// グリフを `polygons` オブジェクトに描画します。
	const polygons = new Polygons();
	kage.makeGlyph(polygons, name);

	// The fetched data remain stored in `kage.kBuhin`. Erase them if it is not desirable.
	// 取得したデータは `kage.kBuhin` にありつづけます。それが望ましくない場合はデータを消去します。
	//     kage.kBuhin = new Buhin();

	return polygons;
}


(async function () {
	const polygons = await drawGlyph("u6f22");

	console.log(polygons.generateSVG(false));
})();


/**
 * Returns a list of the quoted glyph names in the given KAGE data.
 * 与えられた KAGE データ内で引用されているグリフ名のリストを返します。
 * @param {string} data KAGE data — KAGE データ
 * @return {string[]} the list of quoted glyph names — 引用されているグリフ名のリスト
 */
function getQuotedGlyphNames(data) {
	const result = [];
	for (const line of data.split(/\$|\n/)) {
		const columns = line.split(":");
		if (Math.floor(+columns[0]) === 99) {
			result.push(columns[7]);
		}
	}
	return result;
}

/**
 * Calls `getGlyphData` recursively to retrieve all data necessary to draw
 * the glyph of given name. Retrieved data are stored in `buhin`.
 * 与えられた名前のグリフを描画するために必要なすべてのデータを
 * `getGlyphData` を再帰的に呼び出して取得します。取得したデータは `buhin`
 * に保存されます。
 * @param {Buhin} buhin `Buhin` instance — `Buhin` インスタンス
 * @param {string} name glyph name — グリフ名
 * @return {Promise<void>} a promise fulfilled when all data are ready —
 * すべてのデータが準備完了になったときに充足される promise
 */
async function prepareBuhin(buhin, name) {
	/** @type {Map<string, Promise<{ name: string; data: string; }>>} */
	const waitingMap = new Map();
	function getGlyphDataIfNeeded(name) {
		if (buhin.search(name) || waitingMap.has(name)) {
			return;
		}
		waitingMap.set(name, getGlyphData(name).then((data) => ({ name, data })));
	}
	getGlyphDataIfNeeded(name);
	while (waitingMap.size > 0) {
		const { name, data } = await Promise.race(waitingMap.values());
		buhin.set(name, data);
		waitingMap.delete(name);
		for (const quoted of getQuotedGlyphNames(data)) {
			getGlyphDataIfNeeded(quoted);
		}
	}
}
