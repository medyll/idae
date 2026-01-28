const fs = require("fs");
const path = require("path");

const SCOPE = "@medyll/"; // Ton scope

function patch(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !["node_modules", ".git"].includes(entry.name)) {
      patch(fullPath);
    } else if (entry.name === "package.json") {
      let content = fs.readFileSync(fullPath, "utf8");
      if (content.includes("workspace:")) {
        // Remplace workspace:* ou workspace:^ par * pour satisfaire NPM/Semantic-release
        const patched = content.replace(/"workspace:[^"]*"/g, '"*"');
        fs.writeFileSync(fullPath, patched);
        console.log(`✅ Patched workspace protocol in: ${fullPath}`);
      }
    }
  }
}

patch(process.cwd());
