import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('devrait afficher le titre principal', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(['idae-slotui', 'SlotUI', 'Svelte']);
  });
});
