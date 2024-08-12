import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin relatif depuis la racine de idae-slotui
const root = 'src';

async function renameScssFiles(dir) {
	try {
		const files = await fs.readdir(dir);

		for (const file of files) {
			const filePath = path.join(dir, file);
			const stat = await fs.stat(filePath);

			if (stat.isDirectory()) {
				// Appel récursif pour parcourir les sous-répertoires
				await renameScssFiles(filePath);
			} else if (path.extname(file) === '.scss' && /^[A-Z]/.test(file)) {
				const newFileName = file.charAt(0).toLowerCase() + file.slice(1);
				const newFilePath = path.join(dir, newFileName);

				try {
					await fs.rename(filePath, newFilePath);
					console.log(`Renommé: ${filePath} -> ${newFilePath}`);
				} catch (err) {
					console.error(`Erreur lors du renommage de ${filePath}:`, err);
				}
			}
		}
	} catch (err) {
		console.error(`Erreur lors de la lecture du répertoire ${dir}:`, err);
	}
}

// Démarrer le processus de renommage à partir du répertoire racine
const rootDir = path.join(__dirname, '..', root);
console.log(`Démarrage du renommage des fichiers SCSS dans: ${rootDir}`);

renameScssFiles(rootDir)
	.then(() => {
		console.log('Processus de renommage terminé.');
	})
	.catch((err) => {
		console.error('Une erreur est survenue:', err);
	});
