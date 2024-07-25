import { exec } from 'child_process';
import path from 'path';

const renamedFiles = [
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\base\\box\\Box.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\base\\breadCrumb\\BreadCrumb.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\base\\cartouche\\Cartouche.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\base\\divider\\Divider.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\controls\\button\\ButtonMenu.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\data\\dataList\\DataList.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\navigation\\drawer\\Drawer.scss',
  'D:\\boulot\\idae\\packages\\idae-slotui\\src\\lib\\navigation\\tabs\\Tabs.scss'
];

function gitMv(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    exec(`git mv -f "${oldPath}" "${newPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur pour ${oldPath}: ${error.message}`);
        reject(error);
      } else {
        console.log(`Renommé avec succès: ${oldPath} -> ${newPath}`);
        resolve();
      }
    });
  });
}

async function renameFiles() {
  for (const file of renamedFiles) {
    const dir = path.dirname(file);
    const oldName = path.basename(file);
    const newName = oldName.charAt(0).toLowerCase() + oldName.slice(1);
    const oldPath = file.replace(/\\/g, '/');
    const newPath = path.join(dir, newName).replace(/\\/g, '/');

    try {
      await gitMv(oldPath, newPath);
    } catch (error) {
      console.error(`Échec du renommage pour ${oldPath}`);
    }
  }
}

renameFiles().then(() => {
  console.log("Processus de renommage terminé.");
}).catch(err => {
  console.error("Une erreur est survenue:", err);
});