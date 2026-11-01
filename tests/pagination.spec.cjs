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
	await expect(page.getByRole('navigation')).toHaveCount(0);
	await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

 test('page-size dropdown matches pagination height and updates rows', async ({ page }) => {
 const trigger = page.getByRole('button', { name: 'Otvori izbornik' });
 const next = page.getByRole('button', { name: 'Sljedeća stranica', exact: true });
 expect((await trigger.boundingBox()).height).toBe((await next.boundingBox()).height);
 await trigger.click();
 await page.getByRole('menuitem', { name: '20 stavki po stranici' }).click();
 await expect(page.getByTestId('rows')).toHaveText(Array.from({ length: 20 }, (_, i) => i + 1).join(','));
 await expect(trigger).toBeFocused();
 });


test('shared calculations clamp filtered rows even when pagination is unmounted', async ({ page }) => {
	await page.getByRole('button', { name: 'Posljednja stranica', exact: true }).click();
	await page.getByRole('button', { name: 'Hide pagination', exact: true }).click();
	await expect(page.getByRole('navigation')).toHaveCount(0);
	await page.getByRole('button', { name: 'Filter', exact: true }).click();
	await expect(page.getByTestId('rows')).toHaveText('11,12');
	await expect(page.getByTestId('page')).toHaveText('2 / 2');
	await page.getByRole('button', { name: 'Empty', exact: true }).click();
	await expect(page.getByTestId('rows')).toHaveText('');
	await expect(page.getByTestId('page')).toHaveText('0 / 0');
	await page.getByRole('button', { name: 'Restore', exact: true }).click();
	await expect(page.getByTestId('rows')).toHaveText('1,2,3,4,5,6,7,8,9,10');
	await expect(page.getByTestId('page')).toHaveText('1 / 10');
});

test('filtering keeps a valid page and page-size changes reset to the first page', async ({ page }) => {
	await page.getByRole('button', { name: 'Stranica 2', exact: true }).click();
	await page.getByRole('button', { name: 'Filter', exact: true }).click();
	await expect(page.getByTestId('rows')).toHaveText('11,12');
	await expect(page.getByTestId('page')).toHaveText('2 / 2');
	await page.getByRole('button', { name: 'Restore', exact: true }).click();
	await page.getByRole('button', { name: 'Otvori izbornik', exact: true }).click();
	await page.getByRole('menuitem', { name: '20 stavki po stranici', exact: true }).click();
	await expect(page.getByTestId('rows')).toHaveText(Array.from({ length: 20 }, (_, i) => i + 1).join(','));
	await expect(page.getByTestId('page')).toHaveText('1 / 5');
});
