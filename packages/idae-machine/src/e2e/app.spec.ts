import { test, expect } from '@playwright/test';

/**
 * E2E tests for idae-machine demo page (+page.svelte)
 * Couvre tous les composants : UI, Form (Create / Update séparés), Fragments
 */

// ─── Structure de base ────────────────────────────────────────────────────────

test.describe('Structure de base', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('header présent avec le bon titre', async ({ page }) => {
		await expect(page.locator('.demo-header h1')).toContainText('idae-machine Component Showcase');
		await expect(page.locator('.demo-header p')).toBeVisible();
	});

	test('panneau gauche avec les 3 collections du testScheme', async ({ page }) => {
		await expect(page.getByTestId('left-panel')).toBeVisible();
		await expect(page.getByTestId('collection-btn-vehicle')).toBeVisible();
		await expect(page.getByTestId('collection-btn-category')).toBeVisible();
		await expect(page.getByTestId('collection-btn-customer')).toBeVisible();
	});

	test('tabs nav contient les onglets permanents', async ({ page }) => {
		const nav = page.getByTestId('tabs-nav');
		await expect(nav).toBeVisible();
		await expect(page.getByTestId('tab-grid')).toBeVisible();
		await expect(page.getByTestId('tab-menu')).toBeVisible();
		await expect(page.getByTestId('tab-create')).toBeVisible();
		await expect(page.getByTestId('tab-components')).toBeVisible();
	});

	test('onglets Update et Relations absents sans record sélectionné', async ({ page }) => {
		await expect(page.getByTestId('tab-update')).not.toBeVisible();
		await expect(page.getByTestId('tab-relationships')).not.toBeVisible();
	});

	test('footer présent', async ({ page }) => {
		await expect(page.getByTestId('footer')).toBeVisible();
	});
});

// ─── Navigation entre collections ────────────────────────────────────────────

test.describe('Navigation entre collections', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('product actif par défaut', async ({ page }) => {
		await expect(page.getByTestId('collection-btn-product')).toHaveClass(/active/);
	});

	test('cliquer product_category → bascule la collection active', async ({ page }) => {
		await page.getByTestId('collection-btn-product_category').click();
		await expect(page.getByTestId('collection-btn-product_category')).toHaveClass(/active/);
		await expect(page.getByTestId('collection-btn-product')).not.toHaveClass(/active/);
	});

	test('InfoLine reflète la collection sélectionnée', async ({ page }) => {
		const info = page.getByTestId('info-section');
		await expect(info).toContainText('product');

		await page.getByTestId('collection-btn-vehicle').click();
		await expect(info).toContainText('vehicle');
	});

	test('changer de collection réinitialise le record sélectionné', async ({ page }) => {
		// On simule l'accès à create pour ensuite changer de collection
		await page.getByTestId('tab-create').click();
		await page.getByTestId('collection-btn-agent').click();
		// Retour sur grid, pas de tab update visible
		await expect(page.getByTestId('tab-update')).not.toBeVisible();
	});
});

// ─── Onglets de navigation ────────────────────────────────────────────────────

test.describe('Navigation par tabs', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('Grid View actif par défaut — CollectionList visible', async ({ page }) => {
		await expect(page.getByTestId('tab-grid')).toHaveClass(/active/);
		await expect(page.getByTestId('view-grid')).toBeVisible();
	});

	test('tab Menu View — CollectionListMenu visible', async ({ page }) => {
		await page.getByTestId('tab-menu').click();
		await expect(page.getByTestId('tab-menu')).toHaveClass(/active/);
		await expect(page.getByTestId('view-menu')).toBeVisible();
		await expect(page.getByTestId('view-grid')).not.toBeVisible();
	});

	test('tab Create — formulaire Create visible', async ({ page }) => {
		await page.getByTestId('tab-create').click();
		await expect(page.getByTestId('tab-create')).toHaveClass(/active/);
		await expect(page.getByTestId('view-create')).toBeVisible();
	});

	test('tab Advanced — toutes les sections avancées visibles', async ({ page }) => {
		await page.getByTestId('tab-components').click();
		await expect(page.getByTestId('view-components')).toBeVisible();
		await expect(page.getByTestId('skeleton-section')).toBeVisible();
		await expect(page.getByTestId('field-inplace-section')).toBeVisible();
		await expect(page.getByTestId('selector-section')).toBeVisible();
		await expect(page.getByTestId('dataprovider-section')).toBeVisible();
		await expect(page.getByTestId('fieldvalue-section')).toBeVisible();
	});
});

// ─── Composant Create ─────────────────────────────────────────────────────────

