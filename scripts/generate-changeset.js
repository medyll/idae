const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Fonction pour obtenir les commits depuis le dernier tag
function getCommitsSinceLastTag() {
  try {
    const lastTag = execSync('git describe --tags --abbrev=0').toString().trim();
    return execSync(`git log ${lastTag}..HEAD --pretty=format:%s`).toString().trim().split('\n');
  } catch (error) {
    console.error('Erreur lors de la récupération des commits:', error);
    return [];
  }
}

// Fonction pour déterminer le type de bump basé sur le message de commit
function getBumpType(commitMessage) {
  if (commitMessage.toLowerCase().includes('breaking change')) return 'major';
  if (commitMessage.startsWith('feat:')) return 'minor';
  if (commitMessage.startsWith('fix:')) return 'patch';
  return 'patch'; // Par défaut, on considère que c'est un patch
}

// Fonction pour générer le contenu du changeset
function generateChangesetContent(packageName, bumpType, summary) {
  return `---
"${packageName}": ${bumpType}
---

${summary}
`;
}

// Obtenir les commits depuis le dernier tag
const commits = getCommitsSinceLastTag();

// Générer un changeset pour chaque package affecté
const packages = fs.readdirSync(path.join(__dirname, '..', 'packages'));
packages.forEach(packageName => {
  const packageCommits = commits.filter(commit => commit.includes(packageName));
  if (packageCommits.length > 0) {
    const highestBumpType = packageCommits.reduce((highest, commit) => {
      const currentBump = getBumpType(commit);
      return currentBump > highest ? currentBump : highest;
    }, 'patch');

    const summary = packageCommits.map(commit => commit.split(':')[1].trim()).join('\n');
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