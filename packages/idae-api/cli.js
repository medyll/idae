#!/usr/bin/env node

const fs = require('fs');
const path = require('path');


const pkgJson = require(path.join(__dirname, 'package.json'));
const packageName = pkgJson.name.replace(/^@[^/]+\//, '');
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
} else if (cmd === 'install-skill') {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const skillSrc = path.join(__dirname, 'SKILL.md');
  const skillDest = path.resolve(__dirname, `../../../.github/skills/${packageName}/SKILL.md`);
  if (!fs.existsSync(skillSrc)) {
    console.error('SKILL.md not found in this package.');
    process.exit(1);
  }
  rl.question(`This will copy SKILL.md to .github/skills/${packageName}/SKILL.md. Continue? (y/n): `, (answer) => {
    if (answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes') {
      fs.mkdirSync(path.dirname(skillDest), { recursive: true });
      fs.copyFileSync(skillSrc, skillDest);
      console.log(`SKILL.md installed to .github/skills/${packageName}/SKILL.md`);
    } else {
      console.log('Operation cancelled.');
    }
    rl.close();
  });
} else {
  console.log('Usage: <cli> get-readme | install-skill');
  process.exit(1);
}
