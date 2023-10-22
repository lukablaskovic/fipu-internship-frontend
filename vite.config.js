import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	//base: "/fipu/",
	assetsInclude: "**/*.xml",
	plugins: [vue()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
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
	define: {
		"process.env.VITE_FRONTEND_URL": JSON.stringify(process.env.VITE_FRONTEND_URL),
		"process.env.VITE_GATEWAY_API_URL": JSON.stringify(process.env.VITE_GATEWAY_API_URL),
	},
});
