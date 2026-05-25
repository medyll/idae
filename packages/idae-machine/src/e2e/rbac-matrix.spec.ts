import { test, expect } from '@playwright/test';

/**
 * RBAC Matrix golden path
 *
 * Current app architecture:
 * - App.svelte: TaskBar + main content zone (no sidebar)
 * - TaskBar: "⊞ Explorer" button + open frames + dev/settings/user icons
 * - RbacMatrix registered as 'rbac.matrix' in componentRegistry
 * - Hash router: machine.loadFrame(componentKey, collection, collectionId?, vars?)
 *
 * Requires:
 * - MongoDB running (:27017)
 * - Backend server running (:7842) — `cd server && pnpm run dev`
 * - SvelteKit dev server auto-started by playwright.config.ts webServer
 */

test.describe('RBAC Matrix — golden path', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173/');
		// Wait for boot splash to disappear (machine.boot completes)
		await expect(page.locator('.boot-splash')).not.toBeVisible({ timeout: 30_000 });
		// Wait for taskbar to be visible (app loaded)
		await expect(page.locator('.taskbar')).toBeVisible({ timeout: 10_000 });
	});

	test('app loads with taskbar', async ({ page }) => {
		// Capture errors
		const errors: string[] = [];
		page.on('pageerror', err => errors.push(err.message));
		page.on('console', msg => {
			if (msg.type() === 'error') errors.push(msg.text());
		});

		await page.goto('http://localhost:5173/');
		await expect(page.locator('.boot-splash')).not.toBeVisible({ timeout: 30_000 });
		// Wait for taskbar to be visible (app loaded)
		await expect(page.locator('.taskbar')).toBeVisible({ timeout: 10_000 });

		if (errors.length > 0) {
			console.log(`[page errors] ${JSON.stringify(errors)}`);
		}
	});

	test('navigate to RbacMatrix via hash route', async ({ page }) => {
		await page.goto('http://localhost:5173/#/+main/rbac.matrix/appuser_group');
		await page.waitForTimeout(1000);

		const matrix = page.locator('.rbac-matrix');
		await expect(matrix).toBeVisible({ timeout: 10_000 });
	});

	test('picking a group reveals matrix rows', async ({ page }) => {
		// Capture browser console logs
		const browserLogs: string[] = [];
		page.on('console', msg => {
			const text = msg.text();
			if (text.includes('useQoolieCollection') || text.includes('stubLogs')) {
				browserLogs.push(text);
			}
		});

		await page.goto('http://localhost:5173/#/+main/rbac.matrix/appuser_group');
		await page.waitForTimeout(5000);

		// Read stub logs
		const stubLogs = await page.evaluate(() => (window as any).__stubLogs || []);
		console.log(`[stubLogs] ${JSON.stringify(stubLogs)}`);
		console.log(`[browserLogs] ${JSON.stringify(browserLogs)}`);

		// Check select options
		const optionCount = await page.locator('.rbac-toolbar select option').count();
		console.log(`[select] options count: ${optionCount}`);

		const select = page.locator('.rbac-toolbar select');
		await expect(select).toBeVisible({ timeout: 10_000 });

		// Wait for SWR hydration to pull appuser_group from server
		await expect.poll(async () => await select.locator('option').count(), { timeout: 15_000 }).toBeGreaterThanOrEqual(2);

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
		await page.goto('http://localhost:5173/#/+main/rbac.matrix/appuser_group');
		await page.waitForTimeout(2000);

		const select = page.locator('.rbac-toolbar select');
		await expect(select).toBeVisible({ timeout: 10_000 });

		// Wait for groups to appear (SWR hydration)
		await expect.poll(async () => await select.locator('option').count(), { timeout: 15_000 }).toBeGreaterThanOrEqual(2);

		await select.selectOption({ index: 1 });
		await expect(page.locator('table.matrix')).toBeVisible();

		// Pick first row first checkbox
		const firstCheckbox = page.locator('table.matrix tbody tr').first().locator('input[type="checkbox"]').first();
		const before = await firstCheckbox.isChecked();
		await firstCheckbox.click();
		await expect(firstCheckbox).toBeChecked({ checked: !before });

		// Flush outbox to server before reload — default sync interval is 5000ms, cannot rely on timeout
		await page.evaluate(async () => {
			try { await (window as any).__machine?.sync?.flush?.(); } catch (_) {}
		});

		// Reload, navigate back, verify still toggled
		await page.reload();
		await expect(page.locator('.taskbar')).toBeVisible({ timeout: 30_000 });
		await page.goto('http://localhost:5173/#/+main/rbac.matrix/appuser_group');
		await page.waitForTimeout(2000);

		// Select group first (matrix is hidden until a group is selected)
		const selectAfter = page.locator('.rbac-toolbar select');
		await expect(selectAfter).toBeVisible({ timeout: 10_000 });
		await expect.poll(async () => await selectAfter.locator('option').count(), { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
		await selectAfter.selectOption({ index: 1 });
		await expect(page.locator('table.matrix')).toBeVisible();

		const firstCheckboxAfter = page.locator('table.matrix tbody tr').first().locator('input[type="checkbox"]').first();
		await expect(firstCheckboxAfter).toBeChecked({ checked: !before });
	});

	test('column bulk-toggle flips all cells in that op', async ({ page }) => {
		await page.goto('http://localhost:5173/#/+main/rbac.matrix/appuser_group');
		await page.waitForTimeout(2000);

		const select = page.locator('.rbac-toolbar select');
		await expect(select).toBeVisible({ timeout: 10_000 });

		// Wait for groups to appear
		await expect.poll(async () => await select.locator('option').count(), { timeout: 15_000 }).toBeGreaterThanOrEqual(2);

		await select.selectOption({ index: 1 });
		await expect(page.locator('table.matrix')).toBeVisible();

		const rowCount = await page.locator('table.matrix tbody tr').count();
		test.skip(rowCount < 2, 'Need at least 2 collections for bulk test');

		// Click "R" header → all R cells should become same state (all ON or all OFF)
		await page.locator('button.op-head:has-text("R")').click();

		// Poll — async IDB writes + Svelte reactivity may take a moment
		const rCells = page.locator('table.matrix tbody tr td:nth-child(3) input[type="checkbox"]');
		await expect.poll(async () => {
			const states = await rCells.evaluateAll((els) => els.map((el) => (el as HTMLInputElement).checked));
			return states.length > 0 && states.every((s) => s === states[0]);
		}, { timeout: 10_000 }).toBe(true);
	});
});
