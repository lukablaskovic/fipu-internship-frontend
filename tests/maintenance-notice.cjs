// Run: node tests/maintenance-notice.cjs
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { parse, compileScript } = require('@vue/compiler-sfc');
const { transformSync } = require('esbuild');
const { descriptor } = parse(readFileSync(`${__dirname}/../src/components/Notification/MaintenanceNotice.vue`, 'utf8'));
const { code } = transformSync(compileScript(descriptor, { id: 'notice' }).content, { format: 'cjs' });
function mount(storage) {
	const module = { exports: {} };
	const dependency = (name) => name === 'vue' ? require('vue') : { useRoute: () => ({ name: 'login' }) };
	new Function('require', 'module', 'exports', 'localStorage', code)(dependency, module, module.exports, storage);
	return module.exports.default.setup({}, { expose() {} });
}
const values = new Map();
const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
const firstVisit = mount(storage);
assert.equal(firstVisit.noticeDismissed.value, false);
firstVisit.dismissNotice();
assert.equal(firstVisit.noticeDismissed.value, true);
assert.equal(mount(storage).noticeDismissed.value, true, 'Dismissal survives a fresh component mount');
const blocked = mount({ getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } });
assert.equal(blocked.noticeDismissed.value, false);
blocked.dismissNotice();
assert.equal(blocked.noticeDismissed.value, true, 'Blocked storage must not prevent dismissal');
console.log('Maintenance notice persistence checks passed.');
