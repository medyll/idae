// scripts\generate-changeset.js

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const crypto = require("crypto");
require("dotenv").config();

/**
 * The root GitHub repository in the format <owner>/<repo>.
 * @type {string}
 */
const rootRepo = "medyll/idae";

/**
 * The list of commit types to consider for changelog generation.
 * @type {string[]}
 */
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

/**
 * The default commit depth: 'all', 'auto', or a number.
 * @type {string|number}
 */
const commitDepth = "all";

/**
 * ChangesetGenerator automates the creation of changeset files for a monorepo.
 */
class ChangesetGenerator {
  /**
   * @param {Object} options - Configuration options for the generator.
   * @param {string} [options.rootRepo] - The GitHub repository (owner/repo).
   * @param {string[]} [options.commitTypes] - The commit types to consider.
   * @param {string|number} [options.commitDepth] - 'all', 'auto', or a number for commit depth.
   * @param {boolean} [options.packageStrict] - If true, only include commits with messages starting with type(packageName):
   */
  constructor(options = {}) {
    /**
     * The GitHub repository (owner/repo).
     * @type {string}
     */
    this.rootRepo = options.rootRepo || rootRepo;
    /**
     * The commit types to consider for changelog entries.
     * @type {string[]}
     */
    this.commitTypes = options.commitTypes || commitTypes;
    /**
     * The commit depth: 'all', 'auto', or a number.
     * @type {string|number}
     */
    this.commitDepth = options.commitDepth || commitDepth;
    /**
     * The path to the packages directory in the monorepo.
     * @type {string}
     */
    this.packagesDir = path.join(__dirname, "..", "packages");
    /**
     * If true, only include commits with messages starting with type(packageName):
     * @type {boolean}
     */
    this.packageStrict = options.packageStrict ?? false;
  }

  /**
   * Initializes the Octokit GitHub API client.
   * @returns {Promise<void>}
   */
  async initOctokit() {
    // Initialize Octokit for GitHub API interactions
    const { Octokit } = await import("@octokit/rest");
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }

