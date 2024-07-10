import puppeteer from 'puppeteer';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Htmlu } from './domObserver.js';

describe('HtmluDomLib', () => {
	let browser: puppeteer.Browser;
	let page: puppeteer.Page;

	beforeAll(async () => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.goto('http://localhost:3000'); // Replace with the URL of your application
	});

	afterAll(async () => {
		await browser.close();
	});

	it('should attach the library to the specified elements', async () => {
		// Write your test logic here
		// Example:
		await page.evaluate(() => {
			const options = {
				defaultAttributeFilter: ['data-testid'],
				useSubtree: true,
				debounceTime: 100,
				errorHandler: (error) => {
					throw new Error(`HtmluDomLib error: ${error}`);
				}
			};

			Htmlu.updateOptions(options);

			Htmlu.attach({
				selectors: [{ element: '#widget', mutations: { attributes: ['lang'] } }],
				selectorCallback: (element, mutations, observer) => {
					// Your callback logic here
				},
				observerParameters: { attributeFilter: ['lang'], subtree: true }
			});
		});

		// Assert the expected behavior
		const activeObserversCount = await page.evaluate(() => {
			return Htmlu.getActiveObserversCount();
		});

		expect(activeObserversCount).toBe(1);
	});

	it('should detach the library from the specified elements', async () => {
		// Write your test logic here
		// Example:
		await page.evaluate(() => {
			Htmlu.detach('#widget');
		});

		// Assert the expected behavior
		// Example:
		const activeObserversCount = await page.evaluate(() => {
			return Htmlu.getActiveObserversCount();
		});

		expect(activeObserversCount).toBe(0);
	});
});
