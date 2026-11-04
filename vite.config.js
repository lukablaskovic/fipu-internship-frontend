/* eslint-env node */
const path = require("node:path");
const vue = require("@vitejs/plugin-vue").default;
const { defineConfig } = require("vite");

// https://vitejs.dev/config/
module.exports = defineConfig({
	//base: "/fipu/",
	assetsInclude: "**/*.xml",
	plugins: [vue()],
	define: {
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
	},
	resolve: {
		alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
	},
	server: {
		host: "0.0.0.0",
		hmr: {
			overlay: false,
		},
		headers: {
			"Cross-Origin-Opener-Policy": "unsafe-none",
			"Cross-Origin-Embedder-Policy": "unsafe-none",
		},
	},
	build: {
		// Keep the technology catalog's SVGs as assets so browsers load only visible icons.
		assetsInlineLimit: 0,
	},
});
