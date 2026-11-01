const { defineConfig } = require("@playwright/test");
module.exports = defineConfig({
	testDir: "./tests",
	testMatch: "**/*.spec.cjs",
	workers: 1,
	use: { baseURL: "http://127.0.0.1:4175", launchOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {} },
	webServer: { command: "npm run dev -- --host 127.0.0.1 --port 4175", url: "http://127.0.0.1:4175/tests/reka.html", reuseExistingServer: false },
});
