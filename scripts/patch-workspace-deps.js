// scripts/patch-workspace-deps.js
const fs = require("fs");
const path = require("path");

function walk(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const res = path.resolve(dir, file.name);
    if (file.isDirectory() && !res.includes("node_modules")) {
      walk(res);
    } else if (file.name === "package.json") {
      let content = fs.readFileSync(res, "utf8");
      if (content.includes("workspace:")) {
        // Replace workspace:* or workspace:^1.0.0 with *
        //content = content.replace(/"workspace:[^"]*"/g, '"*"');
        //fs.writeFileSync(res, content);
      }
    }
  }
}
walk(process.cwd());
