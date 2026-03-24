#!/usr/bin/env node

import {
  readFileSync,
  writeFileSync,
  existsSync,
  rmSync,
  mkdirSync,
  readdirSync,
} from "fs";
import { execSync } from "child_process";
import path from "path";
import { Octokit } from "@octokit/rest";
import yaml from "js-yaml";
import { globSync } from "glob";
import { Command } from "commander";

const program = new Command();

program
  .name("@medyll/monorepo-vitrine")
  .description(
    "Sync pnpm monorepo packages to individual GitHub showcase repositories",
  )
  .version("1.1.0")
  .option("-d, --dry-run", "simulate changes without pushing to GitHub")
  .option("-p, --allow-private", "include packages marked as private", false)
  .option(
    "-c, --cleanup",
    "delete showcase repos that no longer exist in the monorepo",
    false,
  )
  .option("-v, --verbose", "display detailed execution logs", false)
  .option(
    "-s, --suffix [value]",
    'append suffix to repo name; if passed without value uses "showcase"',
  )
  .parse(process.argv);

const options = program.opts();

// Normalize option names: commander returns camelCase, script expects snake_case
options.dry_run = options.dry_run ?? options.dryRun ?? false;
options.allow_private = options.allow_private ?? options.allowPrivate ?? false;
options.cleanup = options.cleanup ?? options.clean ?? options.cleanUp ?? false;
options.verbose = options.verbose ?? options.verbose ?? false;

// Normalize suffix: commander returns true when flag present without value
let suffixOption;
if (Object.prototype.hasOwnProperty.call(options, "suffix")) {
  if (options.suffix === true) suffixOption = "showcase";
  else if (typeof options.suffix === "string" && options.suffix.length > 0)
    suffixOption = options.suffix;
  else suffixOption = null; // explicit --suffix "" treated as no suffix
} else {
  suffixOption = undefined; // not provided
}

/**
 * CONFIGURATION
 */
const AUTH_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = "medyll";
const MONOREPO_NAME = "idae";
const MONOREPO_URL = `https://github.com/${OWNER}/${MONOREPO_NAME}`;
const TEMP_BASE_DIR = path.resolve("./.temp_showcase");

const EXTRA_FILES_TO_SYNC = [
  "CHANGELOG.md",
  "LICENSE",
  "SECURITY.md",
  "CONTRIBUTING.md",
];

const octokit = new Octokit({ auth: AUTH_TOKEN });

function logVerbose(...args) {
  if (options.verbose) console.log(...args);
}

function getErrorMessage(err) {
  if (!err) return String(err);
  if (err.response && err.response.data && err.response.data.message)
    return err.response.data.message;
  if (err.message) return err.message;
  return String(err);
}

function logError(err, context) {
  const msg = getErrorMessage(err);
  const status = err && (err.status || (err.response && err.response.status));
  if (options.verbose) {
    if (context) console.error(`❌ ${context}`);
    console.error(err && err.stack ? err.stack : err);
  } else {
    if (context) {
      console.error(
        `❌ ${context}${status ? ` (status ${status})` : ""}: ${msg}`,
      );
    } else {
      console.error(`❌ ${msg}`);
    }
  }
}

if (options.dry_run) {
  console.log("🧪 DRY-RUN MODE ENABLED: No changes will be pushed to GitHub.");
}

/**
 * Detect workspace patterns from pnpm, yarn or npm.
 * - pnpm: reads pnpm-workspace.yaml
 * - yarn/npm: reads "workspaces" field in package.json
 * Returns { manager, patterns } or null if nothing found.
 */
function detectWorkspace() {
  // pnpm
  if (existsSync("pnpm-workspace.yaml")) {
    const config = yaml.load(readFileSync("pnpm-workspace.yaml", "utf8"));
    return { manager: "pnpm", patterns: config.packages || [] };
  }

  // yarn / npm (both use "workspaces" in package.json)
  if (existsSync("package.json")) {
    const rootPkg = JSON.parse(readFileSync("package.json", "utf8"));
    const workspaces = rootPkg.workspaces;
    if (workspaces) {
      // workspaces can be an array or an object with a "packages" key (yarn classic)
      const patterns = Array.isArray(workspaces)
        ? workspaces
        : workspaces.packages || [];
      const manager = existsSync("yarn.lock") ? "yarn" : "npm";
      return { manager, patterns };
    }
  }

  return null;
}

