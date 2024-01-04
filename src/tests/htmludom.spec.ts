import { HtmluDom } from '../../dist/HtmluDom.js';
import { test, expect } from '@playwright/test';

test('HtmluDom is defined', async ({ page }) => {
	await page.goto('http://localhost:3000');

	// Définissez le contenu HTML de la page
	await page.setContent(`
     window.testLib = HtmluDom.attach({
			selectors: [{ element: '#widget', mutations: { attributes: '[lang]' } }],
			selectorCallback: (mutations, observer) => {
				return {
					attributes: (mutation: MutationRecord, observer: MutationObserver) => {
					},
					childList: (mutation: MutationRecord, observer: MutationObserver) => {
					},
					characterData: (mutation: MutationRecord, observer: MutationObserver) => {
					}
				};
			},
		});
  `);

	const isHtmluDomDefined: boolean = await page.evaluate(() => {
		return typeof window.testLib !== 'undefined';
	});
	expect(isHtmluDomDefined).toBe(true);
});
