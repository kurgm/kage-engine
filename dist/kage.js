/*! kage.js v0.5.0
 *  Licensed under GPL-3.0
 *  https://github.com/kurgm/kage-engine#readme
 */
var Kage = (function () {
    'use strict';

    /**
     * A key-value store that maps a glyph name to a string of KAGE data.
     */
    var Buhin = /** @class */ (function () {
        function Buhin() {
            // initialize
            // no operation
            this.hash = {};
        }
        // method
        /**
         * Adds or updates an element with a given glyph name and KAGE data.
         * @param name The name of the glyph.
         * @param data The KAGE data.
         */
        Buhin.prototype.set = function (name, data) {
            this.hash[name] = data;
        };
        /**
         * Search the store for a specified glyph name and returns the corresponding
         * KAGE data.
         * @param name The name of the glyph to be looked up.
         * @returns The KAGE data if found, or an empty string if not found.
         */
        Buhin.prototype.search = function (name) {
            if (this.hash[name]) {
                return this.hash[name];
            }
            return ""; // no data
        };
        /**
         * Adds or updates and element with a given glyph name and KAGE data.
         * It is an alias of {@link set} method.
         * @param name The name of the glyph.
         * @param data The KAGE data.
         */
        Buhin.prototype.push = function (name, data) {
            this.set(name, data);
        };
        return Buhin;
    }());

    /**
     * Represents the rendered glyph.
     *
     * A glyph is represented as a series of {@link Polygon}'s.
     * The contained {@link Polygon}'s can be accessed by the {@link array} property.
     */
    var Polygons = /** @class */ (function () {
        function Polygons() {
            // property
            this.array = [];
        }
        // method
        /** Clears the content. */
        Polygons.prototype.clear = function () {
            this.array = [];
        };
        /**
         * Appends a new {@link Polygon} to the end of the array.
         * Nothing is performed if `polygon` is not a valid polygon.
         * @param polygon An instance of {@link Polygon} to be appended.
         */
        Polygons.prototype.push = function (polygon) {
            // only a simple check
            var minx = 200;
            var maxx = 0;
            var miny = 200;
            var maxy = 0;
            if (polygon.length < 3) {
                return;
            }
            polygon.floor();
            for (var _i = 0, _a = polygon.array; _i < _a.length; _i++) {
                var _b = _a[_i], x = _b.x, y = _b.y;
                if (x < minx) {
                    minx = x;
                }
                if (x > maxx) {
                    maxx = x;
                }
                if (y < miny) {
                    miny = y;
                }
                if (y > maxy) {
                    maxy = y;
                }
                if (isNaN(x) || isNaN(y)) {
                    return;
                }
            }
            if (minx !== maxx && miny !== maxy) {
                this.array.push(polygon);
            }
        };
        /**
         * Generates a string in SVG format that represents the rendered glyph.
         * @param curve Set to true to use `<path />` format or set to false to use
         *     `<polygon />` format. Must be set to true if the glyph was rendered with
         *     `kage.kFont.kUseCurve = true`. The `<polygon />` format is used if
         *     unspecified.
         * @returns The string representation of the rendered glyph in SVG format.
         */
        Polygons.prototype.generateSVG = function (curve) {
            var buffer = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
                + 'version="1.1" baseProfile="full" viewBox="0 0 200 200" width="200" height="200">\n';
            if (curve) {
                for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
                    var array = _a[_i].array;
                    var mode = "L";
                    buffer += '<path d="';
                    for (var j = 0; j < array.length; j++) {
                        if (j === 0) {
                            buffer += "M ";
                        }
                        else if (array[j].off) {
                            buffer += "Q ";
                            mode = "Q";
                        }
                        else if (mode === "Q" && !array[j - 1].off) {
                            buffer += "L ";
                        }
                        else if (mode === "L" && j === 1) {
                            buffer += "L ";
                        }
                        buffer += "".concat(array[j].x, ",").concat(array[j].y, " ");
                    }
                    buffer += 'Z" fill="black" />\n';
                }
            }
            else {
                buffer += '<g fill="black">\n';
                buffer += this.array.map(function (_a) {
                    var array = _a.array;
                    return "<polygon points=\"".concat(array.map(function (_a) {
                        var x = _a.x, y = _a.y;
                        return "".concat(x, ",").concat(y, " ");
                    }).join(""), "\" />\n");
                }).join("");
                buffer += "</g>\n";
            }
            buffer += "</svg>\n";
            return buffer;
        };
        /**
         * Generates a string in EPS format that represents the rendered glyph.
         * @returns The string representation of the rendered glyph in EPS format.
         */
        Polygons.prototype.generateEPS = function () {
            var buffer = "";
            buffer += "%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 -208 1024 816\n%%Pages: 0\n%%Title: Kanji glyph\n%%Creator: GlyphWiki powered by KAGE system\n%%CreationDate: ".concat(new Date().toString(), "\n%%EndComments\n%%EndProlog\n");
            for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
                var array = _a[_i].array;
                for (var j = 0; j < array.length; j++) {
                    buffer += "".concat(array[j].x * 5, " ").concat(1000 - array[j].y * 5 - 200, " ");
                    if (j === 0) {
                        buffer += "newpath\nmoveto\n";
                    }
                    else {
                        buffer += "lineto\n";
                    }
                }
                buffer += "closepath\nfill\n";
            }
            buffer += "%%EOF\n";
            return buffer;
        };
        return Polygons;
    }());
    (function () {
        if (typeof Symbol !== "undefined" && Symbol.iterator) {
            Polygons.prototype[Symbol.iterator] = function () {
                return this.array[Symbol.iterator]();
            };
        }
    })();

    /** @internal */
    // @ts-expect-error Math.hypot is not defined in es5
    var hypot = Math.hypot ? Math.hypot.bind(Math) : (function (x, y) { return Math.sqrt(x * x + y * y); });
    /**
     * Calculates a new vector with the same angle and a new magnitude.
     * @internal
     */
    function normalize(_a, magnitude) {
        var x = _a[0], y = _a[1];
        if (magnitude === void 0) { magnitude = 1; }
        if (x === 0 && y === 0) {
            // Angle is the same as Math.atan2(y, x)
            return [1 / x === Infinity ? magnitude : -magnitude, 0];
        }
        var k = magnitude / hypot(x, y);
        return [x * k, y * k];
    }
    /** @internal */
    function quadraticBezier(p1, p2, p3, t) {
        var s = 1 - t;
        return (s * s) * p1 + 2 * (s * t) * p2 + (t * t) * p3;
    }
    /**
     * Returns d/dt(quadraticBezier)
     * @internal
     */
    function quadraticBezierDeriv(p1, p2, p3, t) {
        // const s = 1 - t;
        // ds/dt = -1
        // return (-2 * s) * p1 + 2 * (s - t) * p2 + (2 * t) * p3;
        return 2 * (t * (p1 - 2 * p2 + p3) - p1 + p2);
    }
    /** @internal */
    function cubicBezier(p1, p2, p3, p4, t) {
        var s = 1 - t;
        return (s * s * s) * p1 + 3 * (s * s * t) * p2 + 3 * (s * t * t) * p3 + (t * t * t) * p4;
    }
    /**
     * Returns d/dt(cubicBezier)
     * @internal
     */
    function cubicBezierDeriv(p1, p2, p3, p4, t) {
        // const s = 1 - t;
        // ds/dt = -1
        // const ss = s * s;
        // const st = s * t;
        // const tt = t * t;
        // return (-3 * ss) * p1 + 3 * (ss - 2 * st) * p2 + 3 * (2 * st - tt) * p3 + (3 * tt) * p4;
        return 3 * (t * (t * (-p1 + 3 * p2 - 3 * p3 + p4) + 2 * (p1 - 2 * p2 + p3)) - p1 + p2);
    }
    /**
     * Find the minimum of a function by ternary search.
     * @internal
     */
    function ternarySearchMin(func, left, right, eps) {
        if (eps === void 0) { eps = 1E-5; }
        while (left + eps < right) {
            var x1 = left + (right - left) / 3;
            var x2 = right - (right - left) / 3;
            var y1 = func(x1);
            var y2 = func(x2);
            if (y1 < y2) {
                right = x2;
            }
            else {
                left = x1;
            }
        }
        return left + (right - left) / 2;
    }
    /** @internal */
    function round(v, rate) {
        if (rate === void 0) { rate = 1E8; }
        return Math.round(v * rate) / rate;
    }

    // Reference : http://www.cam.hi-ho.ne.jp/strong_warriors/teacher/chapter0{4,5}.html
    /** Cross product of two vectors */
    function cross(x1, y1, x2, y2) {
        return x1 * y2 - x2 * y1;
    }
    // class Point {
    // 	constructor(public x: number, public y: number) {
    // 	}
    // }
    // function getCrossPoint(
    // 	x11: number, y11: number, x12: number, y12: number,
    // 	x21: number, y21: number, x22: number, y22: number) {
    // 	const a1 = y12 - y11;
    // 	const b1 = x11 - x12;
    // 	const c1 = -1 * a1 * x11 - b1 * y11;
    // 	const a2 = y22 - y21;
    // 	const b2 = x21 - x22;
    // 	const c2 = -1 * a2 * x21 - b2 * y21;
    //
    // 	const temp = b1 * a2 - b2 * a1;
    // 	if (temp === 0) { // parallel
    // 		return null;
    // 	}
    // 	return new Point((c1 * b2 - c2 * b1) / temp, (a1 * c2 - a2 * c1) / temp);
    // }
    /** @internal */
    function isCross(x11, y11, x12, y12, x21, y21, x22, y22) {
        var cross_1112_2122 = cross(x12 - x11, y12 - y11, x22 - x21, y22 - y21);
        if (isNaN(cross_1112_2122)) {
            return true; // for backward compatibility...
        }
        if (cross_1112_2122 === 0) {
            // parallel
            return false; // XXX should check if segments overlap?
        }
        var cross_1112_1121 = cross(x12 - x11, y12 - y11, x21 - x11, y21 - y11);
        var cross_1112_1122 = cross(x12 - x11, y12 - y11, x22 - x11, y22 - y11);
        var cross_2122_2111 = cross(x22 - x21, y22 - y21, x11 - x21, y11 - y21);
        var cross_2122_2112 = cross(x22 - x21, y22 - y21, x12 - x21, y12 - y21);
        return round(cross_1112_1121 * cross_1112_1122, 1E5) <= 0 && round(cross_2122_2111 * cross_2122_2112, 1E5) <= 0;
    }
    /** @internal */
    function isCrossBox(x1, y1, x2, y2, bx1, by1, bx2, by2) {
        if (isCross(x1, y1, x2, y2, bx1, by1, bx2, by1)) {
            return true;
        }
        if (isCross(x1, y1, x2, y2, bx2, by1, bx2, by2)) {
            return true;
        }
        if (isCross(x1, y1, x2, y2, bx1, by2, bx2, by2)) {
            return true;
        }
        if (isCross(x1, y1, x2, y2, bx1, by1, bx1, by2)) {
            return true;
        }
        return false;
    }

    function stretch(dp, sp, p, min, max) {
        var p1;
        var p2;
        var p3;
        var p4;
        if (p < sp + 100) {
            p1 = min;
            p3 = min;
            p2 = sp + 100;
            p4 = dp + 100;
        }
        else {
            p1 = sp + 100;
            p3 = dp + 100;
            p2 = max;
            p4 = max;
        }
        return Math.floor(((p - p1) / (p2 - p1)) * (p4 - p3) + p3);
    }
    /** @internal */
    var Stroke = /** @class */ (function () {
        function Stroke(data) {
            this.a1_100 = data[0], this.a2_100 = data[1], this.a3_100 = data[2], this.x1 = data[3], this.y1 = data[4], this.x2 = data[5], this.y2 = data[6], this.x3 = data[7], this.y3 = data[8], this.x4 = data[9], this.y4 = data[10];
            this.a1_opt = Math.floor(this.a1_100 / 100);
            this.a1_100 %= 100;
            this.a2_opt = Math.floor(this.a2_100 / 100);
            this.a2_100 %= 100;
            this.a2_opt_1 = this.a2_opt % 10;
            this.a2_opt_2 = Math.floor(this.a2_opt / 10) % 10;
            this.a2_opt_3 = Math.floor(this.a2_opt / 100);
            this.a3_opt = Math.floor(this.a3_100 / 100);
            this.a3_100 %= 100;
            this.a3_opt_1 = this.a3_opt % 10;
            this.a3_opt_2 = Math.floor(this.a3_opt / 10);
        }
        Stroke.prototype.getControlSegments = function () {
            var res = [];
            var a1 = this.a1_opt === 0
                ? this.a1_100
                : 1; // ?????
            switch (a1) {
                case 0:
                case 8:
                case 9:
                    break;
                case 6:
                case 7:
                    res.unshift([this.x3, this.y3, this.x4, this.y4]);
                // falls through
                case 2:
                case 12:
                case 3:
                case 4:
                    res.unshift([this.x2, this.y2, this.x3, this.y3]);
                // falls through
                default:
                    res.unshift([this.x1, this.y1, this.x2, this.y2]);
            }
            return res;
        };
        Stroke.prototype.isCross = function (bx1, by1, bx2, by2) {
            return this.getControlSegments().some(function (_a) {
                var x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
                return (isCross(x1, y1, x2, y2, bx1, by1, bx2, by2));
            });
        };
        Stroke.prototype.isCrossBox = function (bx1, by1, bx2, by2) {
            return this.getControlSegments().some(function (_a) {
                var x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
                return (isCrossBox(x1, y1, x2, y2, bx1, by1, bx2, by2));
            });
        };
        Stroke.prototype.stretch = function (sx, sx2, sy, sy2, bminX, bmaxX, bminY, bmaxY) {
            this.x1 = stretch(sx, sx2, this.x1, bminX, bmaxX);
            this.y1 = stretch(sy, sy2, this.y1, bminY, bmaxY);
            this.x2 = stretch(sx, sx2, this.x2, bminX, bmaxX);
            this.y2 = stretch(sy, sy2, this.y2, bminY, bmaxY);
            if (!(this.a1_100 === 99 && this.a1_opt === 0)) { // always true
                this.x3 = stretch(sx, sx2, this.x3, bminX, bmaxX);
                this.y3 = stretch(sy, sy2, this.y3, bminY, bmaxY);
                this.x4 = stretch(sx, sx2, this.x4, bminX, bmaxX);
                this.y4 = stretch(sy, sy2, this.y4, bminY, bmaxY);
            }
        };
        Stroke.prototype.getBox = function () {
            var minX = Infinity;
            var minY = Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            var a1 = this.a1_opt === 0
                ? this.a1_100
                : 6; // ?????
            switch (a1) {
                default:
                    minX = Math.min(minX, this.x4);
                    maxX = Math.max(maxX, this.x4);
                    minY = Math.min(minY, this.y4);
                    maxY = Math.max(maxY, this.y4);
                // falls through
                case 2:
                case 3:
                case 4:
                    minX = Math.min(minX, this.x3);
                    maxX = Math.max(maxX, this.x3);
                    minY = Math.min(minY, this.y3);
                    maxY = Math.max(maxY, this.y3);
                // falls through
                case 1:
                case 99: // unnecessary?
                    minX = Math.min(minX, this.x1, this.x2);
                    maxX = Math.max(maxX, this.x1, this.x2);
                    minY = Math.min(minY, this.y1, this.y2);
                    maxY = Math.max(maxY, this.y1, this.y2);
                // falls through
                case 0:
            }
            return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
        };
        return Stroke;
    }());

    /** Enum of the supported fonts. */
    var KShotai;
    (function (KShotai) {
        /**
         * Mincho style font.
         * @see {@link Mincho} for its corresponding font class.
         */
        KShotai[KShotai["kMincho"] = 0] = "kMincho";
        /**
         * Gothic style font.
         * @see {@link Gothic} for its corresponding font class.
         */
        KShotai[KShotai["kGothic"] = 1] = "kGothic";
    })(KShotai || (KShotai = {}));

    /** @internal */
    function divide_curve(x1, y1, sx1, sy1, x2, y2, curve) {
        var rate = 0.5;
        var cut = Math.floor(curve.length * rate);
        var cut_rate = cut / curve.length;
        var tx1 = x1 + (sx1 - x1) * cut_rate;
        var ty1 = y1 + (sy1 - y1) * cut_rate;
        var tx2 = sx1 + (x2 - sx1) * cut_rate;
        var ty2 = sy1 + (y2 - sy1) * cut_rate;
        var tx3 = tx1 + (tx2 - tx1) * cut_rate;
        var ty3 = ty1 + (ty2 - ty1) * cut_rate;
        // must think about 0 : <0
        return {
            index: cut,
            off: [[x1, y1, tx1, ty1, tx3, ty3], [tx3, ty3, tx2, ty2, x2, y2]],
        };
    }
    // ------------------------------------------------------------------
    /** @internal */
    function find_offcurve(curve, sx, sy) {
        var _a = curve[0], nx1 = _a[0], ny1 = _a[1];
        var _b = curve[curve.length - 1], nx2 = _b[0], ny2 = _b[1];
        var area = 8;
        var minx = ternarySearchMin(function (tx) { return curve.reduce(function (diff, p, i) {
            var t = i / (curve.length - 1);
            var x = quadraticBezier(nx1, tx, nx2, t);
            return diff + Math.pow((p[0] - x), 2);
        }, 0); }, sx - area, sx + area);
        var miny = ternarySearchMin(function (ty) { return curve.reduce(function (diff, p, i) {
            var t = i / (curve.length - 1);
            var y = quadraticBezier(ny1, ty, ny2, t);
            return diff + Math.pow((p[1] - y), 2);
        }, 0); }, sy - area, sy + area);
        return [nx1, ny1, minx, miny, nx2, ny2];
    }
    // ------------------------------------------------------------------
    /** @internal */
    function generateFattenCurve(x1, y1, sx1, sy1, sx2, sy2, x2, y2, kRate, widthFunc) {
        var curve = { left: [], right: [] };
        var isQuadratic = sx1 === sx2 && sy1 === sy2;
        var xFunc, yFunc, ixFunc, iyFunc;
        if (isQuadratic) {
            // Spline
            xFunc = function (t) { return quadraticBezier(x1, sx1, x2, t); };
            yFunc = function (t) { return quadraticBezier(y1, sy1, y2, t); };
            ixFunc = function (t) { return quadraticBezierDeriv(x1, sx1, x2, t); };
            iyFunc = function (t) { return quadraticBezierDeriv(y1, sy1, y2, t); };
        }
        else { // Bezier
            xFunc = function (t) { return cubicBezier(x1, sx1, sx2, x2, t); };
            yFunc = function (t) { return cubicBezier(y1, sy1, sy2, y2, t); };
            ixFunc = function (t) { return cubicBezierDeriv(x1, sx1, sx2, x2, t); };
            iyFunc = function (t) { return cubicBezierDeriv(y1, sy1, sy2, y2, t); };
        }
        for (var tt = 0; tt <= 1000; tt += kRate) {
            var t = tt / 1000;
            // calculate a dot
            var x = xFunc(t);
            var y = yFunc(t);
            // KATAMUKI of vector by BIBUN
            var ix = ixFunc(t);
            var iy = iyFunc(t);
            var width = widthFunc(t);
            // line SUICHOKU by vector
            var _a = (round(ix) === 0 && round(iy) === 0)
                ? [-width, 0] // ?????
                : normalize([-iy, ix], width), ia = _a[0], ib = _a[1];
            curve.left.push([x - ia, y - ib]);
            curve.right.push([x + ia, y + ib]);
        }
        return curve;
    }

    /**
     * Represents a single contour of a rendered glyph.
     *
     * A contour that a Polygon represents is a closed curve made up of straight line
     * segments or quadratic Bézier curve segments. A Polygon is represented as a
     * series of {@link Point}'s, each of which is an on-curve point or an off-curve
     * point. Two consecutive on-curve points define a line segment. A sequence of
     * two on-curve points with an off-curve point in between defines a curve segment.
     * The last point and the first point of a Polygon define a line segment that closes
     * the loop (if the two points differ).
     */
    var Polygon = /** @class */ (function () {
        function Polygon(param) {
            this._precision = 10;
            // property
            this._array = [];
            // initialize
            if (param) {
                if (typeof param === "number") {
                    for (var i = 0; i < param; i++) {
                        this.push(0, 0, false);
                    }
                }
                else {
                    for (var _i = 0, param_1 = param; _i < param_1.length; _i++) {
                        var _a = param_1[_i], x = _a.x, y = _a.y, off = _a.off;
                        this.push(x, y, off);
                    }
                }
            }
        }
        Object.defineProperty(Polygon.prototype, "array", {
            /**
             * A read-only array consisting of the points in this contour.
             *
             * Modifications to this array do NOT affect the contour;
             * call {@link set} method to modify the contour.
             *
             * @example
             * ```ts
             * for (const point of polygon.array) {
             * 	// ...
             * }
             * ```
             *
             * Note that the computation of coordinates of all the points is performed
             * every time this property is accessed. To get a better performance, consider
             * caching the result in a variable when you need to access the array repeatedly.
             * ```ts
             * // DO:
             * const array = polygon.array;
             * for (let i = 0; i < array.length; i++) {
             * 	const point = array[i];
             * 	// ...
             * }
             *
             * // DON'T:
             * for (let i = 0; i < polygon.array.length; i++) {
             * 	const point = polygon.array[i];
             * 	// ...
             * }
             * ```
             *
             * @see {@link Polygon.length} is faster if you only need the length.
             * @see {@link Polygon.get} is faster if you need just one element.
             */
            get: function () {
                var _this = this;
                return this._array.map(function (_, i) { return _this.get(i); });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "length", {
            /** The number of points in this contour. */
            // Added by @kurgm
            get: function () {
                return this._array.length;
            },
            enumerable: false,
            configurable: true
        });
        // method
        /**
         * Appends a point at the end of its contour.
         * @param x The x-coordinate of the appended point.
         * @param y The y-coordiante of the appended point.
         * @param off Whether the appended point is an off-curve point. Defaults to `false`.
         */
        Polygon.prototype.push = function (x, y, off) {
            if (off === void 0) { off = false; }
            this._array.push(this.createInternalPoint(x, y, off));
        };
        /**
         * Appends a point at the end of its contour.
         * @param point The appended point.
         * @internal
         */
        // Added by @kurgm
        Polygon.prototype.pushPoint = function (point) {
            this.push(point.x, point.y, point.off);
        };
        /**
         * Mutates a point in its contour.
         * @param index The index in the contour of the point to be mutated.
         * @param x The new x-coordinate of the point.
         * @param y The new y-coordinate of the point.
         * @param off Whether the new point is an off-curve point. Defaults to `false`.
         */
        Polygon.prototype.set = function (index, x, y, off) {
            if (off === void 0) { off = false; }
            this._array[index] = this.createInternalPoint(x, y, off);
        };
        /**
         * Mutates a point in its contour.
         * @param index The index in the contour of the point to be mutated.
         * @param point A point of the new coordinate values. Omitting `off` property makes
         *     the point an on-curve point (as if `off: false` were specified).
         * @internal
         */
        // Added by @kurgm
        Polygon.prototype.setPoint = function (index, point) {
            this.set(index, point.x, point.y, point.off);
        };
        /**
         * Retrieves a point in its contour. If the index is out of bounds,
         * throws an error.
         * @param index The index in the contour of the point to be retrieved.
         * @returns A read-only point object. Modifications made to the returned
         *     object do NOT affect the values of the point in the contour;
         *     call {@link set} method to modify the contour.
         * @example
         * ```ts
         * for (let i = 0; i < polygon.length; i++) {
         * 	const point = polygon.get(i);
         * 	// ...
         * }
         * ```
         */
        // Added by @kurgm
        Polygon.prototype.get = function (index) {
            var _a = this._array[index], x = _a.x, y = _a.y, off = _a.off;
            if (this._precision === 0) {
                return { x: x, y: y, off: off };
            }
            return {
                x: x / this._precision,
                y: y / this._precision,
                off: off,
            };
        };
        /**
         * Reverses the points in its contour.
         */
        Polygon.prototype.reverse = function () {
            this._array.reverse();
        };
        /**
         * Appends the points in the contour of another {@link Polygon} at the end of
         * this contour. The other Polygon is not mutated.
         * @param poly The other {@link Polygon} to be appended.
         */
        Polygon.prototype.concat = function (poly) {
            if (this._precision !== poly._precision) {
                throw new TypeError("Cannot concat polygon's with different precisions");
            }
            this._array = this._array.concat(poly._array);
        };
        /**
         * Removes the first point in its contour. If there are no points in the contour,
         * nothing is performed.
         */
        Polygon.prototype.shift = function () {
            this._array.shift();
        };
        /**
         * Inserts a new point at the start of its contour.
         * @param x The x-coordinate of the inserted point.
         * @param y The y-coordiante of the inserted point.
         * @param off Whether the inserted point is an off-curve point. Defaults to `false`.
         */
        Polygon.prototype.unshift = function (x, y, off) {
            if (off === void 0) { off = false; }
            this._array.unshift(this.createInternalPoint(x, y, off));
        };
        /**
         * Creates a deep copy of this Polygon.
         * @returns A new {@link Polygon} instance.
         */
        // Added by @kurgm
        Polygon.prototype.clone = function () {
            return new Polygon(this.array);
        };
        Polygon.prototype.createInternalPoint = function (x, y, off) {
            if (off === void 0) { off = false; }
            if (this._precision === 0) {
                return { x: x, y: y, off: off };
            }
            return {
                x: x * this._precision,
                y: y * this._precision,
                off: off,
            };
        };
        /**
         * Translates the whole polygon by the given amount.
         * @param dx The x-amount of translation.
         * @param dy The y-amount of translation.
         * @returns This object (for chaining).
         * @internal
         */
        // Added by @kurgm
        Polygon.prototype.translate = function (dx, dy) {
            if (this._precision !== 0) {
                dx *= this._precision;
                dy *= this._precision;
            }
            for (var _i = 0, _a = this._array; _i < _a.length; _i++) {
                var point = _a[_i];
                point.x += dx;
                point.y += dy;
            }
            return this;
        };
        /**
         * Flips the sign of the x-coordinate of each point in the contour.
         * @returns This object (for chaining).
         * @internal
         */
        // Added by @kurgm
        Polygon.prototype.reflectX = function () {
            for (var _i = 0, _a = this._array; _i < _a.length; _i++) {
                var point = _a[_i];
                point.x *= -1;
            }
            return this;
        };
        /**
         * Flips the sign of the y-coordinate of each point in the contour.
         * @returns This object (for chaining).
         * @internal
         */
        // Added by @kurgm
        Polygon.prototype.reflectY = function () {
            for (var _i = 0, _a = this._array; _i < _a.length; _i++) {
                var point = _a[_i];
                point.y *= -1;
            }
            return this;
        };
        /**
         * Rotates the whole polygon by 90 degrees clockwise.
         * @returns This object (for chaining).
         * @internal
         */
        // Added by @kurgm
        Polygon.prototype.rotate90 = function () {
            for (var _i = 0, _a = this._array; _i < _a.length; _i++) {
                var point = _a[_i];
                var x = point.x, y = point.y;
                point.x = -y;
                point.y = x;
            }
            return this;
        };
        /**
         * Rotates the whole polygon by 180 degrees.
         * {@link scale}(-1).
         * @returns This object (for chaining).
         * @internal
         */
        // Added by @kurgm
        Polygon.prototype.rotate180 = function () {
            for (var _i = 0, _a = this._array; _i < _a.length; _i++) {
                var point = _a[_i];
                point.x *= -1;
                point.y *= -1;
            }
            return this;
        };
        /**
         * Rotates the whole polygon by 270 degrees clockwise.
         * @returns This object (for chaining).
         * @internal
         */
        // Added by @kurgm
        Polygon.prototype.rotate270 = function () {
            for (var _i = 0, _a = this._array; _i < _a.length; _i++) {
                var point = _a[_i];
                var x = point.x, y = point.y;
                point.x = y;
                point.y = -x;
            }
            return this;
        };
        /**
         * @returns This object (for chaining).
         * @internal
         */
        // Added by @kurgm
        Polygon.prototype.floor = function () {
            if (this._precision === 0) {
                return this;
            }
            for (var _i = 0, _a = this._array; _i < _a.length; _i++) {
                var point = _a[_i];
                var x = point.x, y = point.y;
                point.x = Math.floor(x);
                point.y = Math.floor(y);
            }
            return this;
        };
        return Polygon;
    }());
    (function () {
        if (typeof Symbol !== "undefined" && Symbol.iterator) {
            Polygon.prototype[Symbol.iterator] = function () {
                var _this = this;
                var i = 0;
                return {
                    next: function () {
                        if (i < _this._array.length) {
                            return {
                                done: false,
                                value: _this.get(i++),
                            };
                        }
                        return { done: true, value: undefined };
                    },
                };
            };
        }
    })();

    /**
     * Calculates global coordinates from local coordinates around a pen
     * using its position and direction.
     * @internal
     */
    var Pen = /** @class */ (function () {
        function Pen(x, y) {
            this.cos_theta = 1;
            this.sin_theta = 0;
            this.x = x;
            this.y = y;
        }
        Pen.prototype.setMatrix2 = function (cos_theta, sin_theta) {
            this.cos_theta = cos_theta;
            this.sin_theta = sin_theta;
            return this;
        };
        Pen.prototype.setLeft = function (otherX, otherY) {
            var _a = normalize([otherX - this.x, otherY - this.y]), dx = _a[0], dy = _a[1];
            // Given: rotate(theta)((-1, 0)) = (dx, dy)
            // Determine: (cos theta, sin theta) = rotate(theta)((1, 0))
            // = (-dx, -dy)
            this.setMatrix2(-dx, -dy);
            return this;
        };
        Pen.prototype.setRight = function (otherX, otherY) {
            var _a = normalize([otherX - this.x, otherY - this.y]), dx = _a[0], dy = _a[1];
            this.setMatrix2(dx, dy);
            return this;
        };
        Pen.prototype.setUp = function (otherX, otherY) {
            var _a = normalize([otherX - this.x, otherY - this.y]), dx = _a[0], dy = _a[1];
            // Given: rotate(theta)((0, -1)) = (dx, dy)
            // Determine: (cos theta, sin theta) = rotate(theta)((1, 0))
            // = (-dy, dx)
            this.setMatrix2(-dy, dx);
            return this;
        };
        Pen.prototype.setDown = function (otherX, otherY) {
            var _a = normalize([otherX - this.x, otherY - this.y]), dx = _a[0], dy = _a[1];
            this.setMatrix2(dy, -dx);
            return this;
        };
        Pen.prototype.move = function (localDx, localDy) {
            var _a;
            (_a = this.getPoint(localDx, localDy), this.x = _a.x, this.y = _a.y);
            return this;
        };
        Pen.prototype.getPoint = function (localX, localY, off) {
            if (off === void 0) { off = false; }
            return {
                x: this.x + this.cos_theta * localX + -this.sin_theta * localY,
                y: this.y + this.sin_theta * localX + this.cos_theta * localY,
                off: off,
            };
        };
        Pen.prototype.getPolygon = function (localPoints) {
            var _this = this;
            return new Polygon(localPoints.map(function (_a) {
                var x = _a.x, y = _a.y, off = _a.off;
                return _this.getPoint(x, y, off);
            }));
        };
        return Pen;
    }());

    function cdDrawCurveU$1(font, polygons, x1_, y1_, sx1, sy1, sx2, sy2, x2_, y2_, ta1, ta2, opt1, haneAdjustment, opt3, opt4) {
        var a1 = ta1;
        var a2 = ta2;
        var kMinWidthT = font.kMinWidthT - opt1 / 2;
        var x1 = x1_;
        var y1 = y1_;
        var delta1 = undefined;
        switch (a1 % 100) {
            case 0:
            case 7:
            case 27:
                delta1 = -1 * font.kMinWidthY * 0.5;
                break;
            case 1:
            case 2: // ... must be 32
            case 6:
            case 22:
            case 32: // changed
                delta1 = 0;
                break;
            case 12:
                // case 32:
                delta1 = font.kMinWidthY;
                break;
        }
        if (delta1 === undefined) {
            x1 = y1 = undefined; // ????? (was NaN in original code)
        }
        else if (delta1 !== 0) {
            var _a = (x1 === sx1 && y1 === sy1)
                ? [0, delta1] // ?????
                : normalize([x1 - sx1, y1 - sy1], delta1), dx1 = _a[0], dy1 = _a[1];
            x1 += dx1;
            y1 += dy1;
        }
        var cornerOffset = 0;
        if (x1 !== undefined && y1 !== undefined && (a1 === 22 || a1 === 27) && a2 === 7 && kMinWidthT > 6) {
            var contourLength = hypot(sx1 - x1, sy1 - y1) + hypot(sx2 - sx1, sy2 - sy1) + hypot(x2_ - sx2, y2_ - sy2);
            if (contourLength < 100) {
                cornerOffset = (kMinWidthT - 6) * ((100 - contourLength) / 100);
                x1 += cornerOffset;
            }
        }
        var x2 = x2_;
        var y2 = y2_;
        var delta2;
        switch (a2 % 100) {
            case 0:
            case 1:
            case 7:
            case 9:
            case 15: // it can change to 15->5
            case 14: // it can change to 14->4
            case 17: // no need
            case 5:
                delta2 = 0;
                break;
            case 8: // get shorten for tail's circle
                delta2 = -1 * kMinWidthT * 0.5;
                break;
            default:
                delta2 = delta1; // ?????
                break;
        }
        if (delta2 === undefined) {
            x2 = y2 = undefined; // ????? (was NaN in original code)
        }
        else if (delta2 !== 0) {
            var _b = (sx2 === x2 && sy2 === y2)
                ? [0, -delta2] // ?????
                : normalize([x2 - sx2, y2 - sy2], delta2), dx2 = _b[0], dy2 = _b[1];
            x2 += dx2;
            y2 += dy2;
        }
        if (x1 !== undefined && y1 !== undefined && x2 !== undefined && y2 !== undefined) {
            drawCurveBody$1(font, polygons, x1, y1, sx1, sy1, sx2, sy2, x2, y2, a1, a2, kMinWidthT, opt3, opt4);
        }
        if (x1 !== undefined && y1 !== undefined) {
            var isUpToBottom = y2 === undefined ? false : y1 <= y2;
            drawCurveHead(polygons, font, x1, y1, sx1, sy1, a1, kMinWidthT, isUpToBottom, cornerOffset);
        }
        if (x2 !== undefined && y2 !== undefined) {
            var isBottomToUp = y1 === undefined ? false : y2 <= y1;
            drawCurveTail(polygons, font, sx2, sy2, x2, y2, a1, a2, kMinWidthT, haneAdjustment, opt4, isBottomToUp);
        }
    }
    function drawCurveBody$1(font, polygons, x1, y1, sx1, sy1, sx2, sy2, x2, y2, a1, a2, kMinWidthT, opt3, opt4) {
        var isQuadratic = sx1 === sx2 && sy1 === sy2;
        // ---------------------------------------------------------------
        if (isQuadratic && font.kUseCurve) {
            // Spline
            // generating fatten curve -- begin
            var hosomi_1 = 0.5;
            var deltadFunc_1 = (a1 === 7 && a2 === 0) // L2RD: fatten
                ? function (t) { return Math.pow(t, hosomi_1) * 1.1; } // should be font.kL2RDfatten ?
                : (a1 === 7)
                    ? function (t) { return Math.pow(t, hosomi_1); }
                    : (a2 === 7)
                        ? function (t) { return Math.pow((1 - t), hosomi_1); }
                        : (opt3 > 0) // should be (opt3 > 0 || opt4 > 0) ?
                            ? function (t) { return 1 - opt3 / 2 / (kMinWidthT - opt4 / 2) + opt3 / 2 / (kMinWidthT - opt4) * t; } // ??????
                            : function () { return 1; };
            var _a = generateFattenCurve(x1, y1, sx1, sy1, sx1, sy1, x2, y2, 10, function (t) {
                var deltad = deltadFunc_1(t);
                if (deltad < 0.15) {
                    deltad = 0.15;
                }
                return kMinWidthT * deltad;
            }), curveL = _a.left, curveR = _a.right; // L and R
            var _b = divide_curve(x1, y1, sx1, sy1, x2, y2, curveL), _c = _b.off, offL1 = _c[0], offL2 = _c[1], indexL = _b.index;
            var curveL1 = curveL.slice(0, indexL + 1);
            var curveL2 = curveL.slice(indexL);
            var _d = divide_curve(x1, y1, sx1, sy1, x2, y2, curveR), _e = _d.off, offR1 = _e[0], offR2 = _e[1], indexR = _d.index;
            var ncl1 = find_offcurve(curveL1, offL1[2], offL1[3]);
            var ncl2 = find_offcurve(curveL2, offL2[2], offL2[3]);
            var poly = new Polygon([
                { x: ncl1[0], y: ncl1[1] },
                { x: ncl1[2], y: ncl1[3], off: true },
                { x: ncl1[4], y: ncl1[5] },
                { x: ncl2[2], y: ncl2[3], off: true },
                { x: ncl2[4], y: ncl2[5] },
            ]);
            var poly2 = new Polygon([
                { x: curveR[0][0], y: curveR[0][1] },
                {
                    x: offR1[2] - (ncl1[2] - offL1[2]),
                    y: offR1[3] - (ncl1[3] - offL1[3]),
                    off: true,
                },
                { x: curveR[indexR][0], y: curveR[indexR][1] },
                {
                    x: offR2[2] - (ncl2[2] - offL2[2]),
                    y: offR2[3] - (ncl2[3] - offL2[3]),
                    off: true,
                },
                { x: curveR[curveR.length - 1][0], y: curveR[curveR.length - 1][1] },
            ]);
            poly2.reverse();
            poly.concat(poly2);
            polygons.push(poly);
            // generating fatten curve -- end
        }
        else {
            var hosomi_2 = 0.5;
            if (hypot(x2 - x1, y2 - y1) < 50) {
                hosomi_2 += 0.4 * (1 - hypot(x2 - x1, y2 - y1) / 50);
            }
            var deltadFunc_2 = (a1 === 7 || a1 === 27) && a2 === 0 // L2RD: fatten
                ? function (t) { return Math.pow(t, hosomi_2) * font.kL2RDfatten; }
                : (a1 === 7 || a1 === 27)
                    ? (isQuadratic) // ?????
                        ? function (t) { return Math.pow(t, hosomi_2); }
                        : function (t) { return Math.pow((Math.pow(t, hosomi_2)), 0.7); } // make fatten
                    : a2 === 7
                        ? function (t) { return Math.pow((1 - t), hosomi_2); }
                        : isQuadratic && (opt3 > 0 || opt4 > 0) // ?????
                            ? function (t) { return ((font.kMinWidthT - opt3 / 2) - (opt4 - opt3) / 2 * t) / font.kMinWidthT; }
                            : function () { return 1; };
            var _f = generateFattenCurve(x1, y1, sx1, sy1, sx2, sy2, x2, y2, font.kRate, function (t) {
                var deltad = deltadFunc_2(t);
                if (deltad < 0.15) {
                    deltad = 0.15;
                }
                return kMinWidthT * deltad;
            }), left = _f.left, right = _f.right;
            var poly = new Polygon();
            var poly2 = new Polygon();
            // copy to polygon structure
            for (var _i = 0, left_1 = left; _i < left_1.length; _i++) {
                var _g = left_1[_i], x = _g[0], y = _g[1];
                poly.push(x, y);
            }
            for (var _h = 0, right_1 = right; _h < right_1.length; _h++) {
                var _j = right_1[_h], x = _j[0], y = _j[1];
                poly2.push(x, y);
            }
            // suiheisen ni setsuzoku
            if (a1 === 132 || a1 === 22 && (isQuadratic ? (y1 > y2) : (x1 > sx1))) { // ?????
                poly.floor();
                poly2.floor();
                for (var index = 0, length = poly2.length; index + 1 < length; index++) {
                    var point1 = poly2.get(index);
                    var point2 = poly2.get(index + 1);
                    if (point1.y <= y1 && y1 <= point2.y) {
                        var newx1 = point2.x + (point1.x - point2.x) * (y1 - point2.y) / (point1.y - point2.y);
                        var newy1 = y1;
                        var point3 = poly.get(0);
                        var point4 = poly.get(1);
                        var newx2 = (a1 === 132) // ?????
                            ? point3.x + (point4.x - point3.x) * (y1 - point3.y) / (point4.y - point3.y)
                            : point3.x + (point4.x - point3.x + 1) * (y1 - point3.y) / (point4.y - point3.y); // "+ 1"?????
                        var newy2 = (a1 === 132) // ?????
                            ? y1
                            : y1 + 1; // "+ 1"?????
                        for (var i = 0; i < index; i++) {
                            poly2.shift();
                        }
                        poly2.set(0, newx1, newy1);
                        poly.unshift(newx2, newy2);
                        break;
                    }
                }
            }
            poly2.reverse();
            poly.concat(poly2);
            polygons.push(poly);
        }
    }
    function drawCurveHead(polygons, font, x1, y1, sx1, sy1, a1, kMinWidthT, isUpToBottom, cornerOffset) {
        // process for head of stroke
        switch (a1) {
            case 12: {
                var pen1 = new Pen(x1, y1);
                if (x1 !== sx1) { // ?????
                    pen1.setDown(sx1, sy1);
                }
                var poly = pen1.getPolygon([
                    { x: -kMinWidthT, y: 0 },
                    { x: +kMinWidthT, y: 0 },
                    { x: -kMinWidthT, y: -kMinWidthT },
                ]);
                polygons.push(poly);
                break;
            }
            case 0: {
                if (isUpToBottom) { // from up to bottom
                    var pen1 = new Pen(x1, y1);
                    if (x1 !== sx1) { // ?????
                        pen1.setDown(sx1, sy1);
                    }
                    var type = Math.atan2(Math.abs(y1 - sy1), Math.abs(x1 - sx1)) / Math.PI * 2 - 0.4;
                    if (type > 0) {
                        type *= 2;
                    }
                    else {
                        type *= 16;
                    }
                    var pm = type < 0 ? -1 : 1;
                    var poly = pen1.getPolygon([
                        { x: -kMinWidthT, y: 1 },
                        { x: +kMinWidthT, y: 0 },
                        { x: -pm * kMinWidthT, y: -font.kMinWidthY * Math.abs(type) },
                    ]);
                    // if(x1 > x2){
                    //  poly.reverse();
                    // }
                    polygons.push(poly);
                    // beginning of the stroke
                    var move = type < 0 ? -type * font.kMinWidthY : 0;
                    var poly2 = pen1.getPolygon((x1 === sx1 && y1 === sy1) // ?????
                        ? [
                            { x: kMinWidthT, y: -move },
                            { x: kMinWidthT * 1.5, y: font.kMinWidthY - move },
                            { x: kMinWidthT - 2, y: font.kMinWidthY * 2 + 1 },
                        ]
                        : [
                            { x: kMinWidthT, y: -move },
                            { x: kMinWidthT * 1.5, y: font.kMinWidthY - move * 1.2 },
                            { x: kMinWidthT - 2, y: font.kMinWidthY * 2 - move * 0.8 + 1 },
                            // if(x1 < x2){
                            //  poly2.reverse();
                            // }
                        ]);
                    polygons.push(poly2);
                }
                else { // bottom to up
                    var pen1 = new Pen(x1, y1);
                    if (x1 === sx1) {
                        pen1.setMatrix2(0, 1); // ?????
                    }
                    else {
                        pen1.setRight(sx1, sy1);
                    }
                    var poly = pen1.getPolygon([
                        { x: 0, y: +kMinWidthT },
                        { x: 0, y: -kMinWidthT },
                        { x: -font.kMinWidthY, y: -kMinWidthT },
                    ]);
                    // if(x1 < x2){
                    //  poly.reverse();
                    // }
                    polygons.push(poly);
                    // beginning of the stroke
                    var poly2 = pen1.getPolygon([
                        { x: 0, y: +kMinWidthT },
                        { x: +font.kMinWidthY, y: +kMinWidthT * 1.5 },
                        { x: +font.kMinWidthY * 3, y: +kMinWidthT * 0.5 },
                    ]);
                    // if(x1 < x2){
                    //  poly2.reverse();
                    // }
                    polygons.push(poly2);
                }
                break;
            }
            case 22:
            case 27: { // box's up-right corner, any time same degree
                var poly = new Pen(x1 - cornerOffset, y1).getPolygon([
                    { x: -kMinWidthT, y: -font.kMinWidthY },
                    { x: 0, y: -font.kMinWidthY - font.kWidth },
                    { x: +kMinWidthT + font.kWidth, y: +font.kMinWidthY },
                    { x: +kMinWidthT, y: +kMinWidthT - 1 },
                ].concat((a1 === 27)
                    ? [
                        { x: 0, y: +kMinWidthT + 2 },
                        { x: 0, y: 0 },
                    ]
                    : [
                        { x: -kMinWidthT, y: +kMinWidthT + 4 },
                    ]));
                polygons.push(poly);
                break;
            }
        }
    }
    function drawCurveTail(polygons, font, sx2, sy2, x2, y2, a1, a2, kMinWidthT, haneAdjustment, opt4, isBottomToUp) {
        // process for tail
        switch (a2) {
            case 1:
            case 8:
            case 15: { // the last filled circle ... it can change 15->5
                var kMinWidthT2 = font.kMinWidthT - opt4 / 2;
                var pen2 = new Pen(x2, y2);
                if (sx2 === x2) {
                    pen2.setMatrix2(0, 1); // ?????
                }
                else if (sy2 !== y2) { // ?????
                    pen2.setLeft(sx2, sy2);
                }
                var poly = pen2.getPolygon((font.kUseCurve)
                    ? // by curve path
                        [
                            { x: 0, y: -kMinWidthT2 },
                            { x: +kMinWidthT2 * 0.9, y: -kMinWidthT2 * 0.9, off: true },
                            { x: +kMinWidthT2, y: 0 },
                            { x: +kMinWidthT2 * 0.9, y: +kMinWidthT2 * 0.9, off: true },
                            { x: 0, y: +kMinWidthT2 },
                        ]
                    : // by polygon
                        [
                            { x: 0, y: -kMinWidthT2 },
                            { x: +kMinWidthT2 * 0.7, y: -kMinWidthT2 * 0.7 },
                            { x: +kMinWidthT2, y: 0 },
                            { x: +kMinWidthT2 * 0.7, y: +kMinWidthT2 * 0.7 },
                            { x: 0, y: +kMinWidthT2 },
                        ]);
                if (sx2 === x2) {
                    poly.reverse();
                }
                polygons.push(poly);
                if (a2 === 15) { // jump up ... it can change 15->5
                    // anytime same degree
                    var pen2_r = new Pen(x2, y2);
                    if (isBottomToUp) {
                        pen2_r.setMatrix2(-1, 0);
                    }
                    var poly_1 = pen2_r.getPolygon([
                        { x: 0, y: -kMinWidthT + 1 },
                        { x: +2, y: -kMinWidthT - font.kWidth * 5 },
                        { x: 0, y: -kMinWidthT - font.kWidth * 5 },
                        { x: -kMinWidthT, y: -kMinWidthT + 1 },
                    ]);
                    polygons.push(poly_1);
                }
                break;
            }
            case 0:
                if (!(a1 === 7 || a1 === 27)) {
                    break;
                }
            // fall through
            case 9: { // Math.sinnyu & L2RD Harai ... no need for a2=9
                var type = Math.atan2(Math.abs(y2 - sy2), Math.abs(x2 - sx2)) / Math.PI * 2 - 0.6;
                if (type > 0) {
                    type *= 8;
                }
                else {
                    type *= 3;
                }
                var pm = type < 0 ? -1 : 1;
                var pen2 = new Pen(x2, y2);
                if (sy2 === y2) {
                    pen2.setMatrix2(1, 0); // ?????
                }
                else if (sx2 === x2) {
                    pen2.setMatrix2(0, y2 > sy2 ? -1 : 1); // for backward compatibility...
                }
                else {
                    pen2.setLeft(sx2, sy2);
                }
                var poly = pen2.getPolygon([
                    { x: 0, y: +kMinWidthT * font.kL2RDfatten },
                    { x: 0, y: -kMinWidthT * font.kL2RDfatten },
                    { x: Math.abs(type) * kMinWidthT * font.kL2RDfatten, y: pm * kMinWidthT * font.kL2RDfatten },
                ]);
                polygons.push(poly);
                break;
            }
            case 14: { // jump to left, allways go left
                var jumpFactor = kMinWidthT > 6 ? 6.0 / kMinWidthT : 1.0;
                var haneLength = font.kWidth * 4 * Math.min(1 - haneAdjustment / 10, Math.pow((kMinWidthT / font.kMinWidthT), 3)) * jumpFactor;
                var poly = new Pen(x2, y2).getPolygon([
                    { x: 0, y: 0 },
                    { x: 0, y: -kMinWidthT },
                    { x: -haneLength, y: -kMinWidthT },
                    { x: -haneLength, y: -kMinWidthT * 0.5 },
                ]);
                // poly.reverse();
                polygons.push(poly);
                break;
            }
        }
    }
    function cdDrawBezier$1(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2, opt1, haneAdjustment, opt3, opt4) {
        cdDrawCurveU$1(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2, opt1, haneAdjustment, opt3, opt4);
    }
    function cdDrawCurve$1(font, polygons, x1, y1, x2, y2, x3, y3, a1, a2, opt1, haneAdjustment, opt3, opt4) {
        cdDrawCurveU$1(font, polygons, x1, y1, x2, y2, x2, y2, x3, y3, a1, a2, opt1, haneAdjustment, opt3, opt4);
    }
    function cdDrawLine$1(font, polygons, tx1, ty1, tx2, ty2, ta1, ta2, opt1, urokoAdjustment, kakatoAdjustment) {
        var x1 = tx1;
        var y1 = ty1;
        var x2 = tx2;
        var y2 = ty2;
        var a1 = ta1;
        var a2 = ta2;
        var kMinWidthT = font.kMinWidthT - opt1 / 2;
        if (x1 === x2 || y1 !== y2 && (x1 > x2 || Math.abs(y2 - y1) >= Math.abs(x2 - x1) || a1 === 6 || a2 === 6)) {
            // if TATE stroke, use y-axis
            // for others, use x-axis
            // KAKUDO GA FUKAI or KAGI NO YOKO BOU
            var _a = (x1 === x2)
                ? [0, 1] // ?????
                : normalize([x2 - x1, y2 - y1]), cosrad = _a[0], sinrad = _a[1];
            var pen1 = new Pen(x1, y1);
            var pen2 = new Pen(x2, y2);
            // if (x1 !== x2) { // ?????
            // 	pen1.setDown(x2, y2);
            // 	pen2.setUp(x1, y1);
            // }
            pen1.setMatrix2(sinrad, -cosrad);
            pen2.setMatrix2(sinrad, -cosrad);
            var poly0 = new Polygon(4);
            switch (a1) {
                case 0:
                    poly0.setPoint(0, pen1.getPoint(kMinWidthT, font.kMinWidthY / 2));
                    poly0.setPoint(3, pen1.getPoint(-kMinWidthT, -font.kMinWidthY / 2));
                    break;
                case 1:
                case 6: // ... no need
                    poly0.setPoint(0, pen1.getPoint(kMinWidthT, 0));
                    poly0.setPoint(3, pen1.getPoint(-kMinWidthT, 0));
                    break;
                case 12:
                    poly0.setPoint(0, pen1.getPoint(kMinWidthT, -font.kMinWidthY));
                    poly0.setPoint(3, pen1.getPoint(-kMinWidthT, -font.kMinWidthY - kMinWidthT));
                    break;
                case 22:
                    if (x1 === x2) {
                        poly0.set(0, x1 + kMinWidthT, y1);
                        poly0.set(3, x1 - kMinWidthT, y1);
                    }
                    else {
                        var v = x1 > x2 ? -1 : 1;
                        // TODO: why " + v", " + 1" ???
                        poly0.set(0, x1 + (kMinWidthT + v) / sinrad, y1 + 1);
                        poly0.set(3, x1 - kMinWidthT / sinrad, y1);
                    }
                    break;
                case 32:
                    if (x1 === x2) {
                        poly0.set(0, x1 + kMinWidthT, y1 - font.kMinWidthY);
                        poly0.set(3, x1 - kMinWidthT, y1 - font.kMinWidthY);
                    }
                    else {
                        poly0.set(0, x1 + kMinWidthT / sinrad, y1);
                        poly0.set(3, x1 - kMinWidthT / sinrad, y1);
                    }
                    break;
            }
            switch (a2) {
                case 0:
                    if (a1 === 6) { // KAGI's tail ... no need
                        poly0.setPoint(1, pen2.getPoint(kMinWidthT, 0));
                        poly0.setPoint(2, pen2.getPoint(-kMinWidthT, 0));
                    }
                    else {
                        poly0.setPoint(1, pen2.getPoint(kMinWidthT, -kMinWidthT / 2));
                        poly0.setPoint(2, pen2.getPoint(-kMinWidthT, kMinWidthT / 2));
                    }
                    break;
                case 5:
                    if (x1 === x2) {
                        break;
                    }
                // falls through
                case 1: // is needed?
                    poly0.setPoint(1, pen2.getPoint(kMinWidthT, 0));
                    poly0.setPoint(2, pen2.getPoint(-kMinWidthT, 0));
                    break;
                case 13:
                    poly0.setPoint(1, pen2.getPoint(kMinWidthT, font.kAdjustKakatoL[kakatoAdjustment]));
                    poly0.setPoint(2, pen2.getPoint(-kMinWidthT, font.kAdjustKakatoL[kakatoAdjustment] + kMinWidthT));
                    break;
                case 23:
                    poly0.setPoint(1, pen2.getPoint(kMinWidthT, font.kAdjustKakatoR[kakatoAdjustment]));
                    poly0.setPoint(2, pen2.getPoint(-kMinWidthT, font.kAdjustKakatoR[kakatoAdjustment] + kMinWidthT));
                    break;
                case 24: // for T/H design
                case 32:
                    if (x1 === x2) {
                        poly0.set(1, x2 + kMinWidthT, y2 + font.kMinWidthY);
                        poly0.set(2, x2 - kMinWidthT, y2 + font.kMinWidthY);
                    }
                    else {
                        poly0.set(1, x2 + kMinWidthT / sinrad, y2);
                        poly0.set(2, x2 - kMinWidthT / sinrad, y2);
                    }
                    break;
            }
            polygons.push(poly0);
            switch (a2) {
                case 24: { // for T design
                    var poly = new Pen(x2, y2).getPolygon([
                        { x: 0, y: +font.kMinWidthY },
                        (x1 === x2) // ?????
                            ? { x: +kMinWidthT, y: -font.kMinWidthY * 3 }
                            : { x: +kMinWidthT * 0.5, y: -font.kMinWidthY * 4 },
                        { x: +kMinWidthT * 2, y: -font.kMinWidthY },
                        { x: +kMinWidthT * 2, y: +font.kMinWidthY },
                    ]);
                    polygons.push(poly);
                    break;
                }
                case 13:
                    if (kakatoAdjustment === 4) { // for new GTH box's left bottom corner
                        if (x1 === x2) {
                            var poly = new Pen(x2, y2).getPolygon([
                                { x: -kMinWidthT, y: -font.kMinWidthY * 3 },
                                { x: -kMinWidthT * 2, y: 0 },
                                { x: -font.kMinWidthY, y: +font.kMinWidthY * 5 },
                                { x: +kMinWidthT, y: +font.kMinWidthY },
                            ]);
                            polygons.push(poly);
                        }
                        else { // MUKI KANKEINASHI
                            var m = (x1 > x2 && y1 !== y2)
                                ? Math.floor((x1 - x2) / (y2 - y1) * 3)
                                : 0;
                            var poly = new Pen(x2 + m, y2).getPolygon([
                                { x: 0, y: -font.kMinWidthY * 5 },
                                { x: -kMinWidthT * 2, y: 0 },
                                { x: -font.kMinWidthY, y: +font.kMinWidthY * 5 },
                                { x: +kMinWidthT, y: +font.kMinWidthY },
                                { x: 0, y: 0 },
                            ]);
                            polygons.push(poly);
                        }
                    }
                    break;
            }
            switch (a1) {
                case 22:
                case 27: {
                    // box's right top corner
                    // SHIKAKU MIGIUE UROKO NANAME DEMO MASSUGU MUKI
                    var poly = new Pen(x1, y1).getPolygon([
                        { x: -kMinWidthT, y: -font.kMinWidthY },
                        { x: 0, y: -font.kMinWidthY - font.kWidth },
                        { x: +kMinWidthT + font.kWidth, y: +font.kMinWidthY },
                    ].concat((x1 === x2)
                        ? [
                            { x: +kMinWidthT, y: +kMinWidthT },
                            { x: -kMinWidthT, y: 0 },
                        ]
                        : (a1 === 27)
                            ? [
                                { x: +kMinWidthT, y: +kMinWidthT - 1 },
                                { x: 0, y: +kMinWidthT + 2 },
                                { x: 0, y: 0 },
                            ]
                            : [
                                { x: +kMinWidthT, y: +kMinWidthT - 1 },
                                { x: -kMinWidthT, y: +kMinWidthT + 4 },
                            ]));
                    polygons.push(poly);
                    break;
                }
                case 0: { // beginning of the stroke
                    var poly = pen1.getPolygon([
                        { x: kMinWidthT, y: font.kMinWidthY * 0.5 },
                        { x: kMinWidthT + kMinWidthT * 0.5, y: font.kMinWidthY * 0.5 + font.kMinWidthY },
                        { x: kMinWidthT - 2, y: font.kMinWidthY * 0.5 + font.kMinWidthY * 2 + 1 },
                    ]);
                    if (x1 !== x2) { // ?????
                        poly.set(2, x1 + (kMinWidthT - 2) * sinrad + (font.kMinWidthY * 0.5 + font.kMinWidthY * 2) * cosrad, y1 + (kMinWidthT + 1) * -cosrad + (font.kMinWidthY * 0.5 + font.kMinWidthY * 2) * sinrad); // ?????
                    }
                    polygons.push(poly);
                    break;
                }
            }
            if (x1 === x2 && a2 === 1 || a1 === 6 && (a2 === 0 || x1 !== x2 && a2 === 5)) {
                // KAGI NO YOKO BOU NO SAIGO NO MARU ... no need only used at 1st=yoko
                var poly = new Polygon();
                if (font.kUseCurve) {
                    poly.pushPoint(pen2.getPoint(kMinWidthT, 0));
                    poly.push(x2 - cosrad * kMinWidthT * 0.9 + -sinrad * -kMinWidthT * 0.9, // typo? (- cosrad should be + cosrad)
                    y2 + sinrad * kMinWidthT * 0.9 + cosrad * -kMinWidthT * 0.9, true);
                    poly.pushPoint(pen2.getPoint(0, kMinWidthT));
                    poly.pushPoint(pen2.getPoint(-kMinWidthT * 0.9, kMinWidthT * 0.9, true));
                    poly.pushPoint(pen2.getPoint(-kMinWidthT, 0));
                }
                else {
                    var r = (x1 === x2 && (a1 === 6 && a2 === 0 || a2 === 1))
                        ? 0.6
                        : 0.8; // ?????
                    poly.pushPoint(pen2.getPoint(kMinWidthT, 0));
                    poly.pushPoint(pen2.getPoint(kMinWidthT * 0.6, kMinWidthT * r));
                    poly.pushPoint(pen2.getPoint(0, kMinWidthT));
                    poly.pushPoint(pen2.getPoint(-kMinWidthT * 0.6, kMinWidthT * r));
                    poly.pushPoint(pen2.getPoint(-kMinWidthT, 0));
                }
                if (x1 === x2 && (a1 === 6 && a2 === 0 || a2 === 1)) {
                    // for backward compatibility
                    poly.reverse();
                }
                // poly.reverse(); // for fill-rule
                polygons.push(poly);
                if (x1 !== x2 && a1 === 6 && a2 === 5) {
                    // KAGI NO YOKO BOU NO HANE
                    var haneLength = font.kWidth * 5;
                    var rv = x1 < x2 ? 1 : -1;
                    var poly_2 = pen2.getPolygon([
                        { x: rv * (kMinWidthT - 1), y: 0 },
                        { x: rv * (kMinWidthT + haneLength), y: 2 },
                        { x: rv * (kMinWidthT + haneLength), y: 0 },
                        { x: kMinWidthT - 1, y: -kMinWidthT }, // rv ?????
                    ]);
                    polygons.push(poly_2);
                }
            }
        }
        else if (y1 === y2 && a1 === 6) {
            // if it is YOKO stroke, use x-axis
            // if it is KAGI's YOKO stroke, get bold
            // x1 !== x2 && y1 === y2 && a1 === 6
            var pen1_r = new Pen(x1, y1);
            var pen2_r = new Pen(x2, y2);
            var poly0 = new Polygon([
                pen1_r.getPoint(0, -kMinWidthT),
                pen2_r.getPoint(0, -kMinWidthT),
                pen2_r.getPoint(0, +kMinWidthT),
                pen1_r.getPoint(0, +kMinWidthT),
            ]);
            polygons.push(poly0);
            switch (a2) {
                case 1:
                case 0:
                case 5: { // no need a2=1
                    // KAGI NO YOKO BOU NO SAIGO NO MARU
                    var pen2 = new Pen(x2, y2);
                    if (x1 > x2) {
                        pen2.setMatrix2(-1, 0);
                    }
                    var r = 0.6;
                    var poly = pen2.getPolygon((font.kUseCurve)
                        ? [
                            { x: 0, y: -kMinWidthT },
                            { x: +kMinWidthT * 0.9, y: -kMinWidthT * 0.9, off: true },
                            { x: +kMinWidthT, y: 0 },
                            { x: +kMinWidthT * 0.9, y: +kMinWidthT * 0.9, off: true },
                            { x: 0, y: +kMinWidthT },
                        ]
                        : [
                            { x: 0, y: -kMinWidthT },
                            { x: +kMinWidthT * r, y: -kMinWidthT * 0.6 },
                            { x: +kMinWidthT, y: 0 },
                            { x: +kMinWidthT * r, y: +kMinWidthT * 0.6 },
                            { x: 0, y: +kMinWidthT },
                        ]);
                    if (x1 >= x2) {
                        poly.reverse();
                    }
                    polygons.push(poly);
                    if (a2 === 5) {
                        var haneLength = font.kWidth * (4 * (1 - opt1 / font.kAdjustMageStep) + 1);
                        // KAGI NO YOKO BOU NO HANE
                        var rv = x1 < x2 ? 1 : -1;
                        var poly_3 = pen2.getPolygon([
                            // { x: 0, y: rv * (-kMinWidthT + 1) },
                            { x: 0, y: rv * -kMinWidthT },
                            { x: 2, y: rv * (-kMinWidthT - haneLength) },
                            { x: 0, y: rv * (-kMinWidthT - haneLength) },
                            // { x: -kMinWidthT, y: rv * (-kMinWidthT + 1) },
                            { x: -kMinWidthT, y: rv * -kMinWidthT },
                        ]);
                        // poly2.reverse(); // for fill-rule
                        polygons.push(poly_3);
                    }
                    break;
                }
            }
        }
        else {
            // for others, use x-axis
            // ASAI KAUDO
            var _b = (y1 === y2)
                ? [1, 0] // ?????
                : normalize([x2 - x1, y2 - y1]), cosrad = _b[0], sinrad = _b[1];
            // always same
            var pen1 = new Pen(x1, y1);
            var pen2 = new Pen(x2, y2);
            // if (y1 !== y2) { // ?????
            // 	pen1.setRight(x2, y2);
            // 	pen2.setLeft(x1, y1);
            // }
            pen1.setMatrix2(cosrad, sinrad);
            pen2.setMatrix2(cosrad, sinrad);
            var poly = new Polygon([
                pen1.getPoint(0, -font.kMinWidthY),
                pen2.getPoint(0, -font.kMinWidthY),
                pen2.getPoint(0, font.kMinWidthY),
                pen1.getPoint(0, font.kMinWidthY),
            ]);
            polygons.push(poly);
            switch (a2) {
                // UROKO
                case 0: {
                    var urokoScale = (font.kMinWidthU / font.kMinWidthY - 1.0) / 4.0 + 1.0;
                    var poly2 = pen2.getPolygon([
                        { x: 0, y: -font.kMinWidthY },
                        { x: -font.kAdjustUrokoX[urokoAdjustment] * urokoScale, y: 0 },
                    ]);
                    poly2.push(x2 - (cosrad - sinrad) * font.kAdjustUrokoX[urokoAdjustment] * urokoScale / 2, y2 - (sinrad + cosrad) * font.kAdjustUrokoY[urokoAdjustment] * urokoScale);
                    polygons.push(poly2);
                    break;
                }
            }
        }
    }

    function selectPolygonsRect(polygons, x1, y1, x2, y2) {
        return polygons.array.filter(function (polygon) { return (polygon.array.every(function (_a) {
            var x = _a.x, y = _a.y;
            return x1 <= x && x <= x2 && y1 <= y && y <= y2;
        })); });
    }
    /** @internal */
    function dfTransform(polygons, x1, y1, x2, y2, a2_100, a3_100, a2_opt, a3_opt) {
        if (a2_100 === 98 && a2_opt === 0) {
            var dx = x1 + x2, dy = 0;
            for (var _i = 0, _a = selectPolygonsRect(polygons, x1, y1, x2, y2); _i < _a.length; _i++) {
                var polygon = _a[_i];
                polygon.reflectX().translate(dx, dy).floor();
            }
        }
        else if (a2_100 === 97 && a2_opt === 0) {
            var dx = 0, dy = y1 + y2;
            for (var _b = 0, _c = selectPolygonsRect(polygons, x1, y1, x2, y2); _b < _c.length; _b++) {
                var polygon = _c[_b];
                polygon.reflectY().translate(dx, dy).floor();
            }
        }
        else if (a2_100 === 99 && a2_opt === 0) {
            if (a3_100 === 1 && a3_opt === 0) {
                var dx = x1 + y2, dy = y1 - x1;
                for (var _d = 0, _e = selectPolygonsRect(polygons, x1, y1, x2, y2); _d < _e.length; _d++) {
                    var polygon = _e[_d];
                    // polygon.translate(-x1, -y2).rotate90().translate(x1, y1);
                    polygon.rotate90().translate(dx, dy).floor();
                }
            }
            else if (a3_100 === 2 && a3_opt === 0) {
                var dx = x1 + x2, dy = y1 + y2;
                for (var _f = 0, _g = selectPolygonsRect(polygons, x1, y1, x2, y2); _f < _g.length; _f++) {
                    var polygon = _g[_f];
                    polygon.rotate180().translate(dx, dy).floor();
                }
            }
            else if (a3_100 === 3 && a3_opt === 0) {
                var dx = x1 - y1, dy = y2 + x1;
                for (var _h = 0, _j = selectPolygonsRect(polygons, x1, y1, x2, y2); _h < _j.length; _h++) {
                    var polygon = _j[_h];
                    // polygon.translate(-x1, -y1).rotate270().translate(x1, y2);
                    polygon.rotate270().translate(dx, dy).floor();
                }
            }
        }
    }
    function dfDrawFont$1(font, polygons, _a) {
        var _b = _a.stroke, a1_100 = _b.a1_100, a2_100 = _b.a2_100, a2_opt = _b.a2_opt, a2_opt_1 = _b.a2_opt_1, a2_opt_2 = _b.a2_opt_2, a2_opt_3 = _b.a2_opt_3, a3_100 = _b.a3_100, a3_opt = _b.a3_opt, a3_opt_1 = _b.a3_opt_1, a3_opt_2 = _b.a3_opt_2, x1 = _b.x1, y1 = _b.y1, x2 = _b.x2, y2 = _b.y2, x3 = _b.x3, y3 = _b.y3, x4 = _b.x4, y4 = _b.y4, kirikuchiAdjustment = _a.kirikuchiAdjustment, tateAdjustment = _a.tateAdjustment, haneAdjustment = _a.haneAdjustment, urokoAdjustment = _a.urokoAdjustment, kakatoAdjustment = _a.kakatoAdjustment, mageAdjustment = _a.mageAdjustment;
        switch (a1_100) { // ... no need to divide
            case 0:
                dfTransform(polygons, x1, y1, x2, y2, a2_100, a3_100, a2_opt, a3_opt);
                break;
            case 1: {
                if (a3_100 === 4) {
                    var _c = (x1 === x2 && y1 === y2)
                        ? [0, font.kMage] // ?????
                        : normalize([x1 - x2, y1 - y2], font.kMage), dx1 = _c[0], dy1 = _c[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    cdDrawLine$1(font, polygons, x1, y1, tx1, ty1, a2_100 + a2_opt_1 * 100, 1, tateAdjustment, 0, 0);
                    cdDrawCurve$1(font, polygons, tx1, ty1, x2, y2, x2 - font.kMage * (((font.kAdjustTateStep + 4) - tateAdjustment) / (font.kAdjustTateStep + 4)), y2, 1, 14, tateAdjustment % 10, haneAdjustment, Math.floor(tateAdjustment / 10), a3_opt_2);
                }
                else {
                    cdDrawLine$1(font, polygons, x1, y1, x2, y2, a2_100 + a2_opt_1 * 100, a3_100, tateAdjustment, urokoAdjustment, kakatoAdjustment);
                }
                break;
            }
            case 2: {
                // case 12: // ... no need
                if (a3_100 === 4) {
                    var _d = (x2 === x3)
                        ? [0, -font.kMage] // ?????
                        : (y2 === y3)
                            ? [-font.kMage, 0] // ?????
                            : normalize([x2 - x3, y2 - y3], font.kMage), dx1 = _d[0], dy1 = _d[1];
                    var tx1 = x3 + dx1;
                    var ty1 = y3 + dy1;
                    cdDrawCurve$1(font, polygons, x1, y1, x2, y2, tx1, ty1, a2_100 + kirikuchiAdjustment * 100, 0, a2_opt_2, 0, a2_opt_3, 0);
                    cdDrawCurve$1(font, polygons, tx1, ty1, x3, y3, x3 - font.kMage, y3, 2, 14, a2_opt_2, haneAdjustment, 0, a3_opt_2);
                }
                else {
                    cdDrawCurve$1(font, polygons, x1, y1, x2, y2, x3, y3, a2_100 + kirikuchiAdjustment * 100, (a3_100 === 5 && a3_opt === 0) ? 15 : a3_100, a2_opt_2, a3_opt_1, a2_opt_3, a3_opt_2);
                }
                break;
            }
            case 3: {
                var _e = (x1 === x2 && y1 === y2)
                    ? [0, font.kMage] // ?????
                    : normalize([x1 - x2, y1 - y2], font.kMage), dx1 = _e[0], dy1 = _e[1];
                var tx1 = x2 + dx1;
                var ty1 = y2 + dy1;
                var _f = (x2 === x3 && y2 === y3)
                    ? [0, -font.kMage] // ?????
                    : normalize([x3 - x2, y3 - y2], font.kMage), dx2 = _f[0], dy2 = _f[1];
                var tx2 = x2 + dx2;
                var ty2 = y2 + dy2;
                cdDrawLine$1(font, polygons, x1, y1, tx1, ty1, a2_100 + a2_opt_1 * 100, 1, tateAdjustment, 0, 0);
                cdDrawCurve$1(font, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, tateAdjustment, mageAdjustment);
                if (!(a3_100 === 5 && a3_opt_1 === 0 && !((x2 < x3 && x3 - tx2 > 0) || (x2 > x3 && tx2 - x3 > 0)))) { // for closer position
                    var opt2 = (a3_100 === 5 && a3_opt_1 === 0) ? 0 : a3_opt_1 + mageAdjustment * 10;
                    cdDrawLine$1(font, polygons, tx2, ty2, x3, y3, 6, a3_100, mageAdjustment, opt2, opt2); // bolder by force
                }
                break;
            }
            case 12: {
                cdDrawCurve$1(font, polygons, x1, y1, x2, y2, x3, y3, a2_100 + a2_opt_1 * 100, 1, a2_opt_2, 0, a2_opt_3, 0);
                cdDrawLine$1(font, polygons, x3, y3, x4, y4, 6, a3_100, 0, a3_opt, a3_opt);
                break;
            }
            case 4: {
                var rate = hypot(x3 - x2, y3 - y2) / 120 * 6;
                if (rate > 6) {
                    rate = 6;
                }
                var _g = (x1 === x2 && y1 === y2)
                    ? [0, font.kMage * rate] // ?????
                    : normalize([x1 - x2, y1 - y2], font.kMage * rate), dx1 = _g[0], dy1 = _g[1];
                var tx1 = x2 + dx1;
                var ty1 = y2 + dy1;
                var _h = (x2 === x3 && y2 === y3)
                    ? [0, -font.kMage * rate] // ?????
                    : normalize([x3 - x2, y3 - y2], font.kMage * rate), dx2 = _h[0], dy2 = _h[1];
                var tx2 = x2 + dx2;
                var ty2 = y2 + dy2;
                cdDrawLine$1(font, polygons, x1, y1, tx1, ty1, a2_100 + a2_opt_1 * 100, 1, a2_opt_2 + a2_opt_3 * 10, 0, 0);
                cdDrawCurve$1(font, polygons, tx1, ty1, x2, y2, tx2, ty2, 1, 1, 0, 0, 0, 0);
                if (!(a3_100 === 5 && a3_opt === 0 && x3 - tx2 <= 0)) { // for closer position
                    cdDrawLine$1(font, polygons, tx2, ty2, x3, y3, 6, a3_100, 0, a3_opt, a3_opt); // bolder by force
                }
                break;
            }
            case 6: {
                if (a3_100 === 4) {
                    var _j = (x3 === x4)
                        ? [0, -font.kMage] // ?????
                        : (y3 === y4)
                            ? [-font.kMage, 0] // ?????
                            : normalize([x3 - x4, y3 - y4], font.kMage), dx1 = _j[0], dy1 = _j[1];
                    var tx1 = x4 + dx1;
                    var ty1 = y4 + dy1;
                    cdDrawBezier$1(font, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1, a2_100 + a2_opt_1 * 100, 1, a2_opt_2, 0, a2_opt_3, 0);
                    cdDrawCurve$1(font, polygons, tx1, ty1, x4, y4, x4 - font.kMage, y4, 1, 14, 0, haneAdjustment, 0, a3_opt_2);
                }
                else {
                    cdDrawBezier$1(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a2_100 + a2_opt_1 * 100, (a3_100 === 5 && a3_opt === 0) ? 15 : a3_100, a2_opt_2, a3_opt_1, a2_opt_3, a3_opt_2);
                }
                break;
            }
            case 7: {
                cdDrawLine$1(font, polygons, x1, y1, x2, y2, a2_100 + a2_opt_1 * 100, 1, tateAdjustment, 0, 0);
                cdDrawCurve$1(font, polygons, x2, y2, x3, y3, x4, y4, 1, a3_100, tateAdjustment % 10, a3_opt_1, Math.floor(tateAdjustment / 10), a3_opt_2);
                break;
            }
        }
    }
    /** Mincho style font. */
    var Mincho = /** @class */ (function () {
        function Mincho() {
            this.shotai = KShotai.kMincho;
            /**
             * Precision for polygon approximation of curving strokes.
             * It must be a positive divisor of 1000. The smaller `kRate` will give
             * smoother curves approximated with the larger number of points (roughly
             * 2 × 1000 / `kRate` per one curve stroke).
             */
            this.kRate = 100; // must divide 1000
            this.setSize();
        }
        Mincho.prototype.setSize = function (size) {
            if (size === 1) {
                this.kMinWidthY = 1.2;
                this.kMinWidthT = 3.6;
                this.kWidth = 3;
                this.kKakato = 1.8;
                this.kL2RDfatten = 1.1;
                this.kMage = 6;
                this.kUseCurve = false;
                this.kAdjustKakatoL = [8, 5, 3, 1, 0];
                this.kAdjustKakatoR = [4, 3, 2, 1];
                this.kAdjustKakatoRangeX = 12;
                this.kAdjustKakatoRangeY = [1, 11, 14, 18];
                this.kAdjustKakatoStep = 3;
                this.kAdjustUrokoX = [14, 12, 9, 7];
                this.kAdjustUrokoY = [7, 6, 5, 4];
                this.kAdjustUrokoLength = [13, 21, 30];
                this.kAdjustUrokoLengthStep = 3;
                this.kAdjustUrokoLine = [13, 15, 18];
            }
            else {
                this.kMinWidthY = 2;
                this.kMinWidthU = 2;
                this.kMinWidthT = 6;
                this.kWidth = 5;
                this.kKakato = 3;
                this.kL2RDfatten = 1.1;
                this.kMage = 10;
                this.kUseCurve = false;
                this.kAdjustKakatoL = [14, 9, 5, 2, 0];
                this.kAdjustKakatoR = [8, 6, 4, 2];
                this.kAdjustKakatoRangeX = 20;
                this.kAdjustKakatoRangeY = [1, 19, 24, 30];
                this.kAdjustKakatoStep = 3;
                this.kAdjustUrokoX = [24, 20, 16, 12];
                this.kAdjustUrokoY = [12, 11, 9, 8];
                this.kAdjustUrokoLength = [22, 36, 50];
                this.kAdjustUrokoLengthStep = 3;
                this.kAdjustUrokoLine = [22, 26, 30];
                this.kAdjustUroko2Step = 3;
                this.kAdjustUroko2Length = 40;
                this.kAdjustTateStep = 4;
                this.kAdjustMageStep = 5;
            }
        };
        /** @internal */
        Mincho.prototype.getDrawers = function (strokesArray) {
            var _this = this;
            return this.adjustStrokes(strokesArray).map(function (adjStroke) { return function (polygons) {
                dfDrawFont$1(_this, polygons, adjStroke);
            }; });
        };
        /** @internal */
        Mincho.prototype.adjustStrokes = function (strokesArray) {
            var adjustedStrokes = strokesArray.map(function (stroke) {
                var a2_opt_1 = stroke.a2_opt_1, a2_opt_2 = stroke.a2_opt_2, a2_opt_3 = stroke.a2_opt_3, a3_opt = stroke.a3_opt, a3_opt_1 = stroke.a3_opt_1, a3_opt_2 = stroke.a3_opt_2;
                return {
                    stroke: stroke,
                    // a2:
                    // - 100s place: adjustKirikuchi (when 2:X32);
                    // - 1000s place: adjustTate (when {1,3,7})
                    kirikuchiAdjustment: a2_opt_1,
                    tateAdjustment: a2_opt_2 + a2_opt_3 * 10,
                    // a3:
                    // - 100s place: adjustHane (when {1,2,6}::X04), adjustUroko/adjustUroko2 (when 1::X00),
                    //               adjustKakato (when 1::X{13,23});
                    // - 1000s place: adjustMage (when 3)
                    haneAdjustment: a3_opt_1,
                    urokoAdjustment: a3_opt,
                    kakatoAdjustment: a3_opt,
                    mageAdjustment: a3_opt_2,
                };
            });
            this.adjustHane(adjustedStrokes);
            this.adjustMage(adjustedStrokes);
            this.adjustTate(adjustedStrokes);
            this.adjustKakato(adjustedStrokes);
            this.adjustUroko(adjustedStrokes);
            this.adjustUroko2(adjustedStrokes);
            this.adjustKirikuchi(adjustedStrokes);
            return adjustedStrokes;
        };
        Mincho.prototype.adjustHane = function (adjStrokes) {
            var vertSegments = [];
            for (var _i = 0, adjStrokes_1 = adjStrokes; _i < adjStrokes_1.length; _i++) {
                var stroke = adjStrokes_1[_i].stroke;
                if (stroke.a1_100 === 1 && stroke.a1_opt === 0 && stroke.x1 === stroke.x2) {
                    vertSegments.push({
                        stroke: stroke,
                        x: stroke.x1,
                        y1: stroke.y1,
                        y2: stroke.y2,
                    });
                }
            }
            for (var _a = 0, adjStrokes_2 = adjStrokes; _a < adjStrokes_2.length; _a++) {
                var adjStroke = adjStrokes_2[_a];
                var stroke = adjStroke.stroke;
                if ((stroke.a1_100 === 1 || stroke.a1_100 === 2 || stroke.a1_100 === 6) && stroke.a1_opt === 0
                    && stroke.a3_100 === 4 && stroke.a3_opt === 0) {
                    var lpx = // lastPointX
                     void 0; // lastPointX
                    var lpy = // lastPointY
                     void 0; // lastPointY
                    if (stroke.a1_100 === 1) {
                        lpx = stroke.x2;
                        lpy = stroke.y2;
                    }
                    else if (stroke.a1_100 === 2) {
                        lpx = stroke.x3;
                        lpy = stroke.y3;
                    }
                    else {
                        lpx = stroke.x4;
                        lpy = stroke.y4;
                    }
                    var mn = Infinity; // mostNear
                    if (lpx + 18 < 100) {
                        mn = lpx + 18;
                    }
                    for (var _b = 0, vertSegments_1 = vertSegments; _b < vertSegments_1.length; _b++) {
                        var _c = vertSegments_1[_b], stroke2 = _c.stroke, x = _c.x, y1 = _c.y1, y2 = _c.y2;
                        if (stroke !== stroke2
                            && lpx - x < 100 && x < lpx
                            && y1 <= lpy && y2 >= lpy) {
                            mn = Math.min(mn, lpx - x);
                        }
                    }
                    if (mn !== Infinity) {
                        adjStroke.haneAdjustment += 7 - Math.floor(mn / 15);
                    }
                }
            }
            return adjStrokes;
        };
        Mincho.prototype.adjustMage = function (adjStrokes) {
            var horiSegments = [];
            for (var _i = 0, adjStrokes_3 = adjStrokes; _i < adjStrokes_3.length; _i++) {
                var adjStroke = adjStrokes_3[_i];
                var stroke = adjStroke.stroke;
                if (stroke.a1_100 === 1 && stroke.a1_opt === 0 && stroke.y1 === stroke.y2) {
                    horiSegments.push({
                        stroke: stroke,
                        adjStroke: adjStroke,
                        isTarget: false,
                        y: stroke.y2,
                        x1: stroke.x1,
                        x2: stroke.x2,
                    });
                }
                else if (stroke.a1_100 === 3 && stroke.a1_opt === 0 && stroke.y2 === stroke.y3) {
                    horiSegments.push({
                        stroke: stroke,
                        adjStroke: adjStroke,
                        isTarget: true,
                        y: stroke.y2,
                        x1: stroke.x2,
                        x2: stroke.x3,
                    });
                }
            }
            for (var _a = 0, horiSegments_1 = horiSegments; _a < horiSegments_1.length; _a++) {
                var _b = horiSegments_1[_a], adjStroke = _b.adjStroke, stroke = _b.stroke, isTarget = _b.isTarget, y = _b.y, x1 = _b.x1, x2 = _b.x2;
                if (isTarget) {
                    for (var _c = 0, horiSegments_2 = horiSegments; _c < horiSegments_2.length; _c++) {
                        var _d = horiSegments_2[_c], stroke2 = _d.stroke, other_y = _d.y, other_x1 = _d.x1, other_x2 = _d.x2;
                        if (stroke !== stroke2
                            && !(x1 + 1 > other_x2 || x2 - 1 < other_x1)
                            && round(Math.abs(y - other_y)) < this.kMinWidthT * this.kAdjustMageStep) {
                            adjStroke.mageAdjustment += this.kAdjustMageStep - Math.floor(Math.abs(y - other_y) / this.kMinWidthT);
                            if (adjStroke.mageAdjustment > this.kAdjustMageStep) {
                                adjStroke.mageAdjustment = this.kAdjustMageStep;
                            }
                        }
                    }
                }
            }
            return adjStrokes;
        };
        Mincho.prototype.adjustTate = function (adjStrokes) {
            var vertSegments = [];
            for (var _i = 0, adjStrokes_4 = adjStrokes; _i < adjStrokes_4.length; _i++) {
                var adjStroke = adjStrokes_4[_i];
                var stroke = adjStroke.stroke;
                if ((stroke.a1_100 === 1 || stroke.a1_100 === 3 || stroke.a1_100 === 7) && stroke.a1_opt === 0 && stroke.x1 === stroke.x2) {
                    vertSegments.push({
                        stroke: stroke,
                        adjStroke: adjStroke,
                        x: stroke.x1,
                        y1: stroke.y1,
                        y2: stroke.y2,
                    });
                }
            }
            for (var _a = 0, vertSegments_2 = vertSegments; _a < vertSegments_2.length; _a++) {
                var _b = vertSegments_2[_a], adjStroke = _b.adjStroke, stroke = _b.stroke, x = _b.x, y1 = _b.y1, y2 = _b.y2;
                for (var _c = 0, vertSegments_3 = vertSegments; _c < vertSegments_3.length; _c++) {
                    var _d = vertSegments_3[_c], stroke2 = _d.stroke, other_x = _d.x, other_y1 = _d.y1, other_y2 = _d.y2;
                    if (stroke !== stroke2
                        && !(y1 + 1 > other_y2 || y2 - 1 < other_y1)
                        && round(Math.abs(x - other_x)) < this.kMinWidthT * this.kAdjustTateStep) {
                        adjStroke.tateAdjustment += this.kAdjustTateStep - Math.floor(Math.abs(x - other_x) / this.kMinWidthT);
                        if (adjStroke.tateAdjustment > this.kAdjustTateStep
                            || adjStroke.tateAdjustment === this.kAdjustTateStep && (stroke.a2_opt_1 !== 0 || stroke.a2_100 !== 0)) {
                            adjStroke.tateAdjustment = this.kAdjustTateStep;
                        }
                    }
                }
            }
            return adjStrokes;
        };
        Mincho.prototype.adjustKakato = function (adjStrokes) {
            var _this = this;
            var _loop_1 = function (adjStroke) {
                var stroke = adjStroke.stroke;
                if (stroke.a1_100 === 1 && stroke.a1_opt === 0
                    && (stroke.a3_100 === 13 || stroke.a3_100 === 23) && stroke.a3_opt === 0) {
                    var _loop_2 = function (k) {
                        if (adjStrokes.some(function (_a) {
                            var stroke2 = _a.stroke;
                            return stroke !== stroke2 &&
                                stroke2.isCrossBox(stroke.x2 - _this.kAdjustKakatoRangeX / 2, stroke.y2 + _this.kAdjustKakatoRangeY[k], stroke.x2 + _this.kAdjustKakatoRangeX / 2, stroke.y2 + _this.kAdjustKakatoRangeY[k + 1]);
                        })
                            || round(stroke.y2 + this_1.kAdjustKakatoRangeY[k + 1]) > 200 // adjust for baseline
                            || round(stroke.y2 - stroke.y1) < this_1.kAdjustKakatoRangeY[k + 1] // for thin box
                        ) {
                            adjStroke.kakatoAdjustment = 3 - k;
                            return "break";
                        }
                    };
                    for (var k = 0; k < this_1.kAdjustKakatoStep; k++) {
                        var state_1 = _loop_2(k);
                        if (state_1 === "break")
                            break;
                    }
                }
            };
            var this_1 = this;
            for (var _i = 0, adjStrokes_5 = adjStrokes; _i < adjStrokes_5.length; _i++) {
                var adjStroke = adjStrokes_5[_i];
                _loop_1(adjStroke);
            }
            return adjStrokes;
        };
        Mincho.prototype.adjustUroko = function (adjStrokes) {
            var _loop_3 = function (adjStroke) {
                var stroke = adjStroke.stroke;
                if (stroke.a1_100 === 1 && stroke.a1_opt === 0
                    && stroke.a3_100 === 0 && stroke.a3_opt === 0) { // no operation for TATE
                    var _loop_4 = function (k) {
                        var _a = (stroke.y1 === stroke.y2) // YOKO
                            ? [1, 0] // ?????
                            : (stroke.x2 - stroke.x1 < 0)
                                ? normalize([stroke.x1 - stroke.x2, stroke.y1 - stroke.y2]) // for backward compatibility...
                                : normalize([stroke.x2 - stroke.x1, stroke.y2 - stroke.y1]), cosrad = _a[0], sinrad = _a[1];
                        var tx = stroke.x2 - this_2.kAdjustUrokoLine[k] * cosrad - 0.5 * sinrad; // typo? (sinrad should be -sinrad ?)
                        var ty = stroke.y2 - this_2.kAdjustUrokoLine[k] * sinrad - 0.5 * cosrad;
                        var tlen = (stroke.y1 === stroke.y2) // YOKO
                            ? stroke.x2 - stroke.x1 // should be Math.abs(...)?
                            : hypot(stroke.y2 - stroke.y1, stroke.x2 - stroke.x1);
                        if (round(tlen) < this_2.kAdjustUrokoLength[k]
                            || adjStrokes.some(function (_a) {
                                var stroke2 = _a.stroke;
                                return stroke !== stroke2 && stroke2.isCross(tx, ty, stroke.x2, stroke.y2);
                            })) {
                            adjStroke.urokoAdjustment = this_2.kAdjustUrokoLengthStep - k;
                            return "break";
                        }
                    };
                    for (var k = 0; k < this_2.kAdjustUrokoLengthStep; k++) {
                        var state_2 = _loop_4(k);
                        if (state_2 === "break")
                            break;
                    }
                }
            };
            var this_2 = this;
            for (var _i = 0, adjStrokes_6 = adjStrokes; _i < adjStrokes_6.length; _i++) {
                var adjStroke = adjStrokes_6[_i];
                _loop_3(adjStroke);
            }
            return adjStrokes;
        };
        Mincho.prototype.adjustUroko2 = function (adjStrokes) {
            var horiSegments = [];
            for (var _i = 0, adjStrokes_7 = adjStrokes; _i < adjStrokes_7.length; _i++) {
                var adjStroke = adjStrokes_7[_i];
                var stroke = adjStroke.stroke;
                if (stroke.a1_100 === 1 && stroke.a1_opt === 0
                    && stroke.y1 === stroke.y2) {
                    horiSegments.push({
                        stroke: stroke,
                        adjStroke: adjStroke,
                        isTarget: stroke.a3_100 === 0 && stroke.a3_opt === 0 && adjStroke.urokoAdjustment === 0,
                        y: stroke.y1,
                        x1: stroke.x1,
                        x2: stroke.x2,
                    });
                }
                else if (stroke.a1_100 === 3 && stroke.a1_opt === 0
                    && stroke.y2 === stroke.y3) {
                    horiSegments.push({
                        stroke: stroke,
                        adjStroke: adjStroke,
                        isTarget: false,
                        y: stroke.y2,
                        x1: stroke.x2,
                        x2: stroke.x3,
                    });
                }
            }
            for (var _a = 0, horiSegments_3 = horiSegments; _a < horiSegments_3.length; _a++) {
                var _b = horiSegments_3[_a], adjStroke = _b.adjStroke, stroke = _b.stroke, isTarget = _b.isTarget, y = _b.y, x1 = _b.x1, x2 = _b.x2;
                if (isTarget) {
                    var pressure = 0;
                    for (var _c = 0, horiSegments_4 = horiSegments; _c < horiSegments_4.length; _c++) {
                        var _d = horiSegments_4[_c], stroke2 = _d.stroke, other_y = _d.y, other_x1 = _d.x1, other_x2 = _d.x2;
                        if (stroke !== stroke2
                            && !(x1 + 1 > other_x2 || x2 - 1 < other_x1)
                            && round(Math.abs(y - other_y)) < this.kAdjustUroko2Length) {
                            pressure += Math.pow((this.kAdjustUroko2Length - Math.abs(y - other_y)), 1.1);
                        }
                    }
                    // const result = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step) * 100;
                    // if (stroke.a3 < result) {
                    adjStroke.urokoAdjustment = Math.min(Math.floor(pressure / this.kAdjustUroko2Length), this.kAdjustUroko2Step);
                    // }
                }
            }
            return adjStrokes;
        };
        Mincho.prototype.adjustKirikuchi = function (adjStrokes) {
            var horiSegments = [];
            for (var _i = 0, adjStrokes_8 = adjStrokes; _i < adjStrokes_8.length; _i++) {
                var stroke = adjStrokes_8[_i].stroke;
                if (stroke.a1_100 === 1 && stroke.a1_opt === 0 && stroke.y1 === stroke.y2) {
                    horiSegments.push({
                        y: stroke.y1,
                        x1: stroke.x1,
                        x2: stroke.x2,
                    });
                }
            }
            var _loop_5 = function (adjStroke) {
                var stroke = adjStroke.stroke;
                if (stroke.a1_100 === 2 && stroke.a1_opt === 0
                    && stroke.a2_100 === 32 && stroke.a2_opt === 0
                    && stroke.x1 > stroke.x2 && stroke.y1 < stroke.y2
                    && horiSegments.some(function (_a) {
                        var y = _a.y, x1 = _a.x1, x2 = _a.x2;
                        return ( // no need to skip when i == j
                        x1 < stroke.x1 && x2 > stroke.x1 && y === stroke.y1);
                    })) {
                    adjStroke.kirikuchiAdjustment = 1;
                }
            };
            for (var _a = 0, adjStrokes_9 = adjStrokes; _a < adjStrokes_9.length; _a++) {
                var adjStroke = adjStrokes_9[_a];
                _loop_5(adjStroke);
            }
            return adjStrokes;
        };
        return Mincho;
    }());

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    function cdDrawCurveU(font, polygons, x1, y1, sx1, sy1, sx2, sy2, x2, y2, _ta1, _ta2) {
        var a1;
        var a2;
        var delta1 = 0;
        switch (a1 % 10) { // ?????
            case 2:
                delta1 = font.kWidth;
                break;
            case 3:
                delta1 = font.kWidth * font.kKakato;
                break;
        }
        if (delta1 !== 0) {
            var _a = (x1 === sx1 && y1 === sy1)
                ? [0, delta1] // ?????
                : normalize([x1 - sx1, y1 - sy1], delta1), dx1 = _a[0], dy1 = _a[1];
            x1 += dx1;
            y1 += dy1;
        }
        var delta2 = 0;
        switch (a2 % 10) { // ?????
            case 2:
                delta2 = font.kWidth;
                break;
            case 3:
                delta2 = font.kWidth * font.kKakato;
                break;
        }
        if (delta2 !== 0) {
            var _b = (sx2 === x2 && sy2 === y2)
                ? [0, -delta2] // ?????
                : normalize([x2 - sx2, y2 - sy2], delta2), dx2 = _b[0], dy2 = _b[1];
            x2 += dx2;
            y2 += dy2;
        }
        drawCurveBody(polygons, font, x1, y1, sx1, sy1, sx2, sy2, x2, y2);
    }
    function drawCurveBody(polygons, font, x1, y1, sx1, sy1, sx2, sy2, x2, y2) {
        var _a = generateFattenCurve(x1, y1, sx1, sy1, sx2, sy2, x2, y2, font.kRate, function () { return font.kWidth; }), left = _a.left, right = _a.right;
        var poly = new Polygon();
        var poly2 = new Polygon();
        // save to polygon
        for (var _i = 0, left_1 = left; _i < left_1.length; _i++) {
            var _b = left_1[_i], x = _b[0], y = _b[1];
            poly.push(x, y);
        }
        for (var _c = 0, right_1 = right; _c < right_1.length; _c++) {
            var _d = right_1[_c], x = _d[0], y = _d[1];
            poly2.push(x, y);
        }
        poly2.reverse();
        poly.concat(poly2);
        polygons.push(poly);
    }
    function cdDrawBezier(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4, a1, a2) {
        cdDrawCurveU(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4);
    }
    function cdDrawCurve(font, polygons, x1, y1, x2, y2, x3, y3, a1, a2) {
        cdDrawCurveU(font, polygons, x1, y1, x2, y2, x2, y2, x3, y3);
    }
    function cdDrawLine(font, polygons, tx1, ty1, tx2, ty2, ta1, ta2) {
        var x1;
        var y1;
        var x2;
        var y2;
        var a1;
        var a2;
        if (tx1 === tx2 && ty1 > ty2 || tx1 > tx2) {
            x1 = tx2;
            y1 = ty2;
            x2 = tx1;
            y2 = ty1;
            a1 = ta2;
            a2 = ta1;
        }
        else {
            x1 = tx1;
            y1 = ty1;
            x2 = tx2;
            y2 = ty2;
            a1 = ta1;
            a2 = ta2;
        }
        var pen1 = new Pen(x1, y1);
        var pen2 = new Pen(x2, y2);
        if (x1 !== x2 || y1 !== y2) { // ?????
            pen1.setDown(x2, y2);
            pen2.setUp(x1, y1);
        }
        switch (a1 % 10) {
            case 2:
                pen1.move(0, -font.kWidth);
                break;
            case 3:
                pen1.move(0, -font.kWidth * font.kKakato);
                break;
        }
        switch (a2 % 10) {
            case 2:
                pen2.move(0, font.kWidth);
                break;
            case 3:
                pen2.move(0, font.kWidth * font.kKakato);
                break;
        }
        // SUICHOKU NO ICHI ZURASHI HA Math.sin TO Math.cos NO IREKAE + x-axis MAINASU KA
        var poly = new Polygon([
            pen1.getPoint(font.kWidth, 0),
            pen2.getPoint(font.kWidth, 0),
            pen2.getPoint(-font.kWidth, 0),
            pen1.getPoint(-font.kWidth, 0),
        ]);
        if (tx1 === tx2) {
            poly.reverse(); // ?????
        }
        polygons.push(poly);
    }

    function dfDrawFont(font, polygons, _a) {
        var a1_100 = _a.a1_100, a2_100 = _a.a2_100, a2_opt = _a.a2_opt, a3_100 = _a.a3_100, a3_opt = _a.a3_opt, a3_opt_1 = _a.a3_opt_1, x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2, x3 = _a.x3, y3 = _a.y3, x4 = _a.x4, y4 = _a.y4;
        switch (a1_100) {
            case 0:
                dfTransform(polygons, x1, y1, x2, y2, a2_100, a3_100, a2_opt, a3_opt);
                break;
            case 1: {
                if (a3_100 === 4) {
                    var _b = (x1 === x2 && y1 === y2)
                        ? [0, font.kMage] // ?????
                        : normalize([x1 - x2, y1 - y2], font.kMage), dx1 = _b[0], dy1 = _b[1];
                    var tx1 = x2 + dx1;
                    var ty1 = y2 + dy1;
                    cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100, 1);
                    cdDrawCurve(font, polygons, tx1, ty1, x2, y2, x2 - font.kMage * 2, y2 - font.kMage * 0.5);
                }
                else {
                    cdDrawLine(font, polygons, x1, y1, x2, y2, a2_100, a3_100);
                }
                break;
            }
            case 2:
            case 12: {
                if (a3_100 === 4) {
                    var _c = (x2 === x3)
                        ? [0, -font.kMage] // ?????
                        : (y2 === y3)
                            ? [-font.kMage, 0] // ?????
                            : normalize([x2 - x3, y2 - y3], font.kMage), dx1 = _c[0], dy1 = _c[1];
                    var tx1 = x3 + dx1;
                    var ty1 = y3 + dy1;
                    cdDrawCurve(font, polygons, x1, y1, x2, y2, tx1, ty1);
                    cdDrawCurve(font, polygons, tx1, ty1, x3, y3, x3 - font.kMage * 2, y3 - font.kMage * 0.5);
                }
                else if (a3_100 === 5 && a3_opt === 0) {
                    var tx1 = x3 + font.kMage;
                    var ty1 = y3;
                    var tx2 = tx1 + font.kMage * 0.5;
                    var ty2 = y3 - font.kMage * 2;
                    cdDrawCurve(font, polygons, x1, y1, x2, y2, x3, y3);
                    cdDrawCurve(font, polygons, x3, y3, tx1, ty1, tx2, ty2);
                }
                else {
                    cdDrawCurve(font, polygons, x1, y1, x2, y2, x3, y3);
                }
                break;
            }
            case 3: {
                var _d = (x1 === x2 && y1 === y2)
                    ? [0, font.kMage] // ?????
                    : normalize([x1 - x2, y1 - y2], font.kMage), dx1 = _d[0], dy1 = _d[1];
                var tx1 = x2 + dx1;
                var ty1 = y2 + dy1;
                var _e = (x2 === x3 && y2 === y3)
                    ? [0, -font.kMage] // ?????
                    : normalize([x3 - x2, y3 - y2], font.kMage), dx2 = _e[0], dy2 = _e[1];
                var tx2 = x2 + dx2;
                var ty2 = y2 + dy2;
                cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100, 1);
                cdDrawCurve(font, polygons, tx1, ty1, x2, y2, tx2, ty2);
                if (a3_100 === 5 && a3_opt_1 === 0) {
                    var tx3 = x3 - font.kMage;
                    var ty3 = y3;
                    var tx4 = x3 + font.kMage * 0.5;
                    var ty4 = y3 - font.kMage * 2;
                    cdDrawLine(font, polygons, tx2, ty2, tx3, ty3, 1, 1);
                    cdDrawCurve(font, polygons, tx3, ty3, x3, y3, tx4, ty4);
                }
                else {
                    cdDrawLine(font, polygons, tx2, ty2, x3, y3, 1, a3_100);
                }
                break;
            }
            case 4: {
                var rate = hypot(x3 - x2, y3 - y2) / 120 * 6;
                if (rate > 6) {
                    rate = 6;
                }
                var _f = (x1 === x2 && y1 === y2)
                    ? [0, font.kMage * rate] // ?????
                    : normalize([x1 - x2, y1 - y2], font.kMage * rate), dx1 = _f[0], dy1 = _f[1];
                var tx1 = x2 + dx1;
                var ty1 = y2 + dy1;
                var _g = (x2 === x3 && y2 === y3)
                    ? [0, -font.kMage * rate] // ?????
                    : normalize([x3 - x2, y3 - y2], font.kMage * rate), dx2 = _g[0], dy2 = _g[1];
                var tx2 = x2 + dx2;
                var ty2 = y2 + dy2;
                cdDrawLine(font, polygons, x1, y1, tx1, ty1, a2_100, 1);
                cdDrawCurve(font, polygons, tx1, ty1, x2, y2, tx2, ty2);
                if (a3_100 === 5 && a3_opt === 0) {
                    var tx3 = x3 - font.kMage;
                    var ty3 = y3;
                    var tx4 = x3 + font.kMage * 0.5;
                    var ty4 = y3 - font.kMage * 2;
                    cdDrawLine(font, polygons, tx2, ty2, tx3, ty3, 1, 1);
                    cdDrawCurve(font, polygons, tx3, ty3, x3, y3, tx4, ty4);
                }
                else {
                    cdDrawLine(font, polygons, tx2, ty2, x3, y3, 1, a3_100);
                }
                break;
            }
            case 6: {
                if (a3_100 === 4) {
                    var _h = (x3 === x4)
                        ? [0, -font.kMage] // ?????
                        : (y3 === y4)
                            ? [-font.kMage, 0] // ?????
                            : normalize([x3 - x4, y3 - y4], font.kMage), dx1 = _h[0], dy1 = _h[1];
                    var tx1 = x4 + dx1;
                    var ty1 = y4 + dy1;
                    cdDrawBezier(font, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1);
                    cdDrawCurve(font, polygons, tx1, ty1, x4, y4, x4 - font.kMage * 2, y4 - font.kMage * 0.5);
                }
                else if (a3_100 === 5 && a3_opt === 0) {
                    var tx1 = x4 - font.kMage;
                    var ty1 = y4;
                    var tx2 = x4 + font.kMage * 0.5;
                    var ty2 = y4 - font.kMage * 2;
                    /*
                    cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
                    cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, tx1, ty1, 1, 1);
                     */
                    cdDrawBezier(font, polygons, x1, y1, x2, y2, x3, y3, tx1, ty1);
                    cdDrawCurve(font, polygons, tx1, ty1, x4, y4, tx2, ty2);
                }
                else {
                    /*
                    cdDrawCurve(x1, y1, x2, y2, (x2 + x3) / 2, (y2 + y3) / 2, a2, 1);
                    cdDrawCurve((x2 + x3) / 2, (y2 + y3) / 2, x3, y3, x4, y4, 1, a3);
                     */
                    cdDrawBezier(font, polygons, x1, y1, x2, y2, x3, y3, x4, y4);
                }
                break;
            }
            case 7: {
                cdDrawLine(font, polygons, x1, y1, x2, y2, a2_100, 1);
                cdDrawCurve(font, polygons, x2, y2, x3, y3, x4, y4);
                break;
            }
        }
    }
    /** Gothic style font. */
    var Gothic = /** @class */ (function (_super) {
        __extends(Gothic, _super);
        function Gothic() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.shotai = KShotai.kGothic;
            return _this;
        }
        /** @internal */
        Gothic.prototype.getDrawers = function (strokesArray) {
            var _this = this;
            return strokesArray.map(function (stroke) { return function (polygons) {
                dfDrawFont(_this, polygons, stroke);
            }; });
        };
        return Gothic;
    }(Mincho));

    function select(shotai) {
        switch (shotai) {
            case KShotai.kMincho:
                return new Mincho();
            default:
                return new Gothic();
        }
    }

    /**
     * The entry point for KAGE engine (Kanji-glyph Automatic Generating Engine).
     * It generates glyph outlines from a kanji's stroke data described in a dedicated
     * intermediate format called {@link https://glyphwiki.org/wiki/GlyphWiki:KAGE%e3%83%87%e3%83%bc%e3%82%bf%e4%bb%95%e6%a7%98 | KAGE data}.
     *
     * KAGE data may contain references to other glyphs (components), which are
     * resolved using a storage at its {@link kBuhin} property. The data for the
     * referenced glyphs must be registered to the storage prior to generating the outline.
     *
     * The font (mincho or gothic) can be changed with its {@link kShotai} property.
     * The font parameters (stroke width, etc.) can be configured with properties of
     * {@link kFont}.
     *
     * @see {@link Kage.makeGlyph}, {@link Kage.makeGlyph2}, {@link Kage.makeGlyph3} and
     *     {@link Kage.makeGlyphSeparated} for usage examples.
     */
    var Kage = /** @class */ (function () {
        function Kage(size) {
            /**
             * An alias of {@link KShotai.kMincho}.
             * @see {@link Kage.kShotai} for usage.
             */
            this.kMincho = KShotai.kMincho;
            /**
             * An alias of {@link KShotai.kGothic}.
             * @see {@link Kage.kShotai} for usage.
             */
            this.kGothic = KShotai.kGothic;
            /**
             * Provides the way to configure parameters of the currently selected font.
             * Its parameters are reset to the default values when {@link Kage.kShotai} is set.
             * @example
             * ```ts
             * const kage = new Kage();
             * kage.kFont.kRate = 50;
             * kage.kFont.kWidth = 3;
             * ```
             */
            this.kFont = select(KShotai.kMincho);
            // Probably this can be removed. Keeping here just in case someone is using it...
            /** @internal */
            this.stretch = stretch;
            this.kFont.setSize(size);
            this.kBuhin = new Buhin();
        }
        Object.defineProperty(Kage.prototype, "kShotai", {
            // properties
            /**
             * Gets or sets the font as {@link KShotai}. Setting this property resets all the
             * font parameters in {@link Kage.kFont}. Defaults to {@link KShotai.kMincho}.
             * @example
             * ```ts
             * const kage = new Kage();
             * kage.kShotai = kage.kGothic;
             * ```
             */
            get: function () {
                return this.kFont.shotai;
            },
            set: function (shotai) {
                this.kFont = select(shotai);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Kage.prototype, "kUseCurve", {
            /**
             * Whether to generate contours with off-curve points.
             * An alias of {@link Kage.kFont}.kUseCurve.
             */
            get: function () {
                return this.kFont.kUseCurve;
            },
            set: function (value) {
                this.kFont.kUseCurve = value;
            },
            enumerable: false,
            configurable: true
        });
        // method
        /**
         * Renders the glyph of the given name. Existing data in `polygons` (if any) are
         * NOT cleared; new glyph is "overprinted".
         * @example
         * ```ts
         * const kage = new Kage();
         * kage.kBuhin.push("uXXXX", "1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
         * const polygons = new Polygons();
         * kage.makeGlyph(polygons, "uXXXX");
         * const svg = polygons.generateSVG(); // now `svg` has the string of the rendered glyph
         * ```
         * @param polygons A {@link Polygons} instance on which the glyph is rendered.
         * @param buhin The name of the glyph to be rendered.
         */
        Kage.prototype.makeGlyph = function (polygons, buhin) {
            var glyphData = this.kBuhin.search(buhin);
            this.makeGlyph2(polygons, glyphData);
        };
        /**
         * Renders the glyph of the given KAGE data. Existing data in `polygons` (if any) are
         * NOT cleared; new glyph is "overprinted".
         * @example
         * ```ts
         * const kage = new Kage();
         * const polygons = new Polygons();
         * kage.makeGlyph2(polygons, "1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
         * const svg = polygons.generateSVG(); // now `svg` has the string of the rendered glyph
         * ```
         * @param polygons A {@link Polygons} instance on which the glyph is rendered.
         * @param data The KAGE data to be rendered (in which lines are delimited by `"$"`).
         */
        Kage.prototype.makeGlyph2 = function (polygons, data) {
            if (data !== "") {
                var strokesArray = this.getEachStrokes(data);
                var drawers = this.kFont.getDrawers(strokesArray);
                for (var _i = 0, drawers_1 = drawers; _i < drawers_1.length; _i++) {
                    var draw = drawers_1[_i];
                    draw(polygons);
                }
            }
        };
        /**
         * Renders each stroke of the given KAGE data on separate instances of
         * {@link Polygons}.
         * @example
         * ```ts
         * const kage = new Kage();
         * const array = kage.makeGlyph3("1:0:2:32:31:176:31$2:22:7:176:31:170:43:156:63");
         * console.log(array.length); // => 2
         * console.log(array[0] instanceof Polygons); // => true
         * ```
         * @param data The KAGE data to be rendered (in which lines are delimited by `"$"`).
         * @returns An array of {@link Polygons} instances holding the rendered data
         *     of each stroke in the glyph.
         */
        Kage.prototype.makeGlyph3 = function (data) {
            var result = [];
            if (data !== "") {
                var strokesArray = this.getEachStrokes(data);
                var drawers = this.kFont.getDrawers(strokesArray);
                for (var _i = 0, drawers_2 = drawers; _i < drawers_2.length; _i++) {
                    var draw = drawers_2[_i];
                    var polygons = new Polygons();
                    draw(polygons);
                    result.push(polygons);
                }
            }
            return result;
        };
        /**
         * Renders each KAGE data fragment in the given array on separate instances of
         * {@link Polygons}, with stroke parameters adjusted as if all the fragments joined
         * together compose a single glyph.
         * @example
         * ```ts
         * const kage = new Kage();
         * const array = kage.makeGlyphSeparated([
         * 	"2:7:8:31:16:32:53:16:65",
         * 	"1:2:2:32:31:176:31$2:22:7:176:31:170:43:156:63",
         * ]);
         * console.log(array.length); // => 2
         * console.log(array[0] instanceof Polygons); // => true
         * ```
         * @param data An array of KAGE data fragments (in which lines are delimited by `"$"`)
         *     to be rendered.
         * @returns An array of {@link Polygons} instances holding the rendered data
         *     of each KAGE data fragment.
         */
        // Added by @kurgm
        Kage.prototype.makeGlyphSeparated = function (data) {
            var _this = this;
            var strokesArrays = data.map(function (subdata) { return _this.getEachStrokes(subdata); });
            var drawers = this.kFont.getDrawers(strokesArrays.reduce(function (left, right) { return left.concat(right); }, []));
            var polygons = new Polygons();
            var strokeIndex = 0;
            return strokesArrays.map(function (_a) {
                var strokeCount = _a.length;
                var startIndex = polygons.array.length;
                for (var _i = 0, _b = drawers.slice(strokeIndex, strokeIndex + strokeCount); _i < _b.length; _i++) {
                    var draw = _b[_i];
                    draw(polygons);
                }
                strokeIndex += strokeCount;
                var result = new Polygons();
                result.array = polygons.array.slice(startIndex);
                return result;
            });
        };
        Kage.prototype.getEachStrokes = function (glyphData) {
            var strokesArray = [];
            var strokes = glyphData.split("$");
            for (var _i = 0, strokes_1 = strokes; _i < strokes_1.length; _i++) {
                var stroke = strokes_1[_i];
                var columns = stroke.split(":");
                if (Math.floor(+columns[0]) !== 99) {
                    strokesArray.push(new Stroke([
                        Math.floor(+columns[0]),
                        Math.floor(+columns[1]),
                        Math.floor(+columns[2]),
                        Math.floor(+columns[3]),
                        Math.floor(+columns[4]),
                        Math.floor(+columns[5]),
                        Math.floor(+columns[6]),
                        Math.floor(+columns[7]),
                        Math.floor(+columns[8]),
                        Math.floor(+columns[9]),
                        Math.floor(+columns[10]),
                    ]));
                }
                else {
                    var buhin = this.kBuhin.search(columns[7]);
                    if (buhin !== "") {
                        strokesArray = strokesArray.concat(this.getEachStrokesOfBuhin(buhin, Math.floor(+columns[3]), Math.floor(+columns[4]), Math.floor(+columns[5]), Math.floor(+columns[6]), Math.floor(+columns[1]), Math.floor(+columns[2]), Math.floor(+columns[9]), Math.floor(+columns[10])));
                    }
                }
            }
            return strokesArray;
        };
        Kage.prototype.getEachStrokesOfBuhin = function (buhin, x1, y1, x2, y2, sx, sy, sx2, sy2) {
            var strokes = this.getEachStrokes(buhin);
            var box = this.getBox(strokes);
            if (sx !== 0 || sy !== 0) {
                if (sx > 100) {
                    sx -= 200;
                }
                else {
                    sx2 = 0;
                    sy2 = 0;
                }
            }
            for (var _i = 0, strokes_2 = strokes; _i < strokes_2.length; _i++) {
                var stroke = strokes_2[_i];
                if (sx !== 0 || sy !== 0) {
                    stroke.stretch(sx, sx2, sy, sy2, box.minX, box.maxX, box.minY, box.maxY);
                }
                stroke.x1 = x1 + stroke.x1 * (x2 - x1) / 200;
                stroke.y1 = y1 + stroke.y1 * (y2 - y1) / 200;
                stroke.x2 = x1 + stroke.x2 * (x2 - x1) / 200;
                stroke.y2 = y1 + stroke.y2 * (y2 - y1) / 200;
                stroke.x3 = x1 + stroke.x3 * (x2 - x1) / 200;
                stroke.y3 = y1 + stroke.y3 * (y2 - y1) / 200;
                stroke.x4 = x1 + stroke.x4 * (x2 - x1) / 200;
                stroke.y4 = y1 + stroke.y4 * (y2 - y1) / 200;
            }
            return strokes;
        };
        Kage.prototype.getBox = function (strokes) {
            var minX = 200;
            var minY = 200;
            var maxX = 0;
            var maxY = 0;
            for (var _i = 0, strokes_3 = strokes; _i < strokes_3.length; _i++) {
                var stroke = strokes_3[_i];
                var _a = stroke.getBox(), sminX = _a.minX, smaxX = _a.maxX, sminY = _a.minY, smaxY = _a.maxY;
                minX = Math.min(minX, sminX);
                maxX = Math.max(maxX, smaxX);
                minY = Math.min(minY, sminY);
                maxY = Math.max(maxY, smaxY);
            }
            return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
        };
        /** An alias of Buhin constructor. */
        Kage.Buhin = Buhin;
        /** An alias of Polygons constructor. */
        Kage.Polygons = Polygons;
        return Kage;
    }());

    return Kage;

})();
