import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const logs = [];
page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text().slice(0,200)}`));
await page.goto('http://localhost:5173/vehicle');
await page.waitForTimeout(4000);

const items = await page.$$('.explorer-item');
console.log('Items found:', items.length);

if (items.length > 0) {
    const html = await items[0].innerHTML();
    console.log('First item HTML:', html.slice(0, 300));
}

const allText = await page.innerText('.app-main').catch(() => 'error');
console.log('Main text:', allText.slice(0, 400));

const errors = logs.filter(l => l.startsWith('[error]'));
if (errors.length) console.log('ERRORS:', errors.join('\n'));

await page.screenshot({ path: '__shot.png' });
await browser.close();
