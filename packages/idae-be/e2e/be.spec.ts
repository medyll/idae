// e2e/be.spec.ts
import { test, expect } from '@playwright/test';

test('Be library manipulates DOM correctly', async ({ page }) => {
	await page.goto('http://localhost:5173/test-page'); // Adjust URL as needed

	await page.evaluate(() => {
		const { be, toBe } = window.idaeBe; // Assume your library is exposed globally
		be('#app').append(toBe('<button id="testButton">Click me</button>'), ({ be: button }) => {
			button.on('click', () => {
				be('#app').append(toBe('<p id="result">Clicked!</p>'));
			});
		});
	});

	await page.click('#testButton');
	const result = await page.textContent('#result');
	expect(result).toBe('Clicked!');
});
