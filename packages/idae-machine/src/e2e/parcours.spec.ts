import { test, expect, type Page } from '@playwright/test';

/**
 * Main parcours golden path: login → explorer → fiche → diagram.
 * Replaces the obsolete app.spec.ts (targeted a removed demo showcase page).
 *
 * Exercises the externalised Fiche toolbar (FicheToolbar → ButtonAction) by
 * jumping list → fiche → diagram through the record-level action buttons.
 *
 * Requires (same stack as rbac-matrix.spec.ts):
 * - MongoDB running (:27017)
 * - Backend server running (:7842) — `cd server && pnpm run dev`
 * - Seeded demo org with vehicle records + an admin user
 *   (server/src/bootstrap/seedUsers.ts → admin / admin123)
 * - SvelteKit dev server auto-started by playwright.config.ts webServer
 */

const ORG = 'demo';
const USER = 'admin';
const PASS = 'admin123';
const BASE = 'http://localhost:5173/';

/** Log in through the gating dialog if it is shown; otherwise assume an
 *  already-authed session (persisted token) and just wait for the taskbar. */
async function ensureLoggedIn(page: Page): Promise<void> {
	await page.goto(BASE);

	const taskbar = page.locator('.taskbar');
	const loginUser = page.locator('#login-user');

	// Boot resolves to one of: login dialog (no/expired session) or App (taskbar).
	await expect(loginUser.or(taskbar)).toBeVisible({ timeout: 30_000 });

	if (await loginUser.isVisible()) {
		await page.locator('#login-org').selectOption(ORG);
		await loginUser.fill(USER);
		await page.locator('#login-pass').fill(PASS);
		await page.locator('login-actions button[type="submit"]').click();
		// submit() persists token + reloads; restoreSession() re-auths silently.
		await expect(taskbar).toBeVisible({ timeout: 30_000 });
	}
}

test.describe('Main parcours — login → explorer → fiche → diagram', () => {
	test.beforeEach(async ({ page }) => {
		await ensureLoggedIn(page);
	});

	test('logs in and lands on the app shell', async ({ page }) => {
		await expect(page.locator('.taskbar')).toBeVisible();
		await expect(page.locator('.boot-splash')).not.toBeVisible();
	});

	test('opens the explorer from the taskbar', async ({ page }) => {
		await page.locator('.taskbar-btn--primary').click();
		// Explorer = TemplateShell with an appscheme nav sidebar (DataList links).
		await expect(page.locator('.data-list-link').first()).toBeVisible({ timeout: 10_000 });
	});

	test('explorer → fiche → diagram via record action buttons', async ({ page }) => {
		// Open explorer, pick the "vehicle" schema in the sidebar.
		await page.locator('.taskbar-btn--primary').click();
		await page.locator('.data-list-link', { hasText: /^vehicle$/ }).first().click();

		// ExplorerContent renders the vehicle list (link="loadInDialog:fiche").
		const firstRecord = page.locator('.data-list-link').first();
		await expect(firstRecord).toBeVisible({ timeout: 10_000 });
		await firstRecord.click();

		// Fiche opens in a dialog with the externalised toolbar.
		await expect(page.locator('fiche-component')).toBeVisible({ timeout: 10_000 });
		const diagramBtn = page.locator('fiche-component button', { hasText: /^diagram$/ });
		await expect(diagramBtn).toBeVisible();

		// ButtonAction → framer.loadFrame('diagram', …).
		await diagramBtn.click();
		await expect(page.locator('diagram-component')).toBeVisible({ timeout: 10_000 });
		await expect(page.locator('diagram-component svg[role="img"]')).toBeVisible();
	});

	test('diagram is reachable directly via hash route', async ({ page }) => {
		await page.goto(`${BASE}#/+main/diagram/vehicle/1`);
		await expect(page.locator('diagram-component')).toBeVisible({ timeout: 10_000 });
		await expect(page.locator('diagram-component svg[role="img"]')).toBeVisible();
	});
});
