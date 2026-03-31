import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { resolveTargetPath, getTargets } from '../index.mjs';

// Get current file directory (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the path to skiller's own SKILL.md
 * Works whether skiller is installed globally, locally, or run from source
 * @returns {string|null} Path to SKILL.md or null
 */
export function findSkillerSkillMd() {
  // When run via npx, the CLI is in node_modules/@medyll/skiller/src/cli.mjs
  // So skiller's SKILL.md should be in node_modules/@medyll/skiller/lib/skill/skiller/SKILL.md

  // Try different locations
  const candidates = [
    // Development: packages/skiller/src/cli/install.js -> packages/skiller/lib/skill/skiller/SKILL.md
    path.resolve(__dirname, '..', '..', 'lib', 'skill', 'skiller', 'SKILL.md'),
    // Installed via npm/npx: node_modules/@medyll/skiller/src/cli/install.js -> lib/skill/skiller/SKILL.md
    path.resolve(__dirname, '..', 'lib', 'skill', 'skiller', 'SKILL.md'),
    // Alternative installed location (dist)
    path.resolve(__dirname, '..', 'dist', 'skill', 'skiller', 'SKILL.md'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Install skiller's own skill to a target directory
 * @param {string} target - Target name (e.g., 'user', 'cursor') or custom path
 */
export async function installSkillerSkill(target = 'user') {
  const skillSrc = findSkillerSkillMd();
  
  if (!skillSrc) {
    console.error('Could not find skiller\'s SKILL.md');
    console.error('This might be a bug. Please report it.');
    process.exit(1);
  }
  
  const cwd = process.cwd();
  let destDir;
  
  const targets = getTargets();
  
  if (targets[target]) {
    // Use target from registry
    destDir = resolveTargetPath(targets[target].template, 'skiller', cwd);
  } else {
    // Custom path
    destDir = target;
  }
  
  const destFile = path.join(destDir, 'SKILL.md');
  
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(skillSrc, destFile);
  
  console.log('\n✅ Skiller skill installed successfully!');
  console.log(`   ${destFile}`);
  console.log('\n📝 The skiller skill provides documentation for:');
  console.log('   - create-skill: Create new SKILL.md templates');
  console.log('   - test-skill: Evaluate skills against multiple LLMs');
  console.log('   - report: View evaluation reports');
  console.log('   - optimize: AI-powered skill optimization');
}

/**
 * Interactive prompt to select installation target
 */
export async function installSkillerInteractive() {
  const targets = Object.values(getTargets());
  const custom = { enabled: true, label: 'custom' };
  
  const readline = await import('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  
  console.log('\n📦 Where to install the skiller skill?\n');
  
  targets.forEach((target, index) => {
    const displayPath = target.template.includes('<pkg>')
      ? path.join(...target.template.map(p => p === '<pkg>' ? 'skiller' : p === 'homedir' ? '~' : p === 'cwd' ? '.' : p), 'SKILL.md')
      : target.path;
    console.log(`  ${index + 1}) ${target.label.padEnd(10)} → ${displayPath}`);
  });
  
  if (custom.enabled) {
    console.log(`  ${targets.length + 1}) ${custom.label.padEnd(10)} → ask for a custom path`);
  }
  console.log('');
  
  return new Promise((resolve, reject) => {
    rl.question(`Enter choice (1-${targets.length + (custom.enabled ? 1 : 0)}): `, (choice) => {
      const trimmed = choice.trim();
      const choiceNum = parseInt(trimmed, 10);
      
      if (choiceNum >= 1 && choiceNum <= targets.length) {
        const targetKey = Object.keys(getTargets())[choiceNum - 1];
        installSkillerSkill(targetKey);
      } else if (custom.enabled && choiceNum === targets.length + 1) {
        rl.question('Enter custom destination directory: ', (p) => {
          installSkillerSkill(p.trim());
          rl.close();
          resolve();
        });
        return;
      } else {
        console.error('Invalid choice.');
        rl.close();
        reject(new Error('Invalid choice'));
        return;
      }
      
      rl.close();
      resolve();
    });
  });
}
