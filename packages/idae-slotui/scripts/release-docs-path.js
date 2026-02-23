import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
// import * as pkg from './package.json';
import ts from "typescript";
import { loadConfigFromFile } from "vite";
import fsx from "fs-extra";
import { sveltekit } from "@sveltejs/kit/vite";

import { VERSION } from "svelte/compiler";
import lib from "sveld";

 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log({ __dirname });

function dotToCamelCase(str) {
  return str.replace(/\.(\w)/g, function (match, letter) {
    return letter.toUpperCase();
  });
}

/**
 * generate the slotuiCatalog.ts file
 */
async function slotUiCatalogB() {
  const svelteFiles = glob.sync("./src/lib/**/*.svelte");
  const excludePatterns = [".preview", ".demo", ".wip", ".js"];

  const indexContent = svelteFiles
    .map((file) => {
      if (excludePatterns.some((pattern) => file.includes(pattern))) return;
      const upDir = path.dirname(file);
      const group = path.basename(upDir);
      const groupPath = path.dirname(upDir).split("\\").slice(-1)[0];
      //const group = file.split('/')[3];
      const compName = file.split("/").slice(-1)[0].split(".")[0];
      const dir = file.split("/").slice(-2, -1);
      const fileName = path.basename(file);
      const component = path.basename(file, ".svelte");
      const code = component.toLowerCase();
      const fullDir = path.dirname(file);
      console.log(
        component,
        fs.existsSync(path.join(fullDir, component + ".demo.svelte")),
      );
      if (fs.existsSync(path.join(fullDir, component + ".demo.svelte"))) {
        console.log("---------------------");
        return `${code}:{name:"${component}",code:"${code}",group:"${groupPath}",root:"${dir}"},`;
      } else {
        // console.log(`MISSED ${code}:{name:"${component}",code:"${code}",group:"${groupPath}",root:"${dir}"},`)
      }
      //if(fs.existsSync(`./src/sitedata/${code}.ts`)) return;
    })
    .filter((f) => f)
    .join("\n");

  // write file
  const targetPath = path.join(projectRoot, "src/sitedata/slotuiCatalog.ts");
  if (fs.existsSync(targetPath)) {
    console.log("slotuiCatalog.ts exists already at:", targetPath);
  } else {
    console.log("slotuiCatalog.ts does not exist, will create:", targetPath);
  }
  console.log("Writing slotuiCatalog.ts to:", targetPath);
  fs.writeFileSync(
    targetPath,
    `export const slotuiCatalog = {${indexContent}} as const`,
  );
  console.log("slotuiCatalog.ts written.");
}

/**
 * generate the demo slotuiCatalog.ts file
 */
async function slotUiDemoCatalog() {
  const svelteFiles = glob.sync("src/lib/**/*.demo.svelte");
  const excludePatterns = [".preview", ".wip", ".js"];

  const indexContent = svelteFiles
    .map((file) => {
      if (excludePatterns.some((pattern) => file.includes(pattern))) return;
	  const upDir = path.dirname(file);
      const dir = file.split("\\").slice(-2, -1);
      const group = path.dirname(upDir).split("\\").slice(-1)[0];
	  const component = path.basename(file, ".demo.svelte");
      const code = component.toLowerCase();
      return `${code}:{component:${component},name:"${component}",code:"${code}",group:"${group}",root:"${dir}"},`;
    })
    .filter((f) => f)
    .join("\n");

  const demoTargetPath = path.join(projectRoot, "src/sitedata/slotuiDemoCatalog.ts");
  const demoIndex = await generateDemoIndex();
  if (fs.existsSync(demoTargetPath)) {
    console.log("slotuiDemoCatalog.ts exists already at:", demoTargetPath);
  } else {
    console.log("slotuiDemoCatalog.ts does not exist, will create:", demoTargetPath);
  }
  console.log("Writing slotuiDemoCatalog.ts to:", demoTargetPath);
  fs.writeFileSync(
    demoTargetPath,
    `${demoIndex};\r export const slotuiDemoCatalog = {${indexContent}} as const`,
  );
  console.log("slotuiDemoCatalog.ts written.");
}

// slotuiDemoComponents
async function generateDemoIndex() {
  const svelteFiles = glob.sync("./src/lib/**/*.demo.svelte", {
    ignore: ["./src/lib/**/*.{preview,wip,js}.svelte"],
  });

  const indexContent = svelteFiles
    .map((file) => {
      if (!file) return;
      file = file.replace("src\\lib\\", "$lib/");
        file = file
        .split(path.sep)
        .join("/")
        .replace(".ts", ".js");
      const compName = file.split("/").slice(-1)[0].split(".")[0];
      return `import  ${path.basename(compName, ".svelte")} from '${file}';`;
    })
    .filter((f) => f)
    .join("\n");

  return indexContent;
}
const readFile = (fileName) => {
  return fs.readFileSync(fileName, "utf8");
};

const config = {
  sitedata: path.join(projectRoot, "src/sitedata"),
  tsxFiles: path.join(projectRoot, "src/sitedata/tsx"),
  slotuiDefs: path.join(projectRoot, "src/sitedata/slotuiDefs"),
  libRoot: path.join(projectRoot, "src"),
};

function main() {
  console.log("Creating directories:", config.slotuiDefs, config.tsxFiles);
  fs.mkdirSync(config.slotuiDefs, { recursive: true });
  fs.mkdirSync(config.tsxFiles, { recursive: true });
  console.log("Directories created.");

  slotUiCatalogB();
  slotUiDemoCatalog(); 
}

main();
