import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 12000 });
} catch(e) {
    console.log('networkidle timeout, using domcontentloaded');
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 8000 });
}

await page.screenshot({ path: '__shot.png' });
console.log('URL:', page.url());
const bodyText = (await page.innerText('body').catch(() => '')).slice(0, 300);
console.log('Body:', bodyText);
if (errors.length) console.log('ERRORS:', errors.slice(0, 5).join('\n'));
await browser.close();
