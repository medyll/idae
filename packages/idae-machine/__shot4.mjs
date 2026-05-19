import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const logs = [];
page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text().slice(0,300)}`));
page.on('pageerror', err => logs.push(`[pageerror] ${err.message}`));

await page.goto('http://localhost:5173/vehicle');
await page.waitForTimeout(5000);

// inject check
const result = await page.evaluate(async () => {
    try {
        const { machine } = await import('http://localhost:5173/src/lib/main/machine.js');
        const items = machine.store?.['vehicle']?.getAll?.();
        return { items: Array.isArray(items) ? items.length : String(items), type: typeof items };
    } catch(e) {
        return { error: String(e) };
    }
});

console.log('store check:', JSON.stringify(result));
console.log('LOGS:', logs.slice(0, 30).join('\n'));
await browser.close();
