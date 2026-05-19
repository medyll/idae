import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('console', msg => { if (msg.type() === 'error') console.log('[ERR]', msg.text().slice(0,120)); });

await page.goto('http://localhost:5173/vehicle');
await page.waitForTimeout(3000);

const items = await page.$$('.explorer-item');
console.log('items:', items.length);
await items[0].click();
await page.waitForTimeout(1000);
console.log('URL after click:', page.url());

// direct deep link
await page.goto('http://localhost:5173/vehicle/2');
await page.waitForTimeout(2000);
const panel = await page.$('.collection-card-panel');
console.log('Deep link panel:', !!panel);
const content = await panel?.innerText();
console.log('Content:', content?.slice(0,100));

await page.screenshot({ path: '__shot.png' });
await browser.close();
