#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const cmd = process.argv[2];

if (cmd === 'get-readme') {
  const readmePath = path.join(__dirname, 'README.md');
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf8');
    console.log(content);
  } else {
    console.error('README.md not found in this package.');
    process.exit(1);
  }
} else {
  console.log('Usage: <cli> get-readme');
  process.exit(1);
}
