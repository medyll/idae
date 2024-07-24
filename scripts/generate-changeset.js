const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getCommitsSinceLastTag() {
  try {
    const lastTag = execSync('git describe --tags --abbrev=0').toString().trim();
    return execSync(`git log ${lastTag}..HEAD --pretty=format:%s`).toString().trim().split('\n');
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
  return 'patch';  
}

function generateChangesetContent(packageName, bumpType, summary) {
  return `---
"${packageName}": ${bumpType}
---

${summary}
`;
}

function sanitizeCommitMessage(message) { 
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

const packages = fs.readdirSync(path.join(__dirname, '..', 'packages'));
packages.forEach(packageName => {
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