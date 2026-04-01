import { describe, it, expect } from 'vitest';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, '..', '..');

function runCli(entryFile, args = ['--help']) {
  return execFileSync('node', [path.join(pkgRoot, 'src', 'lib', entryFile), ...args], {
    encoding: 'utf8',
    timeout: 10000,
    cwd: pkgRoot,
  });
}

describe('cli.js (skiller main)', () => {
  it('shows help with install-skill command', () => {
    const output = runCli('cli.js');
    expect(output).toContain('install-skill');
    expect(output).toContain('skiller');
  });

  it('shows version', () => {
    const output = runCli('cli.js', ['--version']);
    expect(output.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

describe('client-cli.js (add-skill / create-skill)', () => {
  it('shows help with add-skill and create-skill commands', () => {
    const output = runCli('client-cli.js');
    expect(output).toContain('add-skill');
    expect(output).toContain('create-skill');
  });

  it('does not contain install-skill', () => {
    const output = runCli('client-cli.js');
    expect(output).not.toContain('install-skill');
  });
});

describe('test-cli.js (test-skill / report / optimize)', () => {
  it('has correct shebang and is a valid JS file', () => {
    const filePath = path.join(pkgRoot, 'src', 'lib', 'test-cli.js');
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('#!/usr/bin/env node');
    expect(content).toContain("command('test-skill')");
    expect(content).toContain("command('report')");
    expect(content).toContain("command('optimize')");
  });
});