async function syncVitrines() {
  const workspace = detectWorkspace();
  if (!workspace) {
    console.error(
      "❌ No workspace configuration found. Expected pnpm-workspace.yaml or a \"workspaces\" field in package.json.",
    );
    return;
  }

  const { manager, patterns } = workspace;
  logVerbose(`Detected ${manager} workspace with patterns:`, patterns);

  const packagePaths = patterns
    .flatMap((pattern) =>
      globSync(pattern, { absolute: true, onlyDirectories: true }),
    )
    .filter((pkgPath) => existsSync(path.join(pkgPath, "package.json")));

  logVerbose("Discovered package paths:", packagePaths);

  const activeShowcaseRepos = [];

  let errors = 0;

  for (const pkgPath of packagePaths) {
    let pkgJson;
    try {
      pkgJson = JSON.parse(
        readFileSync(path.join(pkgPath, "package.json"), "utf8"),
      );
    } catch (e) {
      logError(e, `Failed to read package.json in ${pkgPath}`);
      errors++;
      continue;
    }

    // Derive a stable base name from the package name (use part after scope if present)
    const baseName = pkgJson.name
      ? pkgJson.name.includes("/")
        ? pkgJson.name.split("/").pop()
        : pkgJson.name.replace("@", "")
      : path.basename(pkgPath);
    const rawName = baseName.replace(/\//g, "-");
    // Build base repo name (avoid duplicating monorepo prefix)
    const baseRepo = baseName.startsWith(`${MONOREPO_NAME}-`)
      ? baseName
      : `${MONOREPO_NAME}-${rawName}`;

    // Apply suffix rules:
    // - suffixOption === undefined -> no suffix (use baseRepo)
    // - suffixOption === null -> no suffix (explicit empty)
    // - suffixOption is string -> append `-${suffixOption}`
    const repoName =
      suffixOption === undefined || suffixOption === null
        ? baseRepo
        : `${baseRepo}-${suffixOption}`;
    const readmePath = path.join(pkgPath, "README.md");

    // Filters
    if (pkgJson.private && !options.allow_private) continue;
    if (!existsSync(readmePath)) continue;

    activeShowcaseRepos.push(repoName);
    console.log(`\n--- 🚀 Processing: ${repoName} ---`);
    logVerbose("Package source path:", pkgPath);

    if (options.dry_run) {
      console.log(`[DRY-RUN] Would check/create repo: ${repoName}`);
      const foundFiles = readdirSync(pkgPath).filter((f) =>
        EXTRA_FILES_TO_SYNC.map((e) => e.toLowerCase()).includes(
          f.toLowerCase(),
        ),
      );
      console.log(
        `[DRY-RUN] Would sync: README.md, ${foundFiles.join(", ") || "no extra files"}`,
      );
      continue;
    }

    // 1. Repository Lifecycle
    try {
      logVerbose(`Checking repo existence for: ${repoName}`);
      await octokit.repos.get({ owner: OWNER, repo: repoName });
    } catch (e) {
      if (e && e.status === 404) {
        try {
          console.log(`✨ Creating missing repo: ${repoName}`);
          await octokit.repos.createForAuthenticatedUser({
            name: repoName,
            description: `Showcase for ${pkgJson.name} | Part of ${MONOREPO_NAME} monorepo`,
            homepage: `${MONOREPO_URL}/tree/main/packages/${path.basename(pkgPath)}`,
          });
        } catch (createErr) {
          logError(createErr, `Failed to create repo ${repoName}`);
          errors++;
          continue;
        }
      } else {
        logError(e, `GitHub API Error for ${repoName}`);
        errors++;
        continue;
      }
    }

    // 2. Prepare Temp Directory & Sync Files
    const workDir = path.join(TEMP_BASE_DIR, rawName);
    if (existsSync(workDir)) rmSync(workDir, { recursive: true });
    mkdirSync(workDir, { recursive: true });

    const originalReadme = readFileSync(readmePath, "utf-8");
    const banner = `> [!IMPORTANT]\n> This repository is a **showcase mirror**. Source code: **[${MONOREPO_NAME}](${MONOREPO_URL}/tree/main/packages/${path.basename(pkgPath)})**.\n\n---\n\n`;
    writeFileSync(path.join(workDir, "README.md"), banner + originalReadme);

    const allFiles = readdirSync(pkgPath);
    EXTRA_FILES_TO_SYNC.forEach((fileName) => {
      const found = allFiles.find(
        (f) => f.toLowerCase() === fileName.toLowerCase(),
      );
      if (found) {
        const content = readFileSync(path.join(pkgPath, found), "utf-8");
        writeFileSync(path.join(workDir, fileName), content);
      }
    });

    // 3. Git Push
    try {
      logVerbose("Initialising git in", workDir);
      // Use token-based URL if in CI, otherwise use SSH
      const remoteUrl = process.env.GITHUB_ACTIONS
        ? `https://x-access-token:${AUTH_TOKEN}@github.com/${OWNER}/${repoName}.git`
        : `git@github.com:${OWNER}/${repoName}.git`;

      execSync(`git init`, { cwd: workDir });
      execSync(`git add .`, { cwd: workDir });
      execSync(`git commit -m "update showcase assets"`, { cwd: workDir });
      execSync(`git branch -M main`, { cwd: workDir });
      execSync(`git remote add origin ${remoteUrl}`, { cwd: workDir });
      execSync(`git push -f origin main`, { cwd: workDir });
      console.log(`✅ Push success.`);
    } catch (err) {
      logError(err, `Git Push failed for ${repoName}`);
      errors++;
    }
  }

  // 4. Cleanup Orphans
  if (options.cleanup) {
    console.log(`\n--- 🧹 Checking orphans ---`);
    if (options.dry_run) {
      console.log(
        `[DRY-RUN] Would delete showcase repos NOT in: ${activeShowcaseRepos.join(", ")}`,
      );
    } else {
      try {
        const { data: userRepos } =
          await octokit.repos.listForAuthenticatedUser({ per_page: 100 });
        const showcaseRepos = userRepos.filter(
          (r) => r.name.startsWith("idae-") && r.name.endsWith("-showcase"),
        );
        for (const repo of showcaseRepos) {
          if (!activeShowcaseRepos.includes(repo.name)) {
            console.log(`🗑️ Deleting orphan repo: ${repo.name}...`);
            await octokit.repos.delete({ owner: OWNER, repo: repo.name });
          }
        }
      } catch (e) {
        logError(e, `Cleanup failed.`);
      }
    }
  }

  if (existsSync(TEMP_BASE_DIR)) {
    rmSync(TEMP_BASE_DIR, { recursive: true, force: true });
    logVerbose("Temporary directory cleaned up.");
  }

  if (errors > 0) {
    console.warn(`\n⚠️  Completed with ${errors} error(s). See logs above.`);
  }
}

syncVitrines().catch((e) => {
  logError(e, "Unhandled error");
});
