# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rbac-matrix.spec.ts >> RBAC Matrix — golden path >> picking a group reveals matrix rows
- Location: src\e2e\rbac-matrix.spec.ts:43:2

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 2
Received:    1

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - button "⊞ Explorer" [ref=e6] [cursor=pointer]
      - generic [ref=e8]:
        - button "main" [ref=e9] [cursor=pointer]
        - button "Close main" [ref=e10] [cursor=pointer]: ×
      - generic [ref=e11]:
        - button "⚠ DEV" [ref=e13] [cursor=pointer]
        - button "⚙" [ref=e14] [cursor=pointer]
        - button "👤" [ref=e15] [cursor=pointer]
    - main [ref=e16]:
      - generic [ref=e19]:
        - generic [ref=e21]:
          - text: "Group:"
          - combobox "Group:" [ref=e22] [cursor=pointer]:
            - option "— pick group —" [selected]
        - paragraph [ref=e23]: Select a group to edit permissions.
  - generic [ref=e24]: untitled page
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * RBAC Matrix golden path
  5   |  *
  6   |  * Flow:
  7   |  * 1. Load app
  8   |  * 2. Click sidebar "Permissions" → RbacMatrix frame mounts in main
  9   |  * 3. Pick a group from dropdown
  10  |  * 4. Toggle a CRUDLX cell → grant persists (visible after reload)
  11  |  * 5. Bulk header click toggles whole column
  12  |  *
  13  |  * Requires:
  14  |  * - MongoDB running (:27017)
  15  |  * - Backend server running (:7842 per server/.env) — `cd server && pnpm run dev`
  16  |  * - SvelteKit dev server auto-started by playwright.config.ts webServer
  17  |  */
  18  | 
  19  | test.describe('RBAC Matrix — golden path', () => {
  20  | 	test.beforeEach(async ({ page }) => {
  21  | 		// Hash router: load Explorer frame in main zone → CollectionNav appears in leftbar
  22  | 		await page.goto('/#/+main/explorer/vehicle');
  23  | 		await expect(page.locator('text=Administration').first()).toBeVisible({ timeout: 15_000 });
  24  | 	});
  25  | 
  26  | 	test('sidebar "Permissions" loads RbacMatrix frame', async ({ page }) => {
  27  | 		const matrixCountBefore = await page.locator('.rbac-matrix').count();
  28  | 		const frameCountBefore = await page.locator('.frame').count();
  29  | 		console.log(`Before click: matrices=${matrixCountBefore} frames=${frameCountBefore}`);
  30  | 
  31  | 		await page.getByRole('button', { name: 'Permissions' }).click();
  32  | 		await page.waitForTimeout(500);
  33  | 
  34  | 		const matrixCount = await page.locator('.rbac-matrix').count();
  35  | 		const frameCount = await page.locator('.frame').count();
  36  | 		console.log(`After click: matrices=${matrixCount} frames=${frameCount}`);
  37  | 
  38  | 		await page.screenshot({ path: 'test-results/rbac-after-click.png', fullPage: true });
  39  | 
  40  | 		expect(matrixCount).toBe(1);
  41  | 	});
  42  | 
  43  | 	test('picking a group reveals matrix rows', async ({ page }) => {
  44  | 		// Wait for sync to populate IDB
  45  | 		await page.waitForTimeout(2000);
  46  | 		await page.getByRole('button', { name: 'Permissions' }).click();
  47  | 
  48  | 		const select = page.locator('.rbac-toolbar select');
  49  | 		await expect(select).toBeVisible();
  50  | 
  51  | 		// Wait up to 5s for group options to appear
> 52  | 		await expect.poll(async () => await select.locator('option').count(), { timeout: 5000 }).toBeGreaterThanOrEqual(2);
      |   ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  53  | 
  54  | 		const options = await select.locator('option').count();
  55  | 		console.log(`[debug] group options count: ${options}`);
  56  | 		test.skip(options < 2, 'No appuser_group rows in IDB — sync issue');
  57  | 
  58  | 		// Pick first non-empty option
  59  | 		await select.selectOption({ index: 1 });
  60  | 
  61  | 		await expect(page.locator('table.matrix')).toBeVisible();
  62  | 		await expect(page.locator('table.matrix thead th').first()).toContainText('Collection');
  63  | 
  64  | 		// CRUDLX header buttons
  65  | 		for (const op of ['C', 'R', 'U', 'D', 'L', 'X']) {
  66  | 			await expect(page.locator(`button.op-head:has-text("${op}")`)).toBeVisible();
  67  | 		}
  68  | 	});
  69  | 
  70  | 	test('toggling a cell persists across reload', async ({ page }) => {
  71  | 		await page.getByRole('button', { name: 'Permissions' }).click();
  72  | 
  73  | 		const select = page.locator('.rbac-toolbar select');
  74  | 		const options = await select.locator('option').count();
  75  | 		test.skip(options < 2, 'No appuser_group rows seeded');
  76  | 
  77  | 		await select.selectOption({ index: 1 });
  78  | 		await expect(page.locator('table.matrix')).toBeVisible();
  79  | 
  80  | 		// Pick first row first checkbox
  81  | 		const firstCheckbox = page.locator('table.matrix tbody tr').first().locator('input[type="checkbox"]').first();
  82  | 		const before = await firstCheckbox.isChecked();
  83  | 		await firstCheckbox.click();
  84  | 		await expect(firstCheckbox).toBeChecked({ checked: !before });
  85  | 
  86  | 		// Wait for persist (sync server-first)
  87  | 		await page.waitForTimeout(500);
  88  | 
  89  | 		// Reload, navigate back, verify still toggled
  90  | 		await page.reload();
  91  | 		await expect(page.locator('text=Administration').first()).toBeVisible({ timeout: 10_000 });
  92  | 		await page.getByRole('button', { name: 'Permissions' }).click();
  93  | 		await page.locator('.rbac-toolbar select').selectOption({ index: 1 });
  94  | 		await expect(page.locator('table.matrix')).toBeVisible();
  95  | 
  96  | 		const firstCheckboxAfter = page.locator('table.matrix tbody tr').first().locator('input[type="checkbox"]').first();
  97  | 		await expect(firstCheckboxAfter).toBeChecked({ checked: !before });
  98  | 	});
  99  | 
  100 | 	test('column bulk-toggle flips all cells in that op', async ({ page }) => {
  101 | 		await page.getByRole('button', { name: 'Permissions' }).click();
  102 | 
  103 | 		const select = page.locator('.rbac-toolbar select');
  104 | 		const options = await select.locator('option').count();
  105 | 		test.skip(options < 2, 'No appuser_group rows seeded');
  106 | 
  107 | 		await select.selectOption({ index: 1 });
  108 | 		await expect(page.locator('table.matrix')).toBeVisible();
  109 | 
  110 | 		const rowCount = await page.locator('table.matrix tbody tr').count();
  111 | 		test.skip(rowCount < 2, 'Need at least 2 collections for bulk test');
  112 | 
  113 | 		// Click "R" header → all R cells should become checked (or all unchecked if all were)
  114 | 		await page.locator('button.op-head:has-text("R")').click();
  115 | 		await page.waitForTimeout(500);
  116 | 
  117 | 		// Verify all R cells have same state
  118 | 		const rCells = page.locator('table.matrix tbody tr td:nth-child(3) input[type="checkbox"]');
  119 | 		const states = await rCells.evaluateAll((els) => els.map((el) => (el as HTMLInputElement).checked));
  120 | 		const allSame = states.every((s) => s === states[0]);
  121 | 		expect(allSame).toBe(true);
  122 | 	});
  123 | });
  124 | 
  125 | test.describe('RBAC admin nav — Explorer reuse', () => {
  126 | 	test.beforeEach(async ({ page }) => {
  127 | 		await page.goto('/#/+main/explorer/vehicle');
  128 | 		await expect(page.locator('text=Administration').first()).toBeVisible({ timeout: 15_000 });
  129 | 	});
  130 | 
  131 | 	for (const { label, collection } of [
  132 | 		{ label: 'Users',       collection: 'appuser' },
  133 | 		{ label: 'Groups',      collection: 'appuser_group' },
  134 | 		{ label: 'Types',       collection: 'appuser_type' },
  135 | 		{ label: 'Assignments', collection: 'appuser_assignment' },
  136 | 		{ label: 'Audit Log',   collection: 'appuser_audit' },
  137 | 	]) {
  138 | 		test(`"${label}" opens Explorer for ${collection}`, async ({ page }) => {
  139 | 			await page.getByRole('button', { name: label, exact: true }).click();
  140 | 			// Mode switcher visible = Explorer mounted
  141 | 			await expect(page.locator('.mode-switcher')).toBeVisible({ timeout: 5_000 });
  142 | 			await expect(page.locator('.mode-btn.active')).toContainText(/List|Table|Actions/);
  143 | 		});
  144 | 	}
  145 | });
  146 | 
```