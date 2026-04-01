#!/usr/bin/env node
/**
 * Build script for @medyll/skiller
 * Copies source files to dist/ for publishing
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Directories to copy
const dirsToCopy = [
  { src: 'src', dest: 'dist' },
  { src: 'lib', dest: 'dist/lib' }
];

// Files to copy to dist root
const filesToCopy = [
  { src: 'package.json', dest: 'dist/package.json' },
  { src: 'README.md', dest: 'dist/README.md', optional: true }
];

// Files to exclude from copy
const excludeFiles = ['cli.mjs']; // Old CLI file, no longer used

/**
 * Copy a file from src to dest
 */
function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  Copied: ${path.relative(rootDir, dest)}`);
}

/**
 * Copy a directory recursively
 */
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (excludeFiles.includes(entry.name)) {
      // Skip excluded files
      continue;
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

/**
 * Clean dist directory
 */
function cleanDist() {
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log('Cleaned dist/');
  }
}

// Main build process
console.log('\n🔨 Building @medyll/skiller...\n');

// Step 1: Clean dist
cleanDist();

// Step 2: Copy directories
console.log('Copying directories:');
dirsToCopy.forEach(({ src, dest }) => {
  const srcDir = path.join(rootDir, src);
  const destDir = path.join(rootDir, dest);
  
  if (!fs.existsSync(srcDir)) {
    console.warn(`  Warning: ${src} does not exist, skipping...`);
    return;
  }
  
  copyDir(srcDir, destDir);
  console.log(`  ✓ ${src} → ${dest}\n`);
});

// Step 3: Copy files to dist root
console.log('Copying files:');
filesToCopy.forEach(({ src, dest, optional }) => {
  const srcPath = path.join(rootDir, src);
  const destPath = path.join(rootDir, dest);
  
  if (!fs.existsSync(srcPath)) {
    if (optional) {
      console.log(`  Skipped (optional): ${src}`);
      return;
    }
    throw new Error(`Required file not found: ${src}`);
  }
  
  copyFile(srcPath, destPath);
});

console.log('\n✅ Build complete!\n');
