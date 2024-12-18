import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

import pkg from "./package.json" with { type: "json" };

const banner = `/*! kage.js v${pkg.version}
 *  Licensed under ${pkg.license}
 *  ${pkg.homepage}
 */`;

/** @type {import("rollup").RollupOptions} */
const options = [
	{
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
		plugins: [
			typescript({}),
		],
	},
	{
		input: "src/index.ts",
		output: [
			{
				file: "dist/kage.min.mjs",
				format: "es",
				banner,
				plugins: [terser()],
			},
		],
		plugins: [
			typescript({
				target: "es6",
			}),
		],
	},
];

export default options;
