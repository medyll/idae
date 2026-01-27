const fs = require("fs");
const path = require("path");

function patchPackageJson(file) {
  const content = fs.readFileSync(file, "utf8");
  if (!content.includes("workspace:*")) return;
  const patched = content.replace(/"workspace:\*"/g, '"latest"');
  fs.writeFileSync(file, patched, "utf8");
  console.log(`Patched: ${file}`);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === "package.json") patchPackageJson(full);
  }
}

// Patch all package.json files in the repo
walk(process.cwd());
