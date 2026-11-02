/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	root: true,
	ignorePatterns: ["vendor/**", "dist/**"],
	extends: ["plugin:vue/vue3-recommended", "eslint:recommended", "@vue/eslint-config-prettier/skip-formatting"],
	env: { browser: true, es2022: true },
	overrides: [
		{ files: ["*.cjs", "*.config.js"], env: { node: true } },
		{
			files: ["**/*.vue"],
			parserOptions: { parser: "@typescript-eslint/parser" },
		},
		{ files: ["**/*.ts", "**/*.tsx"], parser: "@typescript-eslint/parser" },
	],
	parserOptions: {
		ecmaVersion: "latest",
	},
};
