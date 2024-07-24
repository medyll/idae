const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '..', 'packages');
const packages = fs.readdirSync(packagesDir);

packages.forEach(packageName => {
  const packagePath = path.join(packagesDir, packageName);
  const packageJsonPath = path.join(packagePath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    console.error(`Le package ${packageName} n'a pas de fichier package.json`);
    return;
  }

  let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  let modified = false;

  if (!packageJson.name || !packageJson.version) {
    console.error(`Le package ${packageName} a un fichier package.json mal formé`);
    return;
  }
 
  if (!packageJson.name.startsWith('@medyll/')) {
    packageJson.name = `@medyll/${packageJson.name}`;
    modified = true;
    console.log(`Scope ajouté au package ${packageName}`);
  }
 
  if (!packageJson.scope) {
    packageJson.scope = 'medyll';
    modified = true;
    console.log(`Champ scope ajouté au package ${packageName}`);
  }

  if (modified) { 
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`Le fichier package.json de ${packageName} a été mis à jour`);
  } else {
    console.log(`Le package ${packageName} est correctement configuré`);
  }
});

console.log('Vérification et mise à jour des packages terminées');