const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getCommitsSinceLastTag() {
  try {
    const lastTag = execSync('git describe --tags --abbrev=0').toString().trim();
    console.log('Last tag:', lastTag);
    const commits = execSync(`git log ${lastTag}..HEAD --pretty=format:%s`).toString().trim().split('\n');
    console.log('Commits since last tag:', commits);
    return commits;
  } catch (error) {
    console.error('Erreur lors de la récupération des commits:', error);
    return [];
  }
}

function getBumpType(commitMessage) {
  const lowerCaseMessage = commitMessage.toLowerCase();
  if (lowerCaseMessage.includes('breaking change')) return 'major';
  if (lowerCaseMessage.startsWith('feat') || lowerCaseMessage.includes('feature')) return 'minor';
  if (lowerCaseMessage.startsWith('fix') || lowerCaseMessage.includes('bug')) return 'patch';
  return 'patch'; // Par défaut
}

function generateChangesetContent(packageName, bumpType, summary) {
  return `---
"${packageName}": ${bumpType}
---

${summary}
`;
}

function sanitizeCommitMessage(message) {
  // Enlève les préfixes courants et nettoie le message
  const prefixes = ['feat:', 'fix:', 'chore:', 'docs:', 'style:', 'refactor:', 'perf:', 'test:'];
  let cleanMessage = message;
  for (const prefix of prefixes) {
    if (message.toLowerCase().startsWith(prefix)) {
      cleanMessage = message.slice(prefix.length).trim();
      break;
    }
  }
  return cleanMessage;
}

const commits = getCommitsSinceLastTag();

const packagesDir = path.join(__dirname, '..', 'packages');
console.log('Packages directory:', packagesDir);
const packages = fs.readdirSync(packagesDir);
console.log('Packages found:', packages);

packages.forEach(packageName => {
  const packagePath = path.join(packagesDir, packageName);
  const packageJsonPath = path.join(packagePath, 'package.json');

  console.log(`Processing package: ${packageName}`);
  console.log(`Package.json path: ${packageJsonPath}`);

  if (!fs.existsSync(packageJsonPath)) {
    console.error(`Le package ${packageName} n'a pas de fichier package.json`);
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  console.log(`Package.json content for ${packageName}:`, JSON.stringify(packageJson, null, 2));

  let modified = false;

  // Vérifier et ajouter le scope si nécessaire
  if (!packageJson.name.startsWith('@medyll/')) {
    packageJson.name = `@medyll/${packageJson.name}`;
    modified = true;
    console.log(`Scope ajouté au package ${packageName}`);
  }

  // Ajouter le champ scope s'il est absent
  if (!packageJson.scope) {
    packageJson.scope = 'medyll';
    modified = true;
    console.log(`Champ scope ajouté au package ${packageName}`);
  }

  if (modified) {
    // Écrire les modifications dans le fichier package.json sans ajouter de saut de ligne à la fin
    const packageJsonString = JSON.stringify(packageJson, null, 2);
    fs.writeFileSync(packageJsonPath, packageJsonString.replace(/\n$/, ''));
    console.log(`Le fichier package.json de ${packageName} a été mis à jour`);
  }

  const packageCommits = commits.filter(commit => 
    commit.toLowerCase().includes(packageName.toLowerCase())
  );

  if (packageCommits.length > 0) {
    const highestBumpType = packageCommits.reduce((highest, commit) => {
      const currentBump = getBumpType(commit);
      return currentBump > highest ? currentBump : highest;
    }, 'patch');

    const summary = packageCommits
      .map(sanitizeCommitMessage)
      .join('\n');

    const changesetContent = generateChangesetContent(packageName, highestBumpType, summary);

    const changesetDir = path.join(__dirname, '..', '.changeset');
    if (!fs.existsSync(changesetDir)) {
      fs.mkdirSync(changesetDir);
    }

    const changesetFile = path.join(changesetDir, `${packageName}-${Date.now()}.md`);
    fs.writeFileSync(changesetFile, changesetContent);

    console.log(`Changeset généré pour ${packageName}`);
  }
});

console.log('Changeset generation completed');