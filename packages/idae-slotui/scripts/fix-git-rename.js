import { dirname, basename } from 'path';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const renamedFiles = [
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\base\\box\\box.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\base\\breadCrumb\\breadcrumb.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\base\\cartouche\\cartouche.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\base\\divider\\divider.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\controls\\button\\buttonmenu.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\data\\dataList\\datalist.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\navigation\\drawer\\drawer.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\navigation\\tabs\\tabs.scss'
];

function generateGitCommands(files) {
  let commands = [];

  files.forEach(file => {
    // Convertir le chemin Windows en chemin Unix
    const unixPath = file.replace(/\\/g, '/').replace(/^D:\/boulot\/idae\//, '');
    
    // Extraire le nom du fichier et le chemin du dossier
    const dirPath = dirname(unixPath);
    const fileName = basename(unixPath);
    
    // Générer le nom du fichier en majuscules (l'ancien nom)
    const upperFileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
    
    // Générer un nom de fichier temporaire unique
    const tempFileName = `${fileName.replace('.scss', '')}_temp.scss`;
    
    // Commandes pour renommer le fichier
    commands.push(`git mv ${dirPath}/${upperFileName} ${dirPath}/${tempFileName}`);
    commands.push(`git mv ${dirPath}/${tempFileName} ${dirPath}/${fileName}`);
  });

  // Ajouter les commandes pour commiter et pousser les changements
  commands.push('git commit -m "Fix case sensitivity for SCSS files"');
  commands.push('git push origin $(git rev-parse --abbrev-ref HEAD)');

  return commands.join('\n');
}

const gitCommands = generateGitCommands(renamedFiles);
console.log(gitCommands);

// Écrire les commandes dans un fichier
await writeFile('rename_commands.sh', gitCommands);
console.log('Les commandes ont été écrites dans rename_commands.sh');