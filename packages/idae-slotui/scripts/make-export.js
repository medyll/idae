import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { minimatch } from 'minimatch';

// --- CONFIGURATION ---
export const COMPONENT_ROOTS = [
  'src/lib/base',
  'src/lib/controls',
  'src/lib/data',
  'src/lib/navigation',
  'src/lib/ui',
];

export const EXCLUDE_GLOBS = [
  '**/*.test*',
  '**/*.demo*',
  '**/*.preview*',
];
// ---------------------

class IndexGenerator {
  constructor(roots, excludes) {
    this.roots = roots;
    this.excludes = excludes;
    this.baseDir = path.dirname(fileURLToPath(import.meta.url));
  }

  /**
   * Converts snake_case or kebab-case to PascalCase
   * @param {string} str 
   */
  toPascalCase(str) {
    return str
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  /**
   * Filter Svelte files based on exclude patterns
   */
  async getSvelteFiles(dir) {
    const entries = await fs.readdir(dir);
    return entries.filter(f => {
      if (!f.endsWith('.svelte')) return false;
      const relPath = path.join(path.basename(dir), f);
      return !this.excludes.some(pattern => 
        minimatch(f, pattern, { matchBase: true }) || minimatch(relPath, pattern)
      );
    });
  }

  /**
   * Check if a directory has a .export file containing "flat"
   */
  async isForcedFlat(dir) {
    try {
      const configPath = path.join(dir, '.export');
      const content = await fs.readFile(configPath, 'utf-8');
      return content.trim().toLowerCase() === 'flat';
    } catch {
      return false;
    }
  }

  /**
   * Simple export for a single component or forced flat mode
   * Converts filenames to PascalCase for the export name
   */
  async writeFlatIndex(dir, files) {
    const exports = files.map(f => {
      const fileName = path.basename(f, '.svelte');
      const componentName = this.toPascalCase(fileName);
      return `import ${componentName} from "./${f}";\nexport { ${componentName} };`;
    });
    await fs.writeFile(path.join(dir, 'index.ts'), exports.join('\n') + '\n');
  }

  /**
   * Structured export: One Root component and others as properties
   */
  async writeMultipleIndex(dir, files) {
    const names = files.map(f => path.basename(f, '.svelte'));
    
    // Find the shortest name to use as Root (base for naming)
    const rawRootName = names.reduce((acc, curr) => 
      (curr.length < acc.length || (curr.length === acc.length && curr < acc)) ? curr : acc
    );

    const rootExportName = this.toPascalCase(rawRootName);
    const importLines = [`import ${rootExportName}Root from "./${rawRootName}.svelte";`];
    
    const subComponents = names.filter(n => n !== rawRootName);
    const objectProps = [`Root: ${rootExportName}Root`];

    for (const n of subComponents) {
      const componentName = this.toPascalCase(n);
      importLines.push(`import ${componentName} from "./${n}.svelte";`);

      // Extract suffix: if name starts with root, slice it, else use full name
      let prop = n.startsWith(rawRootName) ? n.slice(rawRootName.length) : n;
      // Clean potential separators and convert to PascalCase
      prop = this.toPascalCase(prop || n);
      
      objectProps.push(`${prop}: ${componentName}`);
    }

    const content = `${importLines.join('\n')}\n\nexport const ${rootExportName} = { ${objectProps.join(', ')} };\n`;
    await fs.writeFile(path.join(dir, 'index.ts'), content);
  }

  /**
   * Process directory and decide which export strategy to use
   */
  async processDir(dir) {
    try {
      const stat = await fs.stat(dir);
      if (!stat.isDirectory()) return;
      
      const files = await this.getSvelteFiles(dir);
      if (files.length === 0) return;

      const forcedFlat = await this.isForcedFlat(dir);

      if (files.length === 1 || forcedFlat) {
        await this.writeFlatIndex(dir, files);
      } else {
        await this.writeMultipleIndex(dir, files);
      }
    } catch (e) {
      // Ignore errors for missing directories
    }
  }

  /**
   * Entry point: Generate all index files
   */
  async generate() {
    const libRoot = path.resolve(this.baseDir, '..', 'src/lib');
    
    // Generate main library entry point
    const libExports = this.roots
      .map(root => `export * from './${path.basename(root)}/index.js';`)
      .join('\n') + '\n';
    
    await fs.writeFile(path.join(libRoot, 'index.ts'), libExports);

    for (const root of this.roots) {
      const absRoot = path.resolve(this.baseDir, '..', root);
      let entries = [];
      
      try {
        entries = await fs.readdir(absRoot, { withFileTypes: true });
      } catch { continue; }

      const exportLines = [];
      for (const d of entries) {
        if (d.isDirectory()) {
          const isExcluded = this.excludes.some(p => minimatch(d.name, p, { matchBase: true }));

          if (!isExcluded) {
            await this.processDir(path.join(absRoot, d.name));
            exportLines.push(`export * from './${d.name}/index.js';`);
          }
        }
      }

      if (exportLines.length) {
        await fs.writeFile(path.join(absRoot, 'index.ts'), exportLines.join('\n') + '\n');
      }
    }
    console.log('✅ Index files synced and formatted.');
  }
}

export { IndexGenerator };

if (import.meta.url === `file://${process.argv[1]}`) {
  new IndexGenerator(COMPONENT_ROOTS, EXCLUDE_GLOBS).generate();
}