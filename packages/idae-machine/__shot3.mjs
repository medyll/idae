import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const logs = [];
page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text().slice(0,200)}`));

await page.goto('http://localhost:5173/vehicle');
await page.waitForTimeout(4000);
await page.screenshot({ path: '__shot.png' });

const listItems = await page.$$('.explorer-item');
console.log('Explorer items found:', listItems.length);
console.log('LOGS:', logs.slice(0, 20).join('\n'));
await browser.close();
