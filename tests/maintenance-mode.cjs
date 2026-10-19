// Run: node tests/maintenance-mode.cjs
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { transformSync } = require('esbuild');
const configModule = { exports: {} };
new Function('module', transformSync(readFileSync(`${__dirname}/../src/config.js`, 'utf8'), { format: 'cjs' }).code)(configModule);
const config = configModule.exports;
assert.equal(config.MAINTENANCE_MODE, true);
let guard;
const mainStore = { maintenanceMode: false, userAuthenticated: false, userAdmin: false };
const dependencies = {
	'vue-router': { createWebHistory() {}, createRouter: () => ({ beforeEach: (callback) => { guard = callback; } }) },
	'@/main.js': { mainStore, layoutStore: { tooltip: {} } },
	'@/config.js': config,
	'./routes.js': { routes: [] },
};
const source = transformSync(readFileSync(`${__dirname}/../src/router/index.js`, 'utf8'), { format: 'cjs' }).code;
new Function('require', 'module', source)((name) => dependencies[name], { exports: {} });
for (const role of ['guest', 'student', 'admin']) {
	mainStore.userAuthenticated = role !== 'guest';
	mainStore.userAdmin = role === 'admin';
	for (const path of ['/', '/prijava', '/moja-praksa', '/dashboard', '/poslodavci/novi-zadatak', '/odrzavanje']) {
		let destination;
		guard({ path, matched: [] }, {}, (value) => { destination = value; });
		assert.equal(destination, path === '/odrzavanje' ? undefined : '/odrzavanje', `${role}: ${path}`);
	}
}
console.log('Maintenance redirects pass, including stale browser state and loop prevention.');
