
import fs from 'fs';
import path from 'path';
import * as sass from 'sass'
// Chemin du répertoire source et du répertoire cible
const sourceDir = './src/lib';
const targetDir = './src/lib/_css';
const combinedCSSFile = path.join(targetDir, 'slotui-combined.css');

// Assurez-vous que le répertoire cible existe
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Fonction pour parcourir récursivement les répertoires
function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

// Fonction pour convertir SCSS en CSS
function convertScssToCss(filePath) {
    const result = sass.renderSync({ file: filePath });
    return result.css.toString();
}

// Créer un flux d'écriture pour le fichier CSS combiné
const combinedCSSStream = fs.createWriteStream(combinedCSSFile);

// Parcourir le répertoire source
walkDir(sourceDir, function(filePath) {
    if (path.extname(filePath) === '.scss') {
        const cssContent = convertScssToCss(filePath);
        const fileName = path.basename(filePath);
        const targetFilePath = path.join(targetDir, path.basename(filePath, '.scss') + '.css');
        
        // Enregistrer chaque fichier CSS individuellement
        fs.writeFileSync(targetFilePath, cssContent);
        
        // Ajouter le contenu au fichier CSS combiné
        combinedCSSStream.write('/** '+ fileName + ' -----*/ \n' +cssContent + '\n');
    }
});

combinedCSSStream.end();

console.log('Conversion ended.');