  /**
   * Checks the GitHub API rate limit and waits if necessary.
   * @returns {Promise<void>}
   */
  async checkRateLimit() {
    // Check GitHub API rate limit and wait if necessary
    const { data: rateLimit } = await this.octokit.rest.rateLimit.get();
    console.log("Rate limit:", rateLimit.rate);
    if (rateLimit.remaining < 10) {
      console.log("Rate limit almost exceeded, waiting...");
      const resetTime = new Date(rateLimit.reset * 1000);
      const waitTime = resetTime.getTime() - Date.now() + 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  /**
   * Reads the date of the latest changelog entry from the package's CHANGELOG.md.
   * @param {string} packagePath - The absolute path to the package directory.
   * @returns {Promise<string|null>} The date as 'YYYY-MM-DD' or null if not found.
   */
  async getLastChangelogDate(packagePath) {
    // Cherche la date du dernier changelog dans le fichier CHANGELOG.md du package
    const changelogPath = path.join(packagePath, "CHANGELOG.md");
    if (!fs.existsSync(changelogPath)) return null;
    const content = fs.readFileSync(changelogPath, "utf-8");
    // Cherche la première date au format YYYY-MM-DD dans le changelog
    const dateMatch = content.match(/\((\d{4}-\d{2}-\d{2})/);
    if (dateMatch) return dateMatch[1];
    return null;
  }

  /**
   * Gets the list of commits for a package since the last tag, filtered by commitDepth.
   * @param {string} packageName - The name of the package.
   * @param {string} packagePath - The absolute path to the package directory.
   * @param {string} since - The git tag or commit to start from.
   * @param {string|null} [lastChangelogDate] - The date of the last changelog entry (for 'auto' mode).
   * @returns {Promise<Object[]>} The list of commit objects.
   */
  async getCommitsForPackage(packageName, packagePath, since, lastChangelogDate = null) {
    // Get commits for a specific package since the last tag
    let depthArg = "";
    if (this.commitDepth !== "all" && this.commitDepth !== "auto" && Number.isInteger(this.commitDepth)) {
      depthArg = `-n ${this.commitDepth}`;
    }
    const command = `git log ${depthArg} --name-only --pretty=format:"%H£%s£%b£%an£%aI" ${since}..HEAD -- ${packagePath}`;

    try {
      const output = execSync(command, { encoding: "utf-8" });
      let commits = output.split("\n\n").map((commit) => {
        const [hash, subject, body, author, date, ...files] = commit.split("£");
        const validFiles = files.filter((file) => file.startsWith(packagePath));
        return {
          sha: hash,
          message: subject,
          description: body,
          author,
          date,
          files: validFiles.filter(Boolean),
        };
      });
      // Si commitDepth est 'auto', on arrête dès qu'on trouve un commit plus vieux que le dernier changelog
      if (this.commitDepth === "auto" && lastChangelogDate) {
        commits = commits.filter(c => c.date && c.date.split("T")[0] > lastChangelogDate);
      }
      return commits;
    } catch (error) {
      console.error(`Error getting commits for package ${packageName}:`, error);
      return [];
    }
  }

  /**
   * Gets the pull request associated with a specific commit, if any.
   * @param {Object} commit - The commit object.
   * @returns {Promise<Object|null>} The pull request object or null.
   */
  async getPullRequestForCommit(commit) {
    // Get the pull request associated with a specific commit
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

  /**
   * Determines the bump type (major, minor, patch) based on the commit message.
   * @param {string} commitMessage - The commit message.
   * @returns {string|null} The bump type or null if not relevant.
   */
  getBumpType(commitMessage) {
    // Determine the bump type (major, minor, patch) based on the commit message
    if (commitMessage.toLowerCase().includes("breaking change")) return "major";
    for (const type of this.commitTypes) {
      if (commitMessage.startsWith(type)) {
        return type === "feat" ? "minor" : "patch";
      }
    }
    return null;
  }

  /**
   * Sanitizes a commit message to a consistent format for changelogs.
   * @param {string} message - The commit message.
   * @returns {string} The sanitized message.
   */
  sanitizeCommitMessage(message) {
    // Sanitize the commit message to follow a consistent format
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

  /**
   * Generates the content for a changeset file for a package.
   * @param {string} packageName - The name of the package.
   * @param {string} bumpType - The bump type ('major', 'minor', 'patch').
   * @param {Object[]} commits - The list of commit objects.
   * @returns {string} The changeset file content.
   */
  generateChangesetContent(packageName, bumpType, commits) {
    // Generate the content for the changeset file
    const summary = commits
      .map((commit) => {
        const sanitizedMessage = this.sanitizeCommitMessage(
          commit.message.split("\n")[0],
        );

        const date = commit.date.split("T")[0]; // Format date as YYYY-MM-DD

        let commitContent = `- ${sanitizedMessage} ([${commit.sha.slice(0, 7)}](https://github.com/${this.rootRepo}/commit/${commit.sha}))`;
        if (commit.pr) {
          commitContent += ` ([#${commit.pr.number}](${commit.pr.url}))`;
        }
        commitContent += ` - ${date} by @${commit.author}`;

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

  /**
   * Checks if a commit message matches the strict format for the package.
   * @param {string} message - The commit message.
   * @param {string} packageName - The package name (directory).
   * @returns {boolean}
   */
  isCommitForPackage(message, packageName) {
    // Accepts: type(packageName): ... or ci(packageName): ...
    const types = ["ci", "feat", ...this.commitTypes];
    const regex = new RegExp(`^(${types.join("|")})\\(${packageName}\\):`, "i");
    return regex.test(message);
  }

  /**
   * Main entry: generates changesets for all packages in the monorepo.
   * @returns {Promise<void>}
   */
  async generateChangesets() {
    // Generate changesets for all packages
    const lastTag = execSync("git describe --tags --abbrev=0")
      .toString()
      .trim();
    const packages = fs.readdirSync(this.packagesDir);

    for (const packageDir of packages) {
      const packagePath = path.join(this.packagesDir, packageDir);
      const packageJsonPath = path.join(packagePath, "package.json");

      if (!fs.existsSync(packageJsonPath)) {
        console.error(
          `Package ${packageDir} does not have a package.json file`,
        );
        continue;
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      const packageName = packageJson.name;

      console.log(`Processing package: ${packageName}`);

      let lastChangelogDate = null;
      if (this.commitDepth === "auto") {
        lastChangelogDate = await this.getLastChangelogDate(packagePath);
        if (lastChangelogDate) {
          console.log(`Last changelog date for ${packageName}: ${lastChangelogDate}`);
        }
      }

      const packageCommits = await this.getCommitsForPackage(
        packageName,
        packagePath,
        lastTag,
        lastChangelogDate
      );

      // Filter commits by strict mode if enabled
      let filteredCommits = packageCommits;
      if (this.packageStrict) {
        filteredCommits = packageCommits.filter(commit =>
          commit && typeof commit.message === 'string' && this.isCommitForPackage(commit.message, packageDir)
        );
      } else {
        filteredCommits = packageCommits.filter(commit => commit && typeof commit.message === 'string');
      }

      console.log(`Commits for ${packageName}:`, filteredCommits.length );

      if (filteredCommits.length > 0) {
        const bumpTypes = filteredCommits
          .filter(commit => commit && typeof commit.message === 'string')
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

        const relevantCommits = filteredCommits.filter(
          (commit) => commit && typeof commit.message === 'string' && this.getBumpType(commit.message.split("\n")[0]) !== null,
        );

        const changesetContent = this.generateChangesetContent(
          packageName,
          highestBumpType,
          relevantCommits,
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
          `${packageDir}-${contentHash}.md`,
        );

        if (!fs.existsSync(changesetFile)) {
          fs.writeFileSync(changesetFile, changesetContent);
          console.log(`Changeset generated for ${packageName}`);
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

/**
 * Initialize and run the changeset generator with the desired options.
 */
const generator = new ChangesetGenerator({
  rootRepo: rootRepo,
  commitTypes: ["feat", "fix", ], // "docs", "refactor", "docs", "ci"
  commitDepth: "auto",
  packageStrict: false
});

generator.generateChangesets();
