import path from "path";
import { fileURLToPath } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
	//base: "/fipu/",
	assetsInclude: "**/*.xml",
	plugins: [vue()],
	resolve: {
		alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
	},
	server: {
		host: "0.0.0.0",
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					vue: ["vue"],
					vendor: ["axios"],
				},
			},
		},
	},
});
