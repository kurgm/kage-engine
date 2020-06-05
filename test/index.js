/* eslint-disable no-console */

const {Kage, Polygons} = require("../");

function testKage(buhins, name, result, curve = false) {
	const kage = new Kage();
	kage.kUseCurve = curve;
	Object.keys(buhins).forEach((key) => {
		kage.kBuhin.push(key, buhins[key]);
	});

	const polygons = new Polygons();
	kage.makeGlyph(polygons, name);

	if (polygons.array.length !== result.length) {
		throw new Error(`Different # of polygons in ${name}`);
	}
	polygons.array.forEach((poly, i) => {
		poly.index = i;
	});
	result.forEach((res, i) => {
		res.index = i;
	});
	polygons.array.sort((poly1, poly2) => {
		const array1 = poly1.array;
		const array2 = poly2.array;
		const d = array2.length - array1.length;
		if (d !== 0) {
			return d;
		}
		for (let j = 0; j < array1.length; j++) {
			const d2 = array2[j].x - array1[j].x || array2[j].y - array1[j].y;
			if (d2 !== 0) {
				return d2;
			}
		}
		return 0;
	});
	result.sort((res1, res2) => {
		const d = res2.length - res1.length;
		if (d !== 0) {
			return d;
		}
		for (let j = 0; j < res1.length; j++) {
			const d2 = res2[j][0] - res1[j][0] || res2[j][1] - res1[j][1];
			if (d2 !== 0) {
				return d2;
			}
		}
		return 0;
	});
	for (let i = 0; i < polygons.array.length; i++) {
		const polygon = polygons.array[i];
		const {array} = polygon;
		const res = result[i];
		const indexStr = polygon.index === res.index
			? `${polygon.index + 1}`
			: `${polygon.index + 1}(${res.index + 1})`;
		if (array.length !== res.length) {
			throw new Error(`Different # of points in a polygon ${indexStr} in ${name}`);
		}
		for (let j = 0; j < array.length; j++) {
			const point = array[j];
			const r = res[j];
			if (!!point.off !== !!r[2]) {
				throw new Error(`Different off/on-curve point ${j + 1} in polygon ${indexStr} in ${name}`);
			}
			const dx = point.x - r[0];
			const dy = point.y - r[1];
			if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
				throw new Error(`Different point ${j + 1} in polygon ${indexStr} in ${name}: dx=${dx}, dy=${dy}`);
			}
			if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
				console.warn(`[warn] Slightly different point ${j + 1} in polygon ${indexStr} in ${name}: dx=${dx}, dy=${dy}`);
			}
			if (isNaN(point.x) || isNaN(point.y)) {
				throw new Error(`NaN point ${j + 1} in polygon ${indexStr} in ${name}`);
			}
		}
	}
}

testKage({
	"u9ebb": "1:0:2:40:37:143:37$4:22:5:143:37:12:169:170:169:175:171",
	"u9ebb-2": "99:0:0:0:0:200:200:u9ebb:0:0:0",
}, "u9ebb-2", [
	[[40, 35], [143, 35], [143, 39], [40, 39]],
	[[150, 38], [58.5, 130.6], [50, 122.1], [134.5, 37]],
	[[137, 35], [143, 30], [154, 39], [149, 42], [137, 47]],
	[[58.5, 130.6], [51.4, 138.3], [46.5, 144.9], [43.7, 150.3], [42.8, 153.9], [43.1, 156], [44.3, 157.7], [47.6, 159.6], [53.3, 161.4], [61.5, 162.5], [72, 163], [72, 175], [60.5, 174.5], [50.8, 173.1], [42.8, 170.6], [36.3, 166.6], [32, 160.6], [30.8, 153.3], [32.5, 145.9], [36.3, 138.5], [42.2, 130.6], [50, 122.1]],
	[[72, 163], [76.2, 164.8], [78, 169], [76.2, 173.2], [72, 175]],
	[[72, 163], [170, 163], [170, 175], [72, 175]],
	[[170, 163], [173.6, 165.4], [176, 169], [173.6, 172.6], [170, 175]],
	[[170, 163], [172, 138], [170, 138], [164, 163]],
]);

