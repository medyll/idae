const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const crypto = require("crypto");

const rootRepo = "medyll/idae";
const commitTypes = [
  "feat",
  "fix",
  "docs",
  "style",
  "refactor",
  "perf",
  "test",
  "chore",
  "ci",
];
const commitDepth = "all";

class ChangesetGenerator {
  constructor(options = {}) {
    this.rootRepo = options.rootRepo || rootRepo;
    this.commitTypes = options.commitTypes || commitTypes;
    this.commitDepth = options.commitDepth || commitDepth;
    this.packagesDir = path.join(__dirname, "..", "packages");
  }

  getCommitsSinceLastTag() {
    try {
      const lastTag = execSync("git describe --tags --abbrev=0")
        .toString()
        .trim();
      console.log("Last tag:", lastTag);

      let logCommand = `git log ${lastTag}..HEAD --pretty=format:%H£%s£%b`;
      if (this.commitDepth !== "all") {
        logCommand = `git log -n ${this.commitDepth} --pretty=format:%H£%s£%b`;
      }

      const commits = execSync(logCommand).toString().trim().split("\n");

      const formattedCommits = commits.map((commit) => {
        const [hash, subject, body] = commit.split("£");
        const fullMessage = body ? `${subject}\n\n${body}` : subject;
        return `${hash}£${fullMessage}`; // Utiliser '£' comme séparateur
      });

      console.log("Commits retrieved:", formattedCommits);
      return formattedCommits;
    } catch (error) {
      console.error("Error retrieving commits:", error);
      return [];
    }
  }

  getBumpType(commitMessage) {
    if (commitMessage.toLowerCase().includes("breaking change")) return "major";
    for (const type of this.commitTypes) {
      if (commitMessage.startsWith(type)) {
        return type === "feat" ? "minor" : "patch";
      }
    }
    return null;
  }

  sanitizeCommitMessage(message) {
    const [type, ...rest] = message.split(":");
    if (this.commitTypes.includes(type.trim().toLowerCase())) {
      const scopeMatch = rest
        .join(":")
        .trim()
        .match(/^\((.*?)\)/);
      if (scopeMatch) {
        return `${type.trim()}: (${scopeMatch[1]})${rest
          .join(":")
          .replace(/^\((.*?)\)/, "")
          .trim()}`;
      }

      const scope = rest.join(":").trim().split(" ")[0];
      const remainingMessage = rest.join(":").trim().replace(scope, "").trim();
      return `${type.trim()}(${scope}): ${remainingMessage}`;
    }
    return message.trim();
  }

  generateChangesetContent(packageName, bumpType, commits) {
    const summary = commits
      .map((commit) => {
        const [hash, message] = commit.split("£", 2);
        const sanitizedMessage = this.sanitizeCommitMessage(message);

        const displayMessage = sanitizedMessage.includes("\n")
          ? sanitizedMessage.split("\n")[0]
          : sanitizedMessage;
        return `- ${displayMessage} ([${hash.slice(0, 7)}](https://github.com/${this.rootRepo}/commit/${hash}))`;
      })
      .join("\n");

    return `---
"${packageName}": ${bumpType}
---

${summary}
`;
  }

  generateChangesets() {
    const commits = this.getCommitsSinceLastTag();
    const packages = fs.readdirSync(this.packagesDir);

    packages.forEach((packageName) => {
      const packagePath = path.join(this.packagesDir, packageName);
      const packageJsonPath = path.join(packagePath, "package.json");

      console.log(`Processing package: ${packageName}`);

      if (!fs.existsSync(packageJsonPath)) {
        console.error(
          `Package ${packageName} does not have a package.json file`
        );
        return;
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      const fullPackageName = packageJson.name;

      const packageCommits = commits.filter((commit) =>
        commit.toLowerCase().includes(packageName.toLowerCase())
      );

      console.log(`Commits for ${packageName}:`, packageCommits);

      if (packageCommits.length > 0) {
        const bumpTypes = packageCommits
          .map((commit) => this.getBumpType(commit.split("£", 2)[1]))
          .filter((type) => type !== null);

        if (bumpTypes.length === 0) {
          console.log(`No relevant commits found for ${packageName}`);
          return;
        }

        const highestBumpType = bumpTypes.includes("major")
          ? "major"
          : bumpTypes.includes("minor")
            ? "minor"
            : "patch";

        const relevantCommits = packageCommits.filter(
          (commit) => this.getBumpType(commit.split("£", 2)[1]) !== null
        );

        const changesetContent = this.generateChangesetContent(
          fullPackageName,
          highestBumpType,
          relevantCommits
        );

        const changesetDir = path.join(__dirname, "..", ".changeset");
        if (!fs.existsSync(changesetDir)) {
          fs.mkdirSync(changesetDir);
        }

        const contentHash = crypto
          .createHash("md5")
          .update(changesetContent)
          .digest("hex")
          .slice(0, 8);
        const changesetFile = path.join(
          changesetDir,
          `${packageName}-${contentHash}.md`
        );

        if (!fs.existsSync(changesetFile)) {
          fs.writeFileSync(changesetFile, changesetContent);
          console.log(`Changeset generated for ${packageName}`);
          console.log(`Changeset content:\n${changesetContent}`);
        } else {
          console.log(`Changeset for ${packageName} already exists, skipping.`);
        }
      } else {
        console.log(`No commits found for ${packageName}`);
      }
    });

    console.log("Changeset generation completed");
  }
}
 
const generator = new ChangesetGenerator({
  rootRepo: "medyll/idae",
  commitTypes: ["feat", "fix", "docs", "refactor", "docs", "ci"],
  commitDepth: "all",
});

generator.generateChangesets();
