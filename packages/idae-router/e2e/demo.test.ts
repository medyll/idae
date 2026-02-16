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

test('nested routes: parent and child render together', async ({ page }) => {
	await page.goto('/demo-nested.html');
	await page.click('a[href="/parent/1/child"]');
	await page.waitForSelector('#app h1');
	await expect(page.locator('#app h1')).toHaveText('Parent 1');
	await expect(page.locator('#app p')).toHaveText('Child');
});
