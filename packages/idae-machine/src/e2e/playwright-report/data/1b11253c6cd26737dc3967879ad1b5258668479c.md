# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rbac-matrix.spec.ts >> RBAC Matrix — golden path >> column bulk-toggle flips all cells in that op
- Location: src\e2e\rbac-matrix.spec.ts:134:2

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 2
Received:    1

Call Log:
- Timeout 15000ms exceeded while waiting on the predicate
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
  100 | 		// Wait for groups to appear (SWR hydration)
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
  112 | 		// Flush outbox to server before reload — default sync interval is 5000ms, cannot rely on timeout
  113 | 		await page.evaluate(async () => {
  114 | 			try { await (window as any).__machine?.sync?.flush?.(); } catch (_) {}
  115 | 		});
  116 | 
  117 | 		// Reload, navigate back, verify still toggled
  118 | 		await page.reload();
  119 | 		await expect(page.locator('.taskbar')).toBeVisible({ timeout: 30_000 });
  120 | 		await page.goto('http://localhost:5173/#/+main/rbac.matrix/appuser_group');
  121 | 		await page.waitForTimeout(2000);
  122 | 
  123 | 		// Select group first (matrix is hidden until a group is selected)
  124 | 		const selectAfter = page.locator('.rbac-toolbar select');
  125 | 		await expect(selectAfter).toBeVisible({ timeout: 10_000 });
  126 | 		await expect.poll(async () => await selectAfter.locator('option').count(), { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
  127 | 		await selectAfter.selectOption({ index: 1 });
  128 | 		await expect(page.locator('table.matrix')).toBeVisible();
  129 | 
  130 | 		const firstCheckboxAfter = page.locator('table.matrix tbody tr').first().locator('input[type="checkbox"]').first();
  131 | 		await expect(firstCheckboxAfter).toBeChecked({ checked: !before });
  132 | 	});
  133 | 
  134 | 	test('column bulk-toggle flips all cells in that op', async ({ page }) => {
  135 | 		await page.goto('http://localhost:5173/#/+main/rbac.matrix/appuser_group');
  136 | 		await page.waitForTimeout(2000);
  137 | 
  138 | 		const select = page.locator('.rbac-toolbar select');
  139 | 		await expect(select).toBeVisible({ timeout: 10_000 });
  140 | 
  141 | 		// Wait for groups to appear
> 142 | 		await expect.poll(async () => await select.locator('option').count(), { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
      |   ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  143 | 
  144 | 		await select.selectOption({ index: 1 });
  145 | 		await expect(page.locator('table.matrix')).toBeVisible();
  146 | 
  147 | 		const rowCount = await page.locator('table.matrix tbody tr').count();
  148 | 		test.skip(rowCount < 2, 'Need at least 2 collections for bulk test');
  149 | 
  150 | 		// Click "R" header → all R cells should become same state (all ON or all OFF)
  151 | 		await page.locator('button.op-head:has-text("R")').click();
  152 | 
  153 | 		// Poll — async IDB writes + Svelte reactivity may take a moment
  154 | 		const rCells = page.locator('table.matrix tbody tr td:nth-child(3) input[type="checkbox"]');
  155 | 		await expect.poll(async () => {
  156 | 			const states = await rCells.evaluateAll((els) => els.map((el) => (el as HTMLInputElement).checked));
  157 | 			return states.length > 0 && states.every((s) => s === states[0]);
  158 | 		}, { timeout: 10_000 }).toBe(true);
  159 | 	});
  160 | });
  161 | 
```