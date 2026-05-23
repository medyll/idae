import { test, expect } from '@playwright/test';

/**
 * RBAC Matrix golden path
 *
 * Flow:
 * 1. Load app
 * 2. Click sidebar "Permissions" → RbacMatrix frame mounts in main
 * 3. Pick a group from dropdown
 * 4. Toggle a CRUDLX cell → grant persists (visible after reload)
 * 5. Bulk header click toggles whole column
 *
 * Requires:
 * - MongoDB running (:27017)
 * - Backend server running (:7842 per server/.env) — `cd server && pnpm run dev`
 * - SvelteKit dev server auto-started by playwright.config.ts webServer
 */

test.describe('RBAC Matrix — golden path', () => {
	test.beforeEach(async ({ page }) => {
		// Hash router: load Explorer frame in main zone → CollectionNav appears in leftbar
		await page.goto('/#/+main/explorer/vehicle');
		await expect(page.locator('text=Administration').first()).toBeVisible({ timeout: 15_000 });
	});

	test('sidebar "Permissions" loads RbacMatrix frame', async ({ page }) => {
		const matrixCountBefore = await page.locator('.rbac-matrix').count();
		const frameCountBefore = await page.locator('.frame').count();
		console.log(`Before click: matrices=${matrixCountBefore} frames=${frameCountBefore}`);

		await page.getByRole('button', { name: 'Permissions' }).click();
		await page.waitForTimeout(500);

		const matrixCount = await page.locator('.rbac-matrix').count();
		const frameCount = await page.locator('.frame').count();
		console.log(`After click: matrices=${matrixCount} frames=${frameCount}`);

		await page.screenshot({ path: 'test-results/rbac-after-click.png', fullPage: true });

		expect(matrixCount).toBe(1);
	});

	test('picking a group reveals matrix rows', async ({ page }) => {
		// Wait for sync to populate IDB
		await page.waitForTimeout(2000);
		await page.getByRole('button', { name: 'Permissions' }).click();

		const select = page.locator('.rbac-toolbar select');
		await expect(select).toBeVisible();

		// Wait up to 5s for group options to appear
		await expect.poll(async () => await select.locator('option').count(), { timeout: 5000 }).toBeGreaterThanOrEqual(2);

		const options = await select.locator('option').count();
		console.log(`[debug] group options count: ${options}`);
		test.skip(options < 2, 'No appuser_group rows in IDB — sync issue');

		// Pick first non-empty option
		await select.selectOption({ index: 1 });

		await expect(page.locator('table.matrix')).toBeVisible();
		await expect(page.locator('table.matrix thead th').first()).toContainText('Collection');

		// CRUDLX header buttons
		for (const op of ['C', 'R', 'U', 'D', 'L', 'X']) {
			await expect(page.locator(`button.op-head:has-text("${op}")`)).toBeVisible();
		}
	});

	test('toggling a cell persists across reload', async ({ page }) => {
		await page.getByRole('button', { name: 'Permissions' }).click();

		const select = page.locator('.rbac-toolbar select');
		const options = await select.locator('option').count();
		test.skip(options < 2, 'No appuser_group rows seeded');

		await select.selectOption({ index: 1 });
		await expect(page.locator('table.matrix')).toBeVisible();

		// Pick first row first checkbox
		const firstCheckbox = page.locator('table.matrix tbody tr').first().locator('input[type="checkbox"]').first();
		const before = await firstCheckbox.isChecked();
		await firstCheckbox.click();
		await expect(firstCheckbox).toBeChecked({ checked: !before });

		// Wait for persist (sync server-first)
		await page.waitForTimeout(500);

		// Reload, navigate back, verify still toggled
		await page.reload();
		await expect(page.locator('text=Administration').first()).toBeVisible({ timeout: 10_000 });
		await page.getByRole('button', { name: 'Permissions' }).click();
		await page.locator('.rbac-toolbar select').selectOption({ index: 1 });
		await expect(page.locator('table.matrix')).toBeVisible();

		const firstCheckboxAfter = page.locator('table.matrix tbody tr').first().locator('input[type="checkbox"]').first();
		await expect(firstCheckboxAfter).toBeChecked({ checked: !before });
	});

	test('column bulk-toggle flips all cells in that op', async ({ page }) => {
		await page.getByRole('button', { name: 'Permissions' }).click();

		const select = page.locator('.rbac-toolbar select');
		const options = await select.locator('option').count();
		test.skip(options < 2, 'No appuser_group rows seeded');

		await select.selectOption({ index: 1 });
		await expect(page.locator('table.matrix')).toBeVisible();

		const rowCount = await page.locator('table.matrix tbody tr').count();
		test.skip(rowCount < 2, 'Need at least 2 collections for bulk test');

		// Click "R" header → all R cells should become checked (or all unchecked if all were)
		await page.locator('button.op-head:has-text("R")').click();
		await page.waitForTimeout(500);

		// Verify all R cells have same state
		const rCells = page.locator('table.matrix tbody tr td:nth-child(3) input[type="checkbox"]');
		const states = await rCells.evaluateAll((els) => els.map((el) => (el as HTMLInputElement).checked));
		const allSame = states.every((s) => s === states[0]);
		expect(allSame).toBe(true);
	});
});

test.describe('RBAC admin nav — Explorer reuse', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/#/+main/explorer/vehicle');
		await expect(page.locator('text=Administration').first()).toBeVisible({ timeout: 15_000 });
	});

	for (const { label, collection } of [
		{ label: 'Users',       collection: 'appuser' },
		{ label: 'Groups',      collection: 'appuser_group' },
		{ label: 'Types',       collection: 'appuser_type' },
		{ label: 'Assignments', collection: 'appuser_assignment' },
		{ label: 'Audit Log',   collection: 'appuser_audit' },
	]) {
		test(`"${label}" opens Explorer for ${collection}`, async ({ page }) => {
			await page.getByRole('button', { name: label, exact: true }).click();
			// Mode switcher visible = Explorer mounted
			await expect(page.locator('.mode-switcher')).toBeVisible({ timeout: 5_000 });
			await expect(page.locator('.mode-btn.active')).toContainText(/List|Table|Actions/);
		});
	}
});
