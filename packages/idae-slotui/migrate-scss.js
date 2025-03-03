import { exec } from 'child_process';
import { resolve } from 'path';
import { glob } from 'glob';

const scssPattern = './src/lib/**/*.scss';

async function migrateScssFiles() {
  try {
    const files = await new Promise((resolve, reject) => {
      glob(scssPattern, {
        cwd: process.cwd(),
        nodir: true,
        absolute: true,
      }).then(resolve).catch(reject); 
    });

    console.log(files)

    for (const file of files) {
      const command = `sass-migrator module --migrate-deps ${file}`;
      exec(command, { cwd: resolve() }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Erreur lors de l'exécution de la commande pour ${file}: ${error.message}`);
          return;
        }

        if (stderr) {
          console.error(`Erreur pour ${file}: ${stderr}`);
          return;
        }

        console.log(`Résultat pour ${file}: ${stdout}`);
      });
    }
  } catch (error) {
    console.error(`Erreur lors de la recherche des fichiers SCSS: ${error.message}`);
  }
}

migrateScssFiles();