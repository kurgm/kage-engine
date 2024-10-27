// @ts-check

import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			ecmaVersion: 5,
			parserOptions: {
				project: "./tsconfig.json",
			},
		},
		rules: {
			"arrow-body-style": "error",
			"eqeqeq": "error",
			"grouped-accessor-pairs": "error",
			"guard-for-in": "error",
			"no-caller": "error",
			"no-constructor-return": "error",
			"no-eval": "error",
			"no-else-return": ["warn", { allowElseIf: false }],
			"no-extra-label": "warn",
			"no-template-curly-in-string": "warn",
			"no-unmodified-loop-condition": "warn",
			"no-useless-computed-key": "error",
			"no-useless-rename": "error",
			"no-useless-return": "error",
			"object-shorthand": "error",
			"prefer-exponentiation-operator": "warn",
			"prefer-numeric-literals": "error",
			"prefer-object-spread": "error",
			"prefer-regex-literals": "error",
			"prefer-template": "error",
			"unicode-bom": "error",
			"@typescript-eslint/class-methods-use-this": "warn",
			"@typescript-eslint/explicit-module-boundary-types": "error",
			"@typescript-eslint/no-dupe-class-members": "error",
			"@typescript-eslint/no-extraneous-class": "warn",
			"@typescript-eslint/no-inferrable-types": "off",
			"@typescript-eslint/no-invalid-this": "error",
			"@typescript-eslint/no-invalid-void-type": "error",
			"@typescript-eslint/no-namespace": "off",
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/no-unnecessary-qualifier": "warn",
			"@typescript-eslint/no-unnecessary-type-arguments": "warn",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-useless-constructor": "error",
			"@typescript-eslint/parameter-properties": "warn",
			"@typescript-eslint/prefer-reduce-type-parameter": "error",
			"@typescript-eslint/prefer-string-starts-ends-with": "warn",
		},
	},
	{
		plugins: {
			"@stylistic": stylistic,
		},
		rules: {
			"@stylistic/array-bracket-spacing": "error",
			"@stylistic/arrow-parens": "error",
			"@stylistic/arrow-spacing": "error",
			"@stylistic/block-spacing": "error",
			"@stylistic/brace-style": ["error", "1tbs"],
			"@stylistic/comma-dangle": ["error", "always-multiline"],
			"@stylistic/comma-spacing": "error",
			"@stylistic/comma-style": "error",
			"@stylistic/computed-property-spacing": "error",
			"@stylistic/eol-last": "error",
			"@stylistic/function-call-spacing": "error",
			"@stylistic/generator-star-spacing": "error",
			"@stylistic/indent": ["error", "tab"],
			"@stylistic/key-spacing": "error",
			"@stylistic/keyword-spacing": "error",
			"@stylistic/linebreak-style": "error",
			"@stylistic/max-statements-per-line": "warn",
			"@stylistic/new-parens": "error",
			"@stylistic/no-extra-semi": "error",
			"@stylistic/no-multi-spaces": "error",
			"@stylistic/no-whitespace-before-property": "error",
			"@stylistic/object-curly-spacing": ["error", "always"],
			"@stylistic/quote-props": ["error", "consistent-as-needed"],
			"@stylistic/quotes": ["error", "double", { avoidEscape: true }],
			"@stylistic/rest-spread-spacing": "error",
			"@stylistic/semi": "error",
			"@stylistic/semi-spacing": "error",
			"@stylistic/space-before-blocks": "error",
			"@stylistic/space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always" }],
			"@stylistic/space-in-parens": "error",
			"@stylistic/space-infix-ops": "error",
			"@stylistic/space-unary-ops": "error",
			"@stylistic/switch-colon-spacing": "error",
			"@stylistic/template-curly-spacing": "error",
			"@stylistic/template-tag-spacing": "error",
			"@stylistic/yield-star-spacing": "error",
		},
	},
	{
		files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
		...tseslint.configs.disableTypeChecked,
	},
	{
		ignores: ["dist/", "lib/"],
	},
);