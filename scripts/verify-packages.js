const fs = require("fs");
const path = require("path");

const packagesDir = path.join(__dirname, "..", "packages");
const packages = fs.readdirSync(packagesDir);

packages.forEach((packageName) => {
  const packagePath = path.join(packagesDir, packageName);
  const packageJsonPath = path.join(packagePath, "package.json");

  console.log(`Processing package: ${packageName}`);
  console.log(`Package.json path: ${packageJsonPath}`);

  if (!fs.existsSync(packageJsonPath)) {
    console.error(`Le package ${packageName} n'a pas de fichier package.json`);
    return;
  }

  let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  let modified = false;

  if (!packageJson.name || !packageJson.version) {
    console.log(
      `Package.json content for ${packageName}:`,
      JSON.stringify(packageJson, null, 2)
    );
    console.error(
      `Le package ${packageName} a un fichier package.json mal formé`
    );
    return;
  }

  // Fix scope path for module name
  if (!packageJson.name.startsWith("@medyll/")) {
    packageJson.name = `@medyll/${packageJson.name}`;
    modified = true;
    console.log(`Fixed scope path for ${packageName}`);
  }

  // Add scope if not exists
  if (!packageJson.scope) {
    packageJson.scope = "@medyll";
    modified = true;
    console.log(`Added scope field to package ${packageName}`);
  }

  // "release": "node scripts/release.js", create file if not exists
  if (!packageJson?.scripts?.release) {
    if (!fs.existsSync(path.join(packagePath, "scripts", "release.js"))) {
      fs.mkdirSync(path.join(packagePath, "scripts"), { recursive: true });
      fs.writeFileSync(
        path.join(packagePath, "scripts", "release.js"),
        `// Created scripts/release.js for ${packageName}\r\n
import { MakeLibIndex } from '../../shared/makeLibIndexRoot.js';

new MakeLibIndex().makeIndexFile();`
      );
      console.log(`Created scripts/release.js for ${packageName}`);
    }
    packageJson.scripts.release = "node scripts/release.js";
    modified = true;
    console.log(`Added  release field to package ${packageName}`);
  }

  if (modified) {
    // add definition in package.json
    const packageJsonString = JSON.stringify(packageJson, null, 2);
    fs.writeFileSync(packageJsonPath, packageJsonString.replace(/\n$/, ""));
    console.log(`Le fichier package.json de ${packageName} a été mis à jour`);
  } else {
    console.log(`Le package ${packageName} est correctement configuré`);
  }
});

console.log("All packages are correctly configured.");
