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

test('HtmluEvent observe method starts observing the observed element for mutations', () => {
	const observedElement = new ObservedElement(); // Replace with your observed element instance
	const htmluEvent = new HtmluEvent(observedElement);

	htmluEvent.observe();

	// Assert that the observer is created and observing the element
	// You can use a mocking library like Jest to create a mock observer and assert its behavior
});

test('HtmluEvent disconnect method stops observing the observed element for mutations', () => {
	const observedElement = new ObservedElement(); // Replace with your observed element instance
	const htmluEvent = new HtmluEvent(observedElement);

	htmluEvent.disconnect();

	// Assert that the observer is disconnected from the element
	// You can use a mocking library like Jest to create a mock observer and assert its behavior
});

test('HtmluEvent addEvent method adds an event listener to the observed element', () => {
	const observedElement = new ObservedElement(); // Replace with your observed element instance
	const htmluEvent = new HtmluEvent(observedElement);

	const eventType = 'click';
	const callback = jest.fn();

	htmluEvent.addEvent(eventType, callback);

	// Assert that the event listener is added to the element
	// You can use a mocking library like Jest to create a mock element and assert its behavior
});

test('HtmluEvent removeEvent method removes an event listener from the observed element', () => {
	const observedElement = new ObservedElement(); // Replace with your observed element instance
	const htmluEvent = new HtmluEvent(observedElement);

	const eventType = 'click';
	const callback = jest.fn();

	htmluEvent.removeEvent(eventType, callback);

	// Assert that the event listener is removed from the element
	// You can use a mocking library like Jest to create a mock element and assert its behavior
});
