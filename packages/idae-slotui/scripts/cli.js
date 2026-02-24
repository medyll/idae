#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';
import { Command } from 'commander';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const program = new Command();

// Helper for confirmation
const ask = (query) => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans.toLowerCase());
  }));
};

// Logic to find target path
const getTargetBase = () => {
  const configPath = path.join(process.cwd(), 'components.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.aliases?.components) {
        return config.aliases.components.replace('$lib', 'src/lib') + '/ui';
      }
    } catch (e) { /* ignore */ }
  }
  return 'src/lib/components/ui';
};

program
  .name('idae-slotui')
  .description('CLI to add Svelte components from idae-slotui')
  .version('0.1.0');

/**
 * COMMAND: list
 */
program
  .command('list')
  .description('List all available components')
  .action(() => {
    const registryPath = path.join(__dirname, '../components');
    const components = fs.readdirSync(registryPath)
      .filter(f => f.endsWith('.svelte'))
      .map(f => f.replace('.svelte', ''));

    console.log('\n📦 Available components:');
    components.forEach(c => console.log(`  - ${c}`));
  });

/**
 * COMMAND: add <name>
 */
program
  .command('add')
  .description('Add a component to your project')
  .argument('<name>', 'Component name')
  .option('-o, --overwrite', 'Overwrite existing files without asking', false)
  .action(async (name, options) => {
    const source = path.join(__dirname, '../components', `${name}.svelte`);
    const targetDir = path.join(process.cwd(), getTargetBase());
    const target = path.join(targetDir, `${name}.svelte`);

    if (!fs.existsSync(source)) {
      console.error(`❌ Component "${name}" not found.`);
      return;
    }

    if (fs.existsSync(target) && !options.overwrite) {
      const confirm = await ask(`⚠️  ${name}.svelte already exists. Overwrite? (y/N): `);
      if (confirm !== 'y' && confirm !== 'yes') return console.log('Aborted.');
    }

    fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(source, target);
    console.log(`✅ Installed ${name} in ${targetDir}`);
  });

program.parse();