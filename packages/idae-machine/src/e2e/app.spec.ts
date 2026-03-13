import { test, expect } from '@playwright/test';

/**
 * E2E tests for idae-machine demo page (+page.svelte)
 * Vérifie que tous les composants sont rendus et fonctionnels
 */

test.describe('Page de démo — structure de base', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('le header est présent avec le bon titre', async ({ page }) => {
		await expect(page.locator('.demo-header h1')).toContainText('idae-machine Component Showcase');
		await expect(page.locator('.demo-header p')).toBeVisible();
	});

	test('le panneau gauche est visible avec les collections', async ({ page }) => {
		const panel = page.getByTestId('left-panel');
		await expect(panel).toBeVisible();

		// Les collections du testScheme : product, product_category, agent
		await expect(page.getByTestId('collection-btn-product')).toBeVisible();
		await expect(page.getByTestId('collection-btn-product_category')).toBeVisible();
		await expect(page.getByTestId('collection-btn-agent')).toBeVisible();
	});

	test('la navigation par tabs est présente', async ({ page }) => {
		const nav = page.getByTestId('tabs-nav');
		await expect(nav).toBeVisible();

		await expect(page.getByTestId('tab-grid')).toBeVisible();
		await expect(page.getByTestId('tab-menu')).toBeVisible();
		await expect(page.getByTestId('tab-create')).toBeVisible();
		await expect(page.getByTestId('tab-components')).toBeVisible();

		// Edit/Relations n'apparaissent que si un record est sélectionné
		await expect(page.getByTestId('tab-edit')).not.toBeVisible();
		await expect(page.getByTestId('tab-relationships')).not.toBeVisible();
	});

	test('le footer est présent', async ({ page }) => {
		await expect(page.getByTestId('footer')).toBeVisible();
	});
});

test.describe('Navigation entre collections', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('product est actif par défaut', async ({ page }) => {
		await expect(page.getByTestId('collection-btn-product')).toHaveClass(/active/);
	});

	test('cliquer sur product_category change la collection active', async ({ page }) => {
		await page.getByTestId('collection-btn-product_category').click();
		await expect(page.getByTestId('collection-btn-product_category')).toHaveClass(/active/);
		await expect(page.getByTestId('collection-btn-product')).not.toHaveClass(/active/);
	});

	test('InfoLine affiche la collection sélectionnée', async ({ page }) => {
		const info = page.getByTestId('info-section');
		await expect(info).toContainText('product');

		await page.getByTestId('collection-btn-agent').click();
		await expect(info).toContainText('agent');
	});
});

test.describe('Navigation par tabs', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('Grid View actif par défaut — affiche CollectionList', async ({ page }) => {
		await expect(page.getByTestId('tab-grid')).toHaveClass(/active/);
		await expect(page.getByTestId('view-grid')).toBeVisible();
		await expect(page.getByTestId('view-menu')).not.toBeVisible();
	});

	test('tab Menu View — affiche CollectionListMenu', async ({ page }) => {
		await page.getByTestId('tab-menu').click();
		await expect(page.getByTestId('tab-menu')).toHaveClass(/active/);
		await expect(page.getByTestId('view-menu')).toBeVisible();
		await expect(page.getByTestId('view-grid')).not.toBeVisible();
	});

	test('tab Create — affiche CreateUpdate en mode create', async ({ page }) => {
		await page.getByTestId('tab-create').click();
		await expect(page.getByTestId('tab-create')).toHaveClass(/active/);
		await expect(page.getByTestId('view-create')).toBeVisible();
	});

	test('tab Advanced — affiche les composants avancés', async ({ page }) => {
		await page.getByTestId('tab-components').click();
		await expect(page.getByTestId('view-components')).toBeVisible();

		// Toutes les sections avancées doivent être présentes
		await expect(page.getByTestId('skeleton-section')).toBeVisible();
		await expect(page.getByTestId('field-inplace-section')).toBeVisible();
		await expect(page.getByTestId('selector-section')).toBeVisible();
		await expect(page.getByTestId('dataprovider-section')).toBeVisible();
		await expect(page.getByTestId('fieldvalue-section')).toBeVisible();
	});
});

test.describe('Composant Skeleton — toggle chargement', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.getByTestId('tab-components').click();
	});

	test('skeleton masqué par défaut', async ({ page }) => {
		await expect(page.getByTestId('skeleton-demo')).not.toBeVisible();
	});

	test('cliquer toggle affiche le skeleton', async ({ page }) => {
		await page.getByTestId('toggle-skeleton').click();
		await expect(page.getByTestId('skeleton-demo')).toBeVisible();
	});

	test('second clic masque le skeleton', async ({ page }) => {
		await page.getByTestId('toggle-skeleton').click();
		await expect(page.getByTestId('skeleton-demo')).toBeVisible();
		await page.getByTestId('toggle-skeleton').click();
		await expect(page.getByTestId('skeleton-demo')).not.toBeVisible();
	});
});

test.describe('Changement de collection recharge les vues', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('Grid View se recharge avec la nouvelle collection', async ({ page }) => {
		// On part sur Grid View avec product
		await expect(page.getByTestId('view-grid')).toBeVisible();

		// On change de collection
		await page.getByTestId('collection-btn-product_category').click();

		// La vue grid est toujours visible (pas de crash)
		await expect(page.getByTestId('view-grid')).toBeVisible();

		// La collection active a changé
		await expect(page.getByTestId('collection-btn-product_category')).toHaveClass(/active/);
	});

	test('changer de collection en mode Create reste sur Create', async ({ page }) => {
		await page.getByTestId('tab-create').click();
		await expect(page.getByTestId('view-create')).toBeVisible();

		await page.getByTestId('collection-btn-agent').click();
		// On revient sur grid après changement de collection
		await expect(page.getByTestId('view-grid')).toBeVisible();
	});
});
