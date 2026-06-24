#!/usr/bin/env node
/**
 * BL-25 Audit Script — Field Type Mismatch Analysis
 * 
 * Scans all business models, compares inline field types vs FieldList catalog types,
 * exports mismatches and missing fields for manual review.
 * 
 * Usage: node bmad/scripts/BL-25-audit-mismatches.mjs [--output-dir=DIR]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd(); // Use current working directory
const FIELD_DEFS_PATH = path.join(ROOT, 'server/src/idae/field-defs.ts');
const MODELS_DIR = path.join(ROOT, 'server/src/models');
let OUTPUT_DIR = path.join(__dirname, '../artifacts/BL-25-audit');

// Parse command line args
const args = process.argv.slice(2);
const customOutputDir = args.find(arg => arg.startsWith('--output-dir='))?.split('=')[1];
if (customOutputDir) {
  OUTPUT_DIR = path.resolve(ROOT, customOutputDir);
}

console.log('[BL-25 Audit] Starting field type mismatch analysis...');
console.log(`Root: ${ROOT}`);
console.log(`FieldList: ${FIELD_DEFS_PATH}`);
console.log(`Models dir: ${MODELS_DIR}`);
console.log(`Output dir: ${OUTPUT_DIR}`);

// Ensure output directory exists
try {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`Created output directory: ${OUTPUT_DIR}`);
} catch (err) {
  if (err.code !== 'EEXIST') throw err;
}

// Load FieldList from field-defs.ts
async function loadFieldList() {
  console.log('\n[1/4] Loading FieldList from field-defs.ts...');
  
  const src = await fs.readFile(FIELD_DEFS_PATH, 'utf8');
  const fieldList = {};
  
  // Extract FieldList object using regex
  const declStart = src.indexOf('export const FieldList = {');
  const closeIdx = src.indexOf('\n} as const satisfies Record<string, Partial<AppSchemeField>>;', declStart);
  
  if (declStart === -1 || closeIdx === -1) {
    throw new Error('Could not locate FieldList declaration in field-defs.ts');
  }
  
  const body = src.slice(declStart, closeIdx);
  
  // Match field entries: fieldName: { code: '...', type: '...', ... }
  const fieldRegex = /\t([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*\{[\s\S]*?type:\s*'([^']*)'[\s\S]*?\}/g;
  let match;
  
  while ((match = fieldRegex.exec(body)) !== null) {
    const fieldName = match[1];
    const fieldType = match[2];
    fieldList[fieldName] = fieldType;
  }
  
  console.log(`Loaded ${Object.keys(fieldList).length} fields from FieldList`);
  return fieldList;
}

// Load all business models
async function loadBusinessModels() {
  console.log('\n[2/4] Loading business models...');
  
  const models = {};
  const dirs = await fs.readdir(MODELS_DIR, { withFileTypes: true });
  
  for (const dirent of dirs) {
    if (!dirent.isDirectory()) continue;
    
    const modelDir = path.join(MODELS_DIR, dirent.name);
    const schemeFile = path.join(modelDir, `${dirent.name}Scheme.ts`);
    
    try {
      await fs.access(schemeFile);
      console.log(`Found model: ${dirent.name}`);
      
      // Import the module dynamically - use full path
      const fullPath = `file://${schemeFile}`;
      const mod = await import(fullPath);
      for (const [name, model] of Object.entries(mod)) {
        if (name.endsWith('Scheme') && model && typeof model === 'object') {
          models[name] = model;
          console.log(`  Loaded ${Object.keys(model).length} collections from ${name}`);
        }
      }
    } catch (err) {
      console.log(`Skipping ${dirent.name}: ${err.message}`);
    }
  }
  
  console.log(`Loaded ${Object.keys(models).length} business models`);
  return models;
}

// Analyze field type mismatches
function analyzeMismatches(models, fieldList) {
  console.log('\n[3/4] Analyzing field type mismatches...');
  
  const mismatches = [];
  const missingFromCatalog = new Set();
  let totalFields = 0;
  
  for (const [modelName, model] of Object.entries(models)) {
    for (const [collectionName, collection] of Object.entries(model)) {
      if (!collection.fields) continue;
      
      for (const [fieldName, fieldDef] of Object.entries(collection.fields)) {
        totalFields++;
        
        if (!fieldDef.type) {
          console.warn(`Field ${fieldName} in ${modelName}.${collectionName} has no type`);
          continue;
        }
        
        const catalogType = fieldList[fieldName];
        
        if (!catalogType) {
          missingFromCatalog.add(fieldName);
        } else if (catalogType !== fieldDef.type) {
          mismatches.push({
            model: modelName,
            collection: collectionName,
            field: fieldName,
            inlineType: fieldDef.type,
            catalogType: catalogType,
            required: !!fieldDef.required,
            readonly: !!fieldDef.readonly
          });
        }
      }
    }
  }
  
  console.log(`Analyzed ${totalFields} total fields`);
  console.log(`Found ${mismatches.length} type mismatches`);
  console.log(`Found ${missingFromCatalog.size} fields missing from catalog`);
  
  return { mismatches, missingFromCatalog: Array.from(missingFromCatalog).sort() };
}

// Export results
async function exportResults(mismatches, missingFields) {
  console.log('\n[4/4] Exporting results...');
  
  // Export mismatches as JSON
  const mismatchesJsonPath = path.join(OUTPUT_DIR, 'mismatches.json');
  await fs.writeFile(mismatchesJsonPath, JSON.stringify(mismatches, null, 2), 'utf8');
  console.log(`Exported ${mismatches.length} mismatches to ${mismatchesJsonPath}`);
  
  // Export mismatches as CSV
  const mismatchesCsvPath = path.join(OUTPUT_DIR, 'mismatches.csv');
  const csvHeader = 'Model,Collection,Field,InlineType,CatalogType,Required,Readonly\n';
  const csvRows = mismatches.map(m => 
    `${m.model},${m.collection},${m.field},${m.inlineType},${m.catalogType},${m.required},${m.readonly}`
  ).join('\n');
  await fs.writeFile(mismatchesCsvPath, csvHeader + csvRows, 'utf8');
  console.log(`Exported mismatches to ${mismatchesCsvPath}`);
  
  // Export missing fields
  const missingJsonPath = path.join(OUTPUT_DIR, 'missing-fields.json');
  await fs.writeFile(missingJsonPath, JSON.stringify(missingFields, null, 2), 'utf8');
  console.log(`Exported ${missingFields.length} missing fields to ${missingJsonPath}`);
  
  // Export summary markdown
  const summaryPath = path.join(OUTPUT_DIR, 'AUDIT-SUMMARY.md');
  const summary = `# BL-25 Field Type Audit — Summary

## Overview
- **Total fields analyzed**: ${totalFields}
- **Type mismatches found**: ${mismatches.length}
- **Fields missing from catalog**: ${missingFields.length}

## Files Generated
- [mismatches.json](mismatches.json) — Full mismatch details (JSON)
- [mismatches.csv](mismatches.csv) — Mismatches in CSV format
- [missing-fields.json](missing-fields.json) — Fields missing from FieldList

## Next Steps

### 1. Review Mismatches
Examine mismatches.csv to determine for each field:
- Should the catalog adopt the inline type (rich types like phone, icon, currency, image, url)?
- Is the inline type incorrect and should be changed to match the catalog?
- Are there legitimate context-dependent differences?

### 2. Add Missing Fields
Add the ${missingFields.length} missing fields to server/src/idae/field-defs.ts using appropriate types.

### 3. Update FieldList
Apply decisions to FieldList, document overrides in bmad/artifacts/docs/BL-25-reconciliation.md.

### 4. Validate
Run validation script to ensure 100% coverage and no undocumented mismatches remain.

## Decision Principles (Suggested)

1. **Rich field types** (phone, icon, currency, image, url) → Prefer inline type
2. **Standard types** (text, number, boolean, date) → Prefer catalog type for consistency
3. **Special cases** (id, email, password) → Document rationale for overrides
4. **Context-dependent** → Preserve both with explicit override documentation
`;
  
  await fs.writeFile(summaryPath, summary, 'utf8');
  console.log(`Exported summary to ${summaryPath}`);
}

// Main execution
async function main() {
  try {
    const fieldList = await loadFieldList();
    const models = await loadBusinessModels();
    const { mismatches, missingFromCatalog } = analyzeMismatches(models, fieldList);
    await exportResults(mismatches, missingFromCatalog);
    
    console.log('\n✅ BL-25 audit completed successfully!');
    console.log(`📁 Results in: ${OUTPUT_DIR}`);
    console.log(`📊 Mismatches: ${mismatches.length}`);
    console.log(`❌ Missing fields: ${missingFromCatalog.length}`);
    
  } catch (error) {
    console.error('\n❌ Audit failed:', error.message);
    process.exit(1);
  }
}

main();
