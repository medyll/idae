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
  console.log(
    `Package.json content for ${packageName}:`,
    JSON.stringify(packageJson, null, 2),
  );

  let modified = false;

  if (!packageJson.name || !packageJson.version) {
    console.error(
      `Le package ${packageName} a un fichier package.json mal formé`,
    );
    return;
  }

  // Vérifier et ajouter le scope si nécessaire
  if (!packageJson.name.startsWith("@medyll/")) {
    packageJson.name = `@medyll/${packageJson.name}`;
    modified = true;
    console.log(`Scope ajouté au package ${packageName}`);
  }

  // Ajouter le champ scope s'il est absent
  if (!packageJson.scope) {
    packageJson.scope = "medyll";
    modified = true;
    console.log(`Champ scope ajouté au package ${packageName}`);
  }

  if (modified) {
    // Écrire les modifications dans le fichier package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`Le fichier package.json de ${packageName} a été mis à jour`);
  } else {
    console.log(`Le package ${packageName} est correctement configuré`);
  }
});

console.log("Vérification et mise à jour des packages terminées");
