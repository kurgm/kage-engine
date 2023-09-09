/* eslint-disable */

import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

import pkg from "./package.json" assert { type: "json" };

const banner = `/*! kage.js v${pkg.version}
 *  Licensed under ${pkg.license}
 *  ${pkg.homepage}
 */`;

export default {
	input: "src/browser.ts",
	output: [
		{
			file: "dist/kage.js",
			format: "iife",
			name: "Kage",
			exports: "default",
			banner,
		},
		{
			file: "dist/kage.min.js",
			format: "iife",
			name: "Kage",
			exports: "default",
			banner,
			plugins: [terser()],
		},
	],
	plugins: [typescript({ tsconfig: false, target: "es5" })],
};
