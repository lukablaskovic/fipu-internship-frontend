const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const vm = require("node:vm");

test("copy feedback follows clipboard success and resets after repeated copies", async () => {
	const source = readFileSync("src/components/Form/FormControl.vue", "utf8");
	const timers = new Map();
	let timerId = 0;
	let cleanup;
	let fail = false;
	const writes = [];
	const context = vm.createContext({
		ref: (value) => ({ value }),
		onBeforeUnmount: (callback) => { cleanup = callback; },
		props: { copyable: true, modelValue: "https://example.com/poslodavci/novi-zadatak" },
		navigator: { clipboard: { writeText: async (value) => {
			if (fail) throw new Error("Clipboard denied");
			writes.push(value);
		} } },
		console: { error() {} },
		clearTimeout: (id) => timers.delete(id),
		setTimeout: (callback, delay) => { timers.set(++timerId, { callback, delay }); return timerId; },
	});
	vm.runInContext(source.slice(source.indexOf("const copied ="), source.indexOf("if (props.ctrlKFocus)")) + "\nglobalThis.feedback = { copied, copyToClipboard };", context);
	const { copied, copyToClipboard } = context.feedback;
	await copyToClipboard();
	assert.deepEqual(writes, [context.props.modelValue]);
	assert.equal(copied.value, true);
	await copyToClipboard();
	assert.equal(timers.size, 1);
	const timer = [...timers.values()][0];
	assert.equal(timer.delay, 2000);
	timer.callback();
	assert.equal(copied.value, false);
	fail = true;
	await copyToClipboard();
	assert.equal(copied.value, false);
	cleanup();
	assert.equal(timers.size, 0);
	assert.ok(!source.includes("snackBarStore"));
});
