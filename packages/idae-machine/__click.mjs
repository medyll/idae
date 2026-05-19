import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text().slice(0,150)); });

await page.goto('http://localhost:5173/vehicle');
await page.waitForTimeout(3000);

// click first item
const items = await page.$$('.explorer-item');
console.log('items found:', items.length);
if (items.length > 0) {
    await items[0].click();
    await page.waitForTimeout(1500);
}

await page.screenshot({ path: '__shot.png' });
const panel = await page.$('.collection-card-panel');
console.log('Card panel open:', !!panel);
if (panel) {
    const text = await panel.innerText();
    console.log('Panel content:', text.slice(0, 200));
}
if (errors.length) console.log('ERRORS:', errors.slice(0,5).join('\n'));
await browser.close();
