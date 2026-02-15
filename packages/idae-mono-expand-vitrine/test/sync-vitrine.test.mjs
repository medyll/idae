import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "child_process";
import path from "path";

test("cli runs in dry-run and prints expected markers", () => {
  const pkgRoot = path.resolve();
  // cli entry is `bin/cli.js` (previously named sync-vitrine.js)
  const bin = path.join(pkgRoot, "bin", "cli.js");

  // Run from repository root so the workspace config is found
  const repoRoot = path.resolve(pkgRoot, "..", "..");

  const out = execFileSync(process.execPath, [bin, "--dry-run"], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, GITHUB_TOKEN: "" },
  });

  // Basic sanity checks
  assert.ok(out.includes("DRY-RUN MODE ENABLED"), "should enable dry-run mode");
  assert.ok(
    out.includes("Would check/create repo"),
    "should list repo actions",
  );
});
