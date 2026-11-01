// Run: node tests/maintenance-mode.cjs
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { transformSync } = require('esbuild');
const configModule = { exports: {} };
const configSource = readFileSync(`${__dirname}/../src/config.js`, 'utf8');
function loadConfig(dev, local, storage, navigate = () => {}) {
	const module = { exports: {} };
	new Function('module', 'sessionStorage', 'window', transformSync(configSource, { format: 'cjs', define: { 'import.meta.env': JSON.stringify({ DEV: dev, VITE_LOCAL_DEV: local }) } }).code)(module, storage, { location: { assign: navigate } });
	return module.exports;
}
configModule.exports = loadConfig(false, 'true');
const config = configModule.exports;
assert.equal(config.MAINTENANCE_MODE, true);
assert.equal(config.LOCAL_DEV, false, 'Production builds must never enable local login');
assert.equal(loadConfig(true, undefined).LOCAL_DEV, false, 'Unconfigured dev defaults to real data');
assert.equal(loadConfig(true, undefined).MAINTENANCE_MODE, false, 'Both dev modes must allow login');
const local = loadConfig(true, 'true');
assert.equal(local.MAINTENANCE_MODE, false);
for (const url of Object.values(local.endpoints)) assert.equal(new URL(url).hostname, 'localhost');
const values = new Map([['token', 'old-token'], ['main', 'old-user'], ['student', 'old-data'], ['admin', 'old-data']]);
const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), clear: () => values.clear() };
let destination;
loadConfig(true, 'true', storage, (path) => { destination = path; }).setLocalDevelopment(false);
assert.deepEqual([...values], [['dev-data-mode', 'real']], 'Changing modes must discard auth and cached records');
assert.equal(destination, '/prijava');
const real = loadConfig(true, 'true', storage);
assert.equal(real.LOCAL_DEV, false);
assert.equal(real.MAINTENANCE_MODE, false);
for (const url of Object.values(real.endpoints)) assert.notEqual(new URL(url).hostname, 'localhost');
values.set('token', 'real-token');
real.clearSession();
assert.deepEqual([...values], [['dev-data-mode', 'real']], 'Logout must preserve the selected mode');
real.setLocalDevelopment(true);
assert.equal(loadConfig(true, undefined, storage).LOCAL_DEV, true);
const production = loadConfig(false, 'true', storage);
assert.equal(production.LOCAL_DEV, false, 'Production ignores saved local mode');
production.setLocalDevelopment(false);
assert.equal(values.get('dev-data-mode'), 'local', 'Production cannot switch modes');
assert.equal(loadConfig(true, 'true', { getItem() { throw new Error('blocked'); } }).LOCAL_DEV, true);
assert.throws(() => loadConfig(true, 'true', { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } }).setLocalDevelopment(false), /blocked/);
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
dependencies['@/config.js'] = real;
new Function('require', 'module', source)((name) => dependencies[name], { exports: {} });
mainStore.userAuthenticated = false;
mainStore.userAdmin = false;
mainStore.maintenanceMode = true;
destination = 'not called';
guard({ path: '/prijava', matched: [] }, {}, (value) => { destination = value; });
assert.equal(destination, undefined, 'Real dev login must remain reachable even with stale maintenance state');
console.log('Maintenance redirects pass, including stale browser state and loop prevention.');
