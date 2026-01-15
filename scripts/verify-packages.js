const fs = require("fs");
const path = require("path");

const packagesDir = path.join(__dirname, "..", "packages");
const packages = fs.readdirSync(packagesDir);

const packagePre = "package:pre";
const packagePreFile = "package-pre.js";
const packagePreContent = `// Created scripts/${packagePreFile}\r\n
import { MakeLibIndex } from '../../shared/scripts/indexIfy.js';
new MakeLibIndex().makeIndexFile();`;

console.log("Packages verification started");

packages.forEach((packageName) => {
  const packagePath = path.join(packagesDir, packageName);
  const packageJsonPath = path.join(packagePath, "package.json");
  const packageScriptsPath = path.join(packagePath, "scripts");

  if (!fs.existsSync(packageJsonPath)) {
    console.error(`Le package ${packageName} n'a pas de fichier package.json`);
    return;
  }

  let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  let modified = false;

  if (!packageJson.name || !packageJson.version) {
    console.log(
      `Package.json content for ${packageName}:`,
      JSON.stringify(packageJson, null, 2),
    );
    console.error(
      `Le package ${packageName} a un fichier package.json mal formé`,
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

  // Force all @medyll/* dependencies to "workspace:*"
  const depFields = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
  for (const field of depFields) {
    if (!packageJson[field]) continue;
    for (const dep in packageJson[field]) {
      if (
        dep.startsWith("@medyll/") &&
        packageJson[field][dep] !== "workspace:*" &&
        !packageJson[field][dep].includes("file:") &&
        !packageJson[field][dep].includes("cssfabric") 
      ) {
        packageJson[field][dep] = "workspace:*";
        modified = true;
        console.log(`Set ${field} -> ${dep} to workspace:* in ${packageName}`);
      }
    }
  }

  // "package:pre"
  if (!packageJson?.scripts?.[packagePre]) {
    if (!fs.existsSync(path.join(packageScriptsPath, packagePreFile))) {
      fs.mkdirSync(packageScriptsPath, { recursive: true });
      fs.writeFileSync(
        path.join(packageScriptsPath, packagePreFile),
        packagePreContent,
      );
      console.log(`Created scripts/package-pre.js for ${packageName}`);
    }
    packageJson.scripts[packagePre] = `node scripts/${packagePreFile}`;
    modified = true;
    console.log(`Added ${packagePre} field to package ${packageName}`);
  }

  if (modified) {
    // add definition in package.json
    const packageJsonString = JSON.stringify(packageJson, null, 2) + "\n";
    fs.writeFileSync(packageJsonPath, packageJsonString);
    console.log(`Processed package: ${packageName}`);
    console.log(`Package.json path: ${packageJsonPath}`);
  }
});

console.log("Packages verification completed");
