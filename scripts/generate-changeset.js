const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const crypto = require("crypto");
require('dotenv').config();

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
    console.log("Actual rate-limit :", rateLimit.rate);
    return rateLimit.rate;
  }

  async getCommitsSinceLastTag() {
    try {
      await this.initOctokit();
      await this.checkRateLimit();
      const lastTag = execSync("git describe --tags --abbrev=0")
        .toString()
        .trim();
      console.log("Last tag:", lastTag);

      const [owner, repo] = this.rootRepo.split("/");
      let allCommits = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const { data: commits } = await this.octokit.repos.listCommits({
          owner,
          repo,
          since: lastTag,
          per_page: 100,
          page,
        });

        const formattedCommits = await Promise.all(
          commits.map(async (commit) => {
            const pr = await this.getPullRequestForCommit({ sha: commit.sha });
            return {
              sha: commit.sha,
              message: commit.commit.message,
              description: commit.commit.message.split("\n\n")[1] || "",
              date: commit.commit.author.date,
              author: commit.commit.author.name,
              pr: pr ? { number: pr.number, url: pr.html_url } : null,
            };
          })
        );

        allCommits.push(...formattedCommits);

        if (commits.length < 100) {
          hasMore = false;
        } else {
          page++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      console.log("Commits retrieved:", allCommits.length);
      return allCommits;
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

  generateChangesetContent(packageName, bumpType, commits) {
    const summary = commits
      .map((commit) => {
        const sanitizedMessage = this.sanitizeCommitMessage(
          commit.message.split("\n")[0]
        );
        const date = new Date(commit.date).toISOString().split("T")[0]; // Format date as YYYY-MM-DD

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
    const commits = await this.getCommitsSinceLastTag();
    const packages = fs.readdirSync(this.packagesDir);

    for (const packageName of packages) {
      const packagePath = path.join(this.packagesDir, packageName);
      const packageJsonPath = path.join(packagePath, "package.json");

      console.log(`Processing package: ${packageName}`);

      if (!fs.existsSync(packageJsonPath)) {
        console.error(
          `Package ${packageName} does not have a package.json file`
        );
        continue;
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      const fullPackageName = packageJson.name;

      const packageCommits = commits.filter((commit) =>
        commit.message.toLowerCase().includes(packageName.toLowerCase())
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