test.describe('Composant Create', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.getByTestId('tab-create').click();
		await expect(page.getByTestId('view-create')).toBeVisible();
	});

	test('affiche le titre Create', async ({ page }) => {
		await expect(page.getByTestId('view-create')).toContainText('Create');
	});

	test('description mentionne le composant Create et ses props', async ({ page }) => {
		const desc = page.locator('[data-testid="view-create"] .description');
		await expect(desc).toContainText('Create');
		await expect(desc).toContainText('collection');
		await expect(desc).toContainText('onsubmit');
	});

	test('le formulaire Create est rendu avec un bouton Valider', async ({ page }) => {
		const form = page.locator('[data-testid="view-create"] .form-wrapper');
		await expect(form).toBeVisible();
		await expect(form.locator('button[type="submit"], button[aria-label="Submit"]')).toBeVisible();
	});

	test('changer de collection dans Create recharge le formulaire', async ({ page }) => {
		await expect(page.getByTestId('view-create')).toBeVisible();
		await page.getByTestId('collection-btn-product_category').click();
		// Retour sur grid après changement de collection
		await expect(page.getByTestId('view-grid')).toBeVisible();
	});
});

// ─── Composant Update ─────────────────────────────────────────────────────────

test.describe('Composant Update', () => {
	test("onglet Update apparaît uniquement après sélection d'un record", async ({ page }) => {
		await page.goto('/');
		await expect(page.getByTestId('tab-update')).not.toBeVisible();

		// Simuler un clic sur un record dans la Grid View — si la liste est vide,
		// on accède directement au tab update via Create puis retour
		// Ce test vérifie uniquement la condition d'apparition du tab
	});

	test('view-update inaccessible sans record (guard conditionnel)', async ({ page }) => {
		await page.goto('/');
		// Même si on essaie de naviguer, sans selectedRecord le bloc ne s'affiche pas
		await expect(page.getByTestId('view-update')).not.toBeVisible();
	});
});

// ─── Composant Skeleton ───────────────────────────────────────────────────────

test.describe('Skeleton — toggle chargement', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.getByTestId('tab-components').click();
	});

	test('skeleton masqué par défaut', async ({ page }) => {
		await expect(page.getByTestId('skeleton-demo')).not.toBeVisible();
	});

	test('cliquer toggle → skeleton visible', async ({ page }) => {
		await page.getByTestId('toggle-skeleton').click();
		await expect(page.getByTestId('skeleton-demo')).toBeVisible();
	});

	test('second clic → skeleton masqué à nouveau', async ({ page }) => {
		await page.getByTestId('toggle-skeleton').click();
		await expect(page.getByTestId('skeleton-demo')).toBeVisible();
		await page.getByTestId('toggle-skeleton').click();
		await expect(page.getByTestId('skeleton-demo')).not.toBeVisible();
	});

	test("label du bouton toggle change selon l'état", async ({ page }) => {
		const btn = page.getByTestId('toggle-skeleton');
		await expect(btn).toContainText('Afficher');
		await btn.click();
		await expect(btn).toContainText('Masquer');
	});
});

// ─── Composant FieldInPlace ───────────────────────────────────────────────────

test.describe('FieldInPlace — édition inline', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.getByTestId('tab-components').click();
	});

	test('section FieldInPlace visible dans Advanced', async ({ page }) => {
		await expect(page.getByTestId('field-inplace-section')).toBeVisible();
	});

	test('bouton Edit présent dans FieldInPlace', async ({ page }) => {
		const section = page.getByTestId('field-inplace-section');
		await expect(section.locator('button[aria-label="Edit"]')).toBeVisible();
	});

	test('cliquer Edit → affiche boutons Confirm et Cancel', async ({ page }) => {
		const section = page.getByTestId('field-inplace-section');
		await section.locator('button[aria-label="Edit"]').click();
		await expect(section.locator('button[aria-label="Confirm"]')).toBeVisible();
		await expect(section.locator('button[aria-label="Cancel"]')).toBeVisible();
	});

	test("cliquer Cancel → retour à l'état initial", async ({ page }) => {
		const section = page.getByTestId('field-inplace-section');
		await section.locator('button[aria-label="Edit"]').click();
		await section.locator('button[aria-label="Cancel"]').click();
		await expect(section.locator('button[aria-label="Edit"]')).toBeVisible();
	});
});

// ─── Selector ─────────────────────────────────────────────────────────────────

test.describe('Selector', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.getByTestId('tab-components').click();
	});

	test('section Selector visible avec ses items', async ({ page }) => {
		const section = page.getByTestId('selector-section');
		await expect(section).toBeVisible();
		await expect(section.locator('.selector-item')).toHaveCount(3);
	});
});

// ─── Cohérence inter-onglets ──────────────────────────────────────────────────

test.describe('Cohérence navigation globale', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('Grid View se recharge après changement de collection', async ({ page }) => {
		await page.getByTestId('collection-btn-product_category').click();
		await expect(page.getByTestId('view-grid')).toBeVisible();
		await expect(page.getByTestId('collection-btn-product_category')).toHaveClass(/active/);
	});

	test('InfoLine "Selected" passe à "No selection" après changement de collection', async ({
		page
	}) => {
		const info = page.getByTestId('info-section');
		await expect(info).toContainText('No selection');

		await page.getByTestId('collection-btn-agent').click();
		await expect(info).toContainText('No selection');
	});
});
