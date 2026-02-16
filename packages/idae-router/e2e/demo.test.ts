import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/demo.html');
	await expect(page.locator('#app h1')).toHaveText('Home');
});

test('navigates to user and shows async content', async ({ page }) => {
	await page.goto('/demo.html');
	await page.click('a[href="/user/42"]');
	await page.waitForSelector('#app h1');
	await expect(page.locator('#app h1')).toHaveText('User 42');
});

test('link interception: internal links navigate without full reload', async ({ page }) => {
	await page.goto('/demo.html');
	await page.click('a[href="/posts"]');
	await expect(page.locator('#app h1')).toHaveText('Posts');
});
