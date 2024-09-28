/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	root: true,
	extends: ["plugin:vue/vue3-recommended", "eslint:recommended", "@vue/eslint-config-prettier"],
	parserOptions: {
		ecmaVersion: "latest",
	},
	compilerOptions: {
		target: "ESNext",
		module: "ESNext",
		jsx: "preserve",
		strict: true,
		esModuleInterop: true,
	},
	include: [
		"src/**/*.ts",
		"src/**/*.d.ts",
		"src/**/*.tsx",
		"src/**/*.vue", // Include .vue files
	],
};
