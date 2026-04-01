import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { findSkillerSkillMd } from '../lib/install-skiller.js';
import { getTargets } from '../lib/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('findSkillerSkillMd', () => {
  it('finds skiller SKILL.md from source tree', () => {
    const result = findSkillerSkillMd();
    expect(result).not.toBeNull();
    expect(result).toContain('SKILL.md');
    expect(fs.existsSync(result)).toBe(true);
  });

  it('SKILL.md contains valid frontmatter', () => {
    const skillPath = findSkillerSkillMd();
    const content = fs.readFileSync(skillPath, 'utf8');
    expect(content).toMatch(/^---/);
    expect(content).toContain('name:');
    expect(content).toContain('description:');
  });
});

describe('install-skiller uses registry targets', () => {
  it('getTargets returns the same keys used by install-skiller', () => {
    const targets = getTargets();
    const keys = Object.keys(targets);
    // install-skiller iterates Object.values(getTargets()) for the interactive menu
    expect(keys.length).toBe(7);
    expect(keys).toContain('user');
    expect(keys).toContain('claude');
    expect(keys).toContain('cursor');
  });

  it('each target template resolves to a valid structure', () => {
    const targets = getTargets();
    for (const [key, target] of Object.entries(targets)) {
      expect(target.template.length).toBeGreaterThanOrEqual(3);
      expect(target.template).toContain('<pkg>');
      expect(target.label).toBe(key);
    }
  });
});