testKage({
	"twe_sandbox@81": `1:12:13:25:28:24:95
1:2:2:25:28:81:28
1:22:23:81:28:80:95
1:32:32:53:28:52:95
1:0:0:12:61:100:61
1:2:2:24:95:80:95
1:0:4:108:21:110:93
1:0:0:165:23:165:46
1:0:413:142:15:132:63
1:2:0:132:63:175:57
1:0:313:139:79:139:99
1:2:2:139:99:160:99
1:0:24:160:66:160:99
2:0:7:30:130:27:167:11:187
2:0:7:27:184:47:178:65:165
2:0:5:37:110:44:133:57:152
2:7:4:119:104:135:117:135:134
2:32:7:84:106:77:124:62:142
1:0:2:59:106:102:106
3:22:5:102:106:96:165:122:165
3:0:0:78:140:76:180:117:180
4:0:5:164:109:131:179:177:179
6:7:8:132:106:155:112:146:145:171:139
7:0:7:184:14:184:88:184:146:166:171`.replace(/\n/g, "$$"),
}, "twe_sandbox@81", [
	[[31, 26], [29.7, 109], [17.7, 114.9], [19.1, 19.9]],
	[[25, 26], [81, 26], [81, 30], [25, 30]],
	[[86, 29], [85.9, 97], [73.8, 102.9], [74.9, 28]],
	[[75, 26], [81, 21], [92, 30], [87, 33], [75, 38]],
	[[59, 28], [58, 95], [45.9, 95], [46.9, 28]],
	[[12, 59], [100, 59], [100, 63], [12, 63]],
	[[100, 59], [88, 61], [94, 53]],
	[[24, 93], [80, 93], [80, 97], [24, 97]],
	[[114, 21.8], [115.7, 82.8], [103.7, 83.1], [101.9, 20.1]],
	[[114, 21.8], [117, 23.7], [112.1, 25.8]],
	[[115.7, 82.8], [115.6, 85.4], [115.2, 87.9], [114.5, 90.3], [113.3, 92.6], [111.7, 94.6], [109.7, 96.3], [107.4, 97.6], [105, 98.4], [102.5, 98.8], [100, 99], [100, 87], [101.2, 86.9], [102.1, 86.7], [102.6, 86.5], [102.9, 86.4], [103.1, 86.3], [103.2, 86.1], [103.3, 85.8], [103.5, 85.3], [103.6, 84.4], [103.7, 83.1]],
	[[100, 93], [100, 87], [80, 87], [80, 90]],
	[[170.5, 24], [170.5, 43.2], [159.5, 48.7], [159.5, 22]],
	[[170.5, 24], [173.2, 26], [168.5, 29]],
	[[147.6, 17.2], [137.8, 64.2], [124.9, 67.6], [136.3, 12.7]],
	[[132, 53], [120, 63], [130, 73], [138, 65], [132, 63]],
	[[147.6, 17.2], [150.1, 19.7], [144.8, 21.3]],
	[[131.7, 61], [174.7, 55], [175.2, 58.9], [132.2, 64.9]],
	[[174.7, 55], [155.1, 59.7], [163.7, 47.6]],
	[[144.5, 80], [144.5, 101], [133.5, 106.5], [133.5, 78]],
	[[144.5, 80], [147.2, 82], [142.5, 85]],
	[[139, 97], [160, 97], [160, 101], [139, 101]],
	[[165.5, 67], [165.5, 101], [154.5, 101], [154.5, 65]],
	[[160, 101], [165.5, 93], [171, 97], [171, 101]],
	[[165.5, 67], [168.2, 69], [163.5, 72]],
	[[35.8, 131.4], [34.8, 138.7], [33.5, 145.6], [31.8, 152.2], [29.9, 158.4], [27.7, 164.3], [25.2, 169.8], [22.3, 174.9], [19.2, 179.7], [15.6, 183.9], [11.7, 187.5], [10.2, 186.4], [12.5, 181.7], [14.5, 177], [16.4, 172.1], [18.1, 167], [19.7, 161.6], [21, 156], [22, 150], [22.9, 143.8], [23.5, 137.3], [23.9, 130.5]],
	[[23.8, 131.5], [35.8, 131.4], [24.1, 128.3]],
	[[35.8, 131.4], [38.7, 133.7], [33.5, 136.3]],
	[[26.2, 177.9], [29.9, 177.1], [33.6, 176.1], [37.3, 175.1], [41.1, 173.9], [44.9, 172.5], [48.7, 171.1], [52.5, 169.5], [56.4, 167.8], [60.4, 166.1], [64.4, 164.2], [65.5, 165.7], [62.2, 168.8], [59, 171.9], [55.6, 174.7], [52.1, 177.3], [48.5, 179.7], [44.9, 182], [41.1, 184.1], [37.4, 186], [33.5, 187.8], [29.6, 189.4]],
	[[29.6, 189.4], [26.2, 177.9], [24.3, 178.5]],
	[[29.6, 189.4], [32.4, 191.7], [34.5, 184.8]],
	[[43, 109.2], [44.3, 113.4], [45.8, 117.5], [47.4, 121.6], [49.1, 125.6], [50.9, 129.6], [52.9, 133.5], [55, 137.4], [57.1, 141.1], [59.5, 144.9], [61.9, 148.6], [52, 155.3], [49.4, 151.4], [46.9, 147.3], [44.5, 143.2], [42.2, 139], [40.1, 134.8], [38.1, 130.5], [36.3, 126.1], [34.6, 121.7], [33, 117.2], [31.5, 112.7]],
	[[31.8, 113.6], [43, 109.2], [31, 111.1]],
	[[43, 109.2], [46.4, 110.2], [42.5, 114.5]],
	[[61.9, 148.6], [62.8, 153], [60.3, 156.9], [55.9, 157.8], [52, 155.3]],
	[[57, 147], [59, 121], [57, 121], [51, 147]],
	[[120.3, 103.9], [123.4, 106.1], [126.5, 107.9], [129.3, 109.7], [131.8, 111.5], [134, 113.3], [136, 115.2], [137.7, 117.1], [139.1, 119.1], [140.3, 121.4], [141, 124], [129, 123.9], [129.3, 123.6], [129.5, 122.7], [129.5, 121.5], [129, 119.8], [128.2, 117.9], [127.1, 115.7], [125.7, 113.3], [123.9, 110.7], [121.8, 107.9], [119.2, 105.3]],
	[[129, 124], [130.8, 128.2], [135, 130], [139.2, 128.2], [141, 124]],
	[[141, 124], [140.8, 126.5], [140.4, 129], [139.6, 131.4], [138.3, 133.7], [136.7, 135.7], [134.7, 137.3], [132.4, 138.6], [130, 139.4], [127.5, 139.8], [125, 140], [125, 128], [126.2, 127.9], [127.1, 127.7], [127.7, 127.5], [128, 127.4], [128.2, 127.2], [128.4, 127], [128.5, 126.7], [128.7, 126.1], [128.9, 125.2], [129, 124]],
	[[125, 134], [125, 128], [105, 128], [105, 131]],
	[[90.5, 106], [89.5, 108.1], [87.7, 111.8], [85.6, 115.4], [83.4, 119], [81, 122.6], [78.4, 126.1], [75.7, 129.5], [72.7, 132.9], [69.6, 136.2], [66.2, 139.4], [62.6, 142.5], [61.3, 141.4], [63.6, 137.3], [65.7, 133.3], [67.7, 129.4], [69.7, 125.6], [71.5, 121.8], [73.2, 118.1], [74.7, 114.5], [76.1, 110.9], [77.3, 107.3], [77.7, 106]],
	[[59, 104], [102, 104], [102, 108], [59, 108]],
	[[107, 107], [102.9, 155.6], [91, 154.4], [95.9, 106]],
	[[96, 104], [102, 99], [113, 108], [108, 111], [96, 116]],
	[[102.9, 155.6], [102.7, 156.8], [102.6, 157.7], [102.6, 158.3], [102.6, 158.7], [102.6, 158.9], [102.7, 159.2], [103, 159.5], [103.6, 159.9], [104.6, 160.2], [106, 160.5], [106, 169.5], [103.5, 169.5], [101.2, 169.2], [98.9, 168.6], [96.8, 167.5], [94.8, 166], [93.2, 164], [92.1, 161.8], [91.4, 159.4], [91, 156.9], [91, 154.4]],
	[[106, 160.5], [109.1, 161.8], [110.5, 165], [109.1, 168.1], [106, 169.5]],
	[[106, 160.5], [122, 160.5], [122, 169.5], [106, 169.5]],
	[[122, 160.5], [124.7, 162.3], [126.5, 165], [124.7, 167.7], [122, 169.5]],
	[[122, 160.5], [124, 147.5], [122, 147.5], [117.5, 160.5]],
	[[83.9, 141.2], [82.4, 170.3], [70.5, 169.7], [72, 138.7]],
	[[83.9, 141.2], [86.8, 143.4], [81.7, 145.3]],
	[[82.4, 170.3], [82.3, 171.5], [82.3, 172.4], [82.3, 173.1], [82.3, 173.5], [82.4, 173.8], [82.5, 174.2], [82.9, 174.5], [83.5, 174.9], [84.6, 175.2], [86, 175.5], [86, 184.5], [83.5, 184.5], [81.2, 184.2], [78.9, 183.6], [76.7, 182.6], [74.8, 181.1], [73.1, 179.2], [71.9, 177], [71.1, 174.7], [70.6, 172.2], [70.5, 169.7]],
	[[86, 175.5], [89.1, 176.8], [90.5, 180], [89.1, 183.1], [86, 184.5]],
	[[86, 175.5], [117, 175.5], [117, 184.5], [86, 184.5]],
	[[117, 175.5], [119.7, 177.3], [121.5, 180], [119.7, 182.7], [117, 184.5]],
	[[169, 112.4], [146.2, 160.7], [135.3, 155.6], [158.9, 105.5]],
	[[169, 112.4], [170.8, 115.5], [165.4, 116.5]],
	[[146.2, 160.7], [144.8, 164.1], [144, 166.8], [143.8, 168.7], [144, 169.9], [144.2, 170.5], [144.7, 171], [145.7, 171.7], [147.5, 172.3], [150.3, 172.8], [154, 173], [154, 185], [149, 184.7], [144.6, 183.9], [140.5, 182.5], [136.9, 180.2], [134.1, 177], [132.4, 173], [131.8, 168.8], [132.3, 164.5], [133.5, 160.1], [135.3, 155.6]],
	[[154, 173], [158.2, 174.8], [160, 179], [158.2, 183.2], [154, 185]],
	[[154, 173], [177, 173], [177, 185], [154, 185]],
	[[177, 173], [180.6, 175.4], [183, 179], [180.6, 182.6], [177, 185]],
	[[177, 173], [179, 148], [177, 148], [171, 173]],
	[[133.1, 105.3], [140.1, 106.5], [145.5, 110.2], [149.5, 115.1], [152.4, 120.3], [154.8, 125.4], [157, 129.7], [159.1, 132.6], [160.9, 134], [162.9, 134.4], [166.6, 133.8], [169.4, 145.5], [161.7, 145.9], [155.1, 143.5], [150.7, 139.1], [148, 134], [146.1, 128.8], [144.5, 123.7], [142.6, 118.9], [140.4, 114.6], [137.2, 110.9], [132.7, 107.1]],
	[[166.6, 133.8], [171.1, 134.6], [173.9, 138.2], [173.1, 142.8], [169.4, 145.5]],
	[[189.5, 15], [189.5, 88], [178.5, 88], [178.5, 13]],
	[[189.5, 15], [192.2, 17], [187.5, 20]],
	[[178.5, 88], [180.7, 91.3], [184, 93.5], [187.3, 91.3], [189.5, 88]],
	[[189.5, 88], [189, 99.4], [188.1, 110.2], [186.9, 120.3], [185.3, 129.7], [183.3, 138.5], [180.8, 146.6], [178, 154], [174.7, 160.6], [170.9, 166.5], [166.6, 171.4], [165.3, 170.5], [167.9, 164.8], [170.2, 158.6], [172.3, 152], [174.1, 144.7], [175.6, 136.9], [176.9, 128.4], [177.8, 119.3], [178.3, 109.5], [178.6, 99], [178.5, 88]],
]);
