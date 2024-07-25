const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, 'packages');
const packages = fs.readdirSync(packagesDir);

packages.forEach(packageName => {
  const packageJsonPath = path.join(packagesDir, packageName, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    let modified = false;

    // Supprimer les dépendances obsolètes
    const obsoleteDeps = ['husky', 'commitlint', 'standard-version']; // Ajoutez d'autres dépendances si nécessaire
    obsoleteDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        delete packageJson.dependencies[dep];
        modified = true;
      }
      if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
        delete packageJson.devDependencies[dep];
        modified = true;
      }
    });

    // Supprimer les scripts obsolètes
    const obsoleteScripts = ['release', 'commit']; // Ajoutez d'autres scripts si nécessaire
    obsoleteScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        delete packageJson.scripts[script];
        modified = true;
      }
    });

    if (modified) {
      // Écrire le package.json mis à jour sans ajouter de saut de ligne à la fin
      const packageJsonString = JSON.stringify(packageJson, null, 2);
      fs.writeFileSync(packageJsonPath, packageJsonString.replace(/\n$/, ''));
      console.log(`Cleaned ${packageName}/package.json`);
    }

    // Supprimer les fichiers de configuration obsolètes
    const obsoleteFiles = ['.releaserc', '.huskyrc', '.commitlintrc']; // Ajoutez d'autres fichiers si nécessaire
    obsoleteFiles.forEach(file => {
      const filePath = path.join(packagesDir, packageName, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Removed ${packageName}/${file}`);
      }
    });
  }
});

console.log('Cleanup completed');