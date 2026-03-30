import fs from 'fs';
import path from 'path';

export function findPackageJson(dir) {
  const candidate = path.join(dir, 'package.json');
  if (fs.existsSync(candidate)) return candidate;
  const parent = path.dirname(dir);
  if (parent === dir) return null;
  return findPackageJson(parent);
}

export function findSkillMd(pkgDir) {
  const candidates = [
    path.join(pkgDir, 'src', 'lib', 'SKILL.md'),
    path.join(pkgDir, 'lib', 'skill', 'SKILL.md'),
    path.join(pkgDir, 'dist', 'skill', 'SKILL.md'),
    path.join(pkgDir, 'SKILL.md'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

export function installSkill({ pkgName, skillSrc, destDir }) {
  const destFile = path.join(destDir, 'SKILL.md');
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(skillSrc, destFile);
  console.log(`\nSkill installed: ${destFile}`);
}
