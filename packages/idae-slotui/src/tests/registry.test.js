import { test, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '../../');
const scripts = path.join(root, 'scripts');
const registryPath = path.join(root, 'registry', 'registry.json');
const pmpxPath = path.join(root, 'registry', 'pmpx-components.json');

test('generate registry and pmpx summary are consistent and exclude demos/previews', () => {
  // Run the generator (should be idempotent)
  execSync(`node ${path.join(scripts, 'generate-registry-from-lib.cjs')}`, { stdio: 'inherit' });
  execSync(`node ${path.join(scripts, 'make-pnpx.cjs')}`, { stdio: 'inherit' });

  expect(fs.existsSync(registryPath)).toBe(true);
  expect(fs.existsSync(pmpxPath)).toBe(true);

  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const pmpx = JSON.parse(fs.readFileSync(pmpxPath, 'utf8'));

  expect(Array.isArray(registry.components)).toBe(true);
  expect(Array.isArray(pmpx.components)).toBe(true);

  // Counts should match
  expect(pmpx.components.length).toBe(registry.components.length);

  // Ensure excluded patterns are not present
  for (const c of registry.components) {
    const name = c.name || '';
    expect(name).not.toMatch(/\.demo$/);
    expect(name).not.toMatch(/\.preview$/);
    expect(name.startsWith('_')).toBe(false);
  }
});
