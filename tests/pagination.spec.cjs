const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
	await page.goto('/tests/pagination.html');
});

test('pages, edges, keyboard, and external selection keep the right rows', async ({ page }) => {
	const nav = page.getByRole('navigation');
	await expect(nav.getByRole('button', { name: 'Prethodna stranica', exact: true })).toBeDisabled();
	await expect(page.getByTestId('rows')).toHaveText('1,2,3,4,5,6,7,8,9,10');
	await nav.getByRole('button', { name: 'Stranica 2', exact: true }).click();
	await expect(page.getByTestId('rows')).toHaveText('11,12,13,14,15,16,17,18,19,20');
	await nav.getByRole('button', { name: 'Sljedeća stranica', exact: true }).focus();
	await page.keyboard.press('Enter');
	await expect(page.getByTestId('rows')).toHaveText('21,22,23,24,25,26,27,28,29,30');
	await page.getByRole('button', { name: 'Highlight row 41' }).click();
	await expect(nav.locator('[aria-current="page"]')).toHaveText('5');
	await expect(nav.locator('[data-type="ellipsis"]')).not.toHaveCount(0);
	await nav.getByRole('button', { name: 'Posljednja stranica', exact: true }).click();
	await expect(page.getByTestId('rows')).toHaveText('91,92,93,94,95');
	await expect(nav.getByRole('button', { name: 'Sljedeća stranica', exact: true })).toBeDisabled();
	await nav.getByRole('button', { name: 'Prva stranica', exact: true }).click();
	await expect(nav.locator('[aria-current="page"]')).toHaveText('1');
});

test('filters, page sizes, and empty results stay in range on mobile', async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 700 });
	await page.getByRole('button', { name: 'Posljednja stranica', exact: true }).click();
	await page.getByRole('button', { name: 'Filter', exact: true }).click();
	await expect(page.getByTestId('rows')).toHaveText('11,12');
	await page.getByRole('button', { name: 'Page size', exact: true }).click();
	await expect(page.getByTestId('rows')).toHaveText('1,2,3,4,5');
	await page.getByRole('button', { name: 'Empty', exact: true }).click();
	await expect(page.getByTestId('rows')).toHaveText('');
	for (const button of await page.getByRole('navigation').getByRole('button').all()) await expect(button).toBeDisabled();
	await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
