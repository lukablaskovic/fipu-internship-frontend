const assert = require('node:assert/strict');
const { createServer } = require('vite');
const { createServer: createHttpServer } = require('node:http');
const { createSSRApp, h } = require('vue');
const { renderToString } = require('vue/server-renderer');

(async () => {
	const server = await createServer({ server: { middlewareMode: true, hmr: { server: createHttpServer() } }, appType: 'custom' });
	try {
		const { default: TableCellText } = await server.ssrLoadModule('/src/components/Tables/TableCellText.vue');
		const render = (value, slots) => renderToString(createSSRApp({ render: () => h(TableCellText, { value }, slots) }));
		for (const value of [null, '', ' \n\t', 0, false, 'riječ '.repeat(25).trim()]) {
			assert.doesNotMatch(await render(value), /aria-haspopup/);
		}
		assert.match(await render(0), />0</);
		assert.match(await render(false), />false</);
		const long = `${'riječ\n\t'.repeat(25)}zadnja`;
		const html = await render(long);
		assert.match(html, /aria-haspopup="dialog"/);
		assert.match(html, /Prikaži više/);
		assert.doesNotMatch(html, /zadnja/);
		assert.match(await render('<script>alert(1)</script>'), /&lt;script&gt;/);
		assert.match(await render('Poveznica', { default: () => h('a', { href: '/zadaci' }, 'Poveznica') }), /href="\/zadaci"/);
		console.log('Table text checks passed: 25/26-word boundary, whitespace, empty values, numbers, HTML escaping and links.');
	} finally {
		await server.close();
	}
})().catch((error) => { console.error(error); process.exitCode = 1; });
