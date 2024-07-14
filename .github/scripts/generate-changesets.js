const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function getChangeType(commitType) {
  switch (commitType) {
    case "feat":
      return "minor";
    case "fix":
      return "patch";
    case "BREAKING CHANGE":
      return "major";
    default:
      return null;
  }
}

const output = execSync(
  'git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"%s"',
).toString();
const commits = output.split("\n");

commits.forEach((commit) => {
  const match = commit.match(/^(feat|fix|BREAKING CHANGE)(\(.*\))?:/);
  if (match) {
    const [, type] = match;
    const changeType = getChangeType(type);
    if (changeType) {
      const changeset = {
        type: changeType,
        description: commit,
      };

      const changesetDir = path.join(process.cwd(), ".changeset");
      const changesetFile = path.join(changesetDir, `${Date.now()}.md`);

      fs.writeFileSync(
        changesetFile,
        `---\n"package-name": ${changeType}\n---\n\n${commit}\n`,
      );
    }
  }
});
