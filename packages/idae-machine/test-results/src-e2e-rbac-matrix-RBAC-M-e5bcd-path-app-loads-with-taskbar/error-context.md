# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: src\e2e\rbac-matrix.spec.ts >> RBAC Matrix — golden path >> app loads with taskbar
- Location: src\e2e\rbac-matrix.spec.ts:27:2

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.taskbar')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.taskbar')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: "[plugin:vite:oxc] Transform failed with 1 error: [PARSE_ERROR] Error: Unexpected token ╭─[ ../qoolie/src/adapters/svelte/useQoolieCollection.svelte.ts:73:3 ] │ 73 │ }; │ ┬ │ ╰── ────╯"
  - generic [ref=e5]: D:/development/idae/packages/qoolie/src/adapters/svelte/useQoolieCollection.svelte.ts
  - generic [ref=e6]: at transformWithOxc (file:///D:/development/idae/node_modules/.pnpm/vite@8.0.3_@types+node@25.5_c76c44e66e0b85b23059ce4cc4268773/node_modules/vite/dist/node/chunks/node.js:3720:19) at TransformPluginContext.transform (file:///D:/development/idae/node_modules/.pnpm/vite@8.0.3_@types+node@25.5_c76c44e66e0b85b23059ce4cc4268773/node_modules/vite/dist/node/chunks/node.js:3788:26) at EnvironmentPluginContainer.transform (file:///D:/development/idae/node_modules/.pnpm/vite@8.0.3_@types+node@25.5_c76c44e66e0b85b23059ce4cc4268773/node_modules/vite/dist/node/chunks/node.js:30048:51) at async loadAndTransform (file:///D:/development/idae/node_modules/.pnpm/vite@8.0.3_@types+node@25.5_c76c44e66e0b85b23059ce4cc4268773/node_modules/vite/dist/node/chunks/node.js:24177:26) at async viteTransformMiddleware (file:///D:/development/idae/node_modules/.pnpm/vite@8.0.3_@types+node@25.5_c76c44e66e0b85b23059ce4cc4268773/node_modules/vite/dist/node/chunks/node.js:24986:20)
  - generic [ref=e7]:
    - text: Click outside, press Esc key, or fix the code to dismiss.
    - text: You can also disable this overlay by setting
    - code [ref=e8]: server.hmr.overlay
    - text: to
    - code [ref=e9]: "false"
    - text: in
    - code [ref=e10]: vite.config.ts
    - text: .
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * RBAC Matrix golden path
  5   |  *
  6   |  * Current app architecture:
  7   |  * - App.svelte: TaskBar + main content zone (no sidebar)
  8   |  * - TaskBar: "⊞ Explorer" button + open frames + dev/settings/user icons
  9   |  * - RbacMatrix registered as 'rbac.matrix' in componentRegistry
  10  |  * - Hash router: machine.loadFrame(componentKey, collection, collectionId?, vars?)
  11  |  *
  12  |  * Requires:
  13  |  * - MongoDB running (:27017)
  14  |  * - Backend server running (:7842) — `cd server && pnpm run dev`
  15  |  * - SvelteKit dev server auto-started by playwright.config.ts webServer
  16  |  */
  17  | 
  18  | test.describe('RBAC Matrix — golden path', () => {
  19  | 	test.beforeEach(async ({ page }) => {
  20  | 		await page.goto('http://localhost:5173/');
  21  | 		// Wait for boot splash to disappear (machine.boot completes)
  22  | 		await expect(page.locator('.boot-splash')).not.toBeVisible({ timeout: 30_000 });
  23  | 		// Wait for taskbar to be visible (app loaded)
> 24  | 		await expect(page.locator('.taskbar')).toBeVisible({ timeout: 10_000 });
      |                                          ^ Error: expect(locator).toBeVisible() failed
  25  | 	});
  26  | 
  27  | 	test('app loads with taskbar', async ({ page }) => {
  28  | 		// Capture errors
  29  | 		const errors: string[] = [];
  30  | 		page.on('pageerror', err => errors.push(err.message));
  31  | 		page.on('console', msg => {
  32  | 			if (msg.type() === 'error') errors.push(msg.text());
  33  | 		});
  34  | 
  35  | 		await page.goto('http://localhost:5173/');
  36  | 		await expect(page.locator('.boot-splash')).not.toBeVisible({ timeout: 30_000 });
  37  | 		// Wait for taskbar to be visible (app loaded)
  38  | 		await expect(page.locator('.taskbar')).toBeVisible({ timeout: 10_000 });
  39  | 
  40  | 		if (errors.length > 0) {
  41  | 			console.log(`[page errors] ${JSON.stringify(errors)}`);
  42  | 		}
  43  | 	});
  44  | 
  45  | 	test('navigate to RbacMatrix via hash route', async ({ page }) => {
  46  | 		await page.goto('http://localhost:5173/#/+main/rbac.matrix/appuser_group');
  47  | 		await page.waitForTimeout(1000);
  48  | 
  49  | 		const matrix = page.locator('.rbac-matrix');
  50  | 		await expect(matrix).toBeVisible({ timeout: 10_000 });
  51  | 	});
  52  | 
  53  | 	test('picking a group reveals matrix rows', async ({ page }) => {
  54  | 		// Capture browser console logs
  55  | 		const browserLogs: string[] = [];
  56  | 		page.on('console', msg => {
  57  | 			const text = msg.text();
  58  | 			if (text.includes('useQoolieCollection') || text.includes('stubLogs')) {
  59  | 				browserLogs.push(text);
  60  | 			}
  61  | 		});
  62  | 
  63  | 		await page.goto('http://localhost:5173/#/+main/rbac.matrix/appuser_group');
  64  | 		await page.waitForTimeout(5000);
  65  | 
  66  | 		// Read stub logs
  67  | 		const stubLogs = await page.evaluate(() => (window as any).__stubLogs || []);
  68  | 		console.log(`[stubLogs] ${JSON.stringify(stubLogs)}`);
  69  | 		console.log(`[browserLogs] ${JSON.stringify(browserLogs)}`);
  70  | 
  71  | 		// Check select options
  72  | 		const optionCount = await page.locator('.rbac-toolbar select option').count();
  73  | 		console.log(`[select] options count: ${optionCount}`);
  74  | 
  75  | 		const select = page.locator('.rbac-toolbar select');
  76  | 		await expect(select).toBeVisible({ timeout: 10_000 });
  77  | 
  78  | 		// Wait for SWR hydration to pull appuser_group from server
  79  | 		await expect.poll(async () => await select.locator('option').count(), { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
  80  | 
  81  | 		// Pick first non-empty option
  82  | 		await select.selectOption({ index: 1 });
  83  | 
  84  | 		await expect(page.locator('table.matrix')).toBeVisible();
  85  | 		await expect(page.locator('table.matrix thead th').first()).toContainText('Collection');
  86  | 
  87  | 		// CRUDLX header buttons
  88  | 		for (const op of ['C', 'R', 'U', 'D', 'L', 'X']) {
  89  | 			await expect(page.locator(`button.op-head:has-text("${op}")`)).toBeVisible();
  90  | 		}
  91  | 	});
  92  | 
  93  | 	test('toggling a cell persists across reload', async ({ page }) => {
  94  | 		await page.goto('http://localhost:5173/#/+main/rbac.matrix/appuser_group');
  95  | 		await page.waitForTimeout(2000);
  96  | 
  97  | 		const select = page.locator('.rbac-toolbar select');
  98  | 		await expect(select).toBeVisible({ timeout: 10_000 });
  99  | 
  100 | 		// Wait for groups to appear
  101 | 		await expect.poll(async () => await select.locator('option').count(), { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
  102 | 
  103 | 		await select.selectOption({ index: 1 });
  104 | 		await expect(page.locator('table.matrix')).toBeVisible();
  105 | 
  106 | 		// Pick first row first checkbox
  107 | 		const firstCheckbox = page.locator('table.matrix tbody tr').first().locator('input[type="checkbox"]').first();
  108 | 		const before = await firstCheckbox.isChecked();
  109 | 		await firstCheckbox.click();
  110 | 		await expect(firstCheckbox).toBeChecked({ checked: !before });
  111 | 
  112 | 		// Wait for persist (sync server-first)
  113 | 		await page.waitForTimeout(500);
  114 | 
  115 | 		// Reload, navigate back, verify still toggled
  116 | 		await page.reload();
  117 | 		await expect(page.locator('.taskbar')).toBeVisible({ timeout: 30_000 });
  118 | 		await page.goto('http://localhost:5173/#/+main/rbac.matrix/appuser_group');
  119 | 		await page.waitForTimeout(2000);
  120 | 		await expect(page.locator('table.matrix')).toBeVisible();
  121 | 
  122 | 		await page.locator('.rbac-toolbar select').selectOption({ index: 1 });
  123 | 		const firstCheckboxAfter = page.locator('table.matrix tbody tr').first().locator('input[type="checkbox"]').first();
  124 | 		await expect(firstCheckboxAfter).toBeChecked({ checked: !before });
```