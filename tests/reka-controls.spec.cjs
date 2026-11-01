const { test, expect } = require("@playwright/test");
test.beforeEach(async ({ page }) => {
	await page.goto("/tests/reka.html");
});
test("select keeps object values, keyboard selection and form value", async ({ page }) => {
	await expect(page.locator("#select")).toContainText("Prva");
	await page.locator("#select").focus();
	await page.keyboard.press("Space");
	await expect(page.getByRole("option", { name: "Prva", exact: true })).toBeFocused();
	await page.keyboard.press("ArrowDown");
	await expect(page.getByRole("option", { name: "Druga", exact: true })).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(page.getByTestId("selected")).toHaveText("2");
});
test("switch, checkbox and radio preserve array/scalar models", async ({ page }) => {
	await page.getByRole("switch").focus();
	await page.keyboard.press("Space");
	await page.getByRole("checkbox").click();
	await expect(page.getByTestId("checks")).toHaveText('["one","two"]');
	await page.getByRole("radio", { name: "A", exact: true }).focus();
	await page.keyboard.press("ArrowRight", { delay: 50 });
	await expect(page.getByTestId("radio")).toHaveText("b");
});
test("date picker keeps ISO dates and respects boundaries", async ({ page }) => {
	await page.getByRole("button", { name: "Otvori kalendar" }).click();
	await expect(page.locator("[data-reka-popper-content-wrapper]")).toBeVisible();
	await expect(page.locator('[data-reka-calendar-cell-trigger][data-value="2026-11-09"]')).toHaveAttribute("data-disabled", "");
	await page.locator('[data-reka-calendar-cell-trigger][data-value="2026-11-16"]').click();
	await expect(page.getByTestId("date")).toHaveText("2026-11-16");
});
test("combobox and menu are keyboard operable", async ({ page }) => {
	await page.locator('input[role="combobox"]').fill("drug");
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("Enter");
	await expect(page.getByTestId("combo")).toHaveText("Druga");
	await page.getByRole("button", { name: "Akcije" }).focus();
	await page.keyboard.press("Enter");
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("Enter");
	await expect(page.getByTestId("action")).toHaveText("1");
	await expect(page.locator("button button")).toHaveCount(0);
});
test("modal traps focus, closes once on Escape and restores focus", async ({ page }) => {
	await page.getByRole("button", { name: "Otvori modal", exact: true }).click();
	await expect(page.getByRole("dialog")).toBeVisible();
	await page.keyboard.press("Shift+Tab");
	await expect(page.getByRole("dialog").locator(":focus")).toHaveCount(1);
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).toHaveCount(0);
	await expect(page.getByTestId("cancels")).toHaveText("1");
	await expect(page.getByRole("button", { name: "Otvori modal", exact: true })).toBeFocused();
});
test("disabled links block clicks and loading buttons keep their label", async ({ page }) => {
	await page.getByRole("link", { name: "Disabled link" }).dispatchEvent("click");
	await expect(page.getByTestId("clicks")).toHaveText("0");
	await expect(page.getByRole("button", { name: "Loading" })).toBeDisabled();
});

test("required select validates without leaking internal indexes into FormData", async ({ page }) => {
	await expect(page.locator("form")).toHaveJSProperty("noValidate", false);
	expect(await page.locator("form").evaluate((form) => form.checkValidity())).toBe(false);
	await page.locator("#required-select").click();
	await page.getByRole("option", { name: "Vrijednost", exact: true }).click();
	expect(await page.locator("form").evaluate((form) => form.checkValidity())).toBe(true);
	expect(await page.locator("form").evaluate((form) => new FormData(form).get("required-choice"))).toBe("Vrijednost");
});
test("nested select Escape does not dismiss its modal; outside click dismisses once", async ({ page }) => {
	await page.getByRole("button", { name: "Otvori modal", exact: true }).click();
	await page.getByRole("dialog").getByRole("combobox").click();
	await expect(page.getByRole("option", { name: "Prva", exact: true })).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).toBeVisible();
	await page.mouse.click(5, 5);
	await expect(page.getByRole("dialog")).toHaveCount(0);
	await expect(page.getByTestId("cancels")).toHaveText("1");
});

test('mobile calendar keeps seven columns without horizontal overflow', async ({page}) => {
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Otvori kalendar'}).click();
 const cells=page.locator('.date-grid tbody tr').first().locator('td');
 await expect(cells).toHaveCount(7);
 const first=await cells.nth(0).boundingBox(), last=await cells.nth(6).boundingBox();
 expect(last.y).toBe(first.y); expect(last.x).toBeGreaterThan(first.x);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('tooltip supports hover, keyboard focus, Escape and existing colors', async ({page}) => {
 const trigger=page.getByRole('button',{name:'Tooltip test'});
 await trigger.hover(); await expect(page.getByRole('tooltip')).toHaveText('Pomoć za praksu');
 await expect(page.locator('[data-reka-popper-content-wrapper] > div').filter({has: page.getByRole('tooltip')})).toHaveCSS('background-color','rgb(51, 51, 51)');
 await page.keyboard.press('Escape'); await expect(page.getByRole('tooltip')).toHaveCount(0);
 await page.mouse.move(0,0); await trigger.focus(); await expect(page.getByRole('tooltip')).toBeVisible();
 await expect(trigger).toHaveAttribute('aria-describedby', /.+/);
 await trigger.click(); await expect(page.getByRole('tooltip')).toHaveCount(0);
});
