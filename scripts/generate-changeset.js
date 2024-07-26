const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const crypto = require("crypto");
require("dotenv").config();

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

  async initOctokit() {
    const { Octokit } = await import("@octokit/rest");
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }

  async checkRateLimit() {
    const { data: rateLimit } = await this.octokit.rest.rateLimit.get();
    console.log("Rate limit:", rateLimit.rate);
    if (rateLimit.remaining < 10) {
      console.log("Rate limit almost exceeded, waiting...");
      const resetTime = new Date(rateLimit.reset * 1000);
      const waitTime = resetTime.getTime() - Date.now() + 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  async getCommitsForPackage(packageName, packagePath, since) {
    const command = `git log --name-only --pretty=format:"%H£%s£%b£%an£%aI" ${since}..HEAD -- ${packagePath}`;

    try {
      const output = execSync(command, { encoding: "utf-8" });
      const commits = output.split("\n\n").map((commit) => {
        const [hash, subject, body, author, date, ...files] = commit.split("£");
        return {
          sha: hash,
          message: subject,
          description: body,
          author,
          date,
          files: files.filter(Boolean),
        };
      });
      return commits;
    } catch (error) {
      console.error(`Error getting commits for package ${packageName}:`, error);
      return [];
    }
  }

  async getPullRequestForCommit(commit) {
    try {
      const [owner, repo] = this.rootRepo.split("/");
      const { data: pullRequests } =
        await this.octokit.repos.listPullRequestsAssociatedWithCommit({
          owner,
          repo,
          commit_sha: commit.sha,
        });

      if (pullRequests.length > 0) {
        return pullRequests[0];
      }
    } catch (error) {
      console.error(`Error fetching PR for commit ${commit.sha}:`, error);
    }
    return null;
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
        const sanitizedMessage = this.sanitizeCommitMessage(
          commit.message.split("\n")[0]
        );

        // Extraire la partie date de la chaîne ISO 8601
        const date = commit.date.split("T")[0]; // Format date as YYYY-MM-DD

        let commitContent = `- ${sanitizedMessage} ([${commit.sha.slice(0, 7)}](https://github.com/${this.rootRepo}/commit/${commit.sha}))`;
        if (commit.pr) {
          commitContent += ` ([#${commit.pr.number}](${commit.pr.url}))`;
        }
        commitContent += ` - ${date} by ${commit.author}`;

        if (commit.description) {
          commitContent += `\n  ${commit.description.replace(/\n/g, "\n  ")}`;
        }
        return commitContent;
      })
      .join("\n\n");

    return `---
"${packageName}": ${bumpType}
---

${summary}
`;
  }

  async generateChangesets() {
    const lastTag = execSync("git describe --tags --abbrev=0")
      .toString()
      .trim();
    const packages = fs.readdirSync(this.packagesDir);

    for (const packageDir of packages) {
      const packagePath = path.join(this.packagesDir, packageDir);
      const packageJsonPath = path.join(packagePath, "package.json");

      if (!fs.existsSync(packageJsonPath)) {
        console.error(
          `Package ${packageDir} does not have a package.json file`
        );
        continue;
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      const packageName = packageJson.name;

      console.log(`Processing package: ${packageName}`);

      const packageCommits = await this.getCommitsForPackage(
        packageName,
        packagePath,
        lastTag
      );

      console.log(`Commits for ${packageName}:`, packageCommits.length);

      if (packageCommits.length > 0) {
        const bumpTypes = packageCommits
          .map((commit) => this.getBumpType(commit.message.split("\n")[0]))
          .filter((type) => type !== null);

        if (bumpTypes.length === 0) {
          console.log(`No relevant commits found for ${packageName}`);
          continue;
        }

        const highestBumpType = bumpTypes.includes("major")
          ? "major"
          : bumpTypes.includes("minor")
            ? "minor"
            : "patch";

        const relevantCommits = packageCommits.filter(
          (commit) => this.getBumpType(commit.message.split("\n")[0]) !== null
        );

        const changesetContent = this.generateChangesetContent(
          packageName,
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
          `${packageName.replace("/", "-")}-${contentHash}.md`
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
    }

    console.log("Changeset generation completed");
  }
}

const generator = new ChangesetGenerator({
  rootRepo: "medyll/idae",
  commitTypes: ["feat", "fix", "docs", "refactor", "docs", "ci"],
  commitDepth: "all",
});

generator.generateChangesets();
