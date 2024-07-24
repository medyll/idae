import fs from 'fs';
import path from 'path';
import process from 'process';
import micromatch from 'micromatch';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import sveld from 'sveld';
import { svelte as sveltePlugin } from '@sveltejs/vite-plugin-svelte';
import * as svelte from 'svelte/compiler';
import sveltePreprocess from 'svelte-preprocess';
import { svelte2tsx, emitDts } from 'svelte2tsx';
import svelteConfig from './svelte.config.js';
import { vitePreprocess, loadSvelteConfig } from '@sveltejs/vite-plugin-svelte';
const { ComponentParser } = sveld;
import glob from 'glob';
// import * as pkg from './package.json';
import ts from 'typescript';
import { loadConfigFromFile } from 'vite';
import fsx from 'fs-extra';
import { sveltekit } from '@sveltejs/kit/vite';

import { VERSION } from 'svelte/compiler';
import lib from 'sveld';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function dotToCamelCase(str) {
	return str.replace(/\.(\w)/g, function (match, letter) {
		return letter.toUpperCase();
	});
}
class FileProcessor {
	/**
	 *
	 * @param {string} directory
	 * @param {string} target
	 * @returns  {Array.<FileInfo>}
	 */
	_recursiveListSvelteFile(directory, target) {
		const files = glob.sync(directory + '/*', {
			ignore: [
				directory + '/**index.ts',
				directory + '/**.demo.svelte',
				directory + '/**Demo.svelte',
				directory + '/**preview.svelte',
				directory + '/**sitedata*',
				directory + '/**.md',
				directory + '/**.scss*',
				directory + '/**wip*',
				directory + '/**Example.svelte',
				directory + '/**indexApi*',
				directory + '/**Readme*'
			]
		});

		let svelteFiles = [];
		files.forEach((file) => {
			if (fsx.statSync(file).isDirectory()) {
				svelteFiles = svelteFiles.concat(this._recursiveListSvelteFile(file, target));
			} else {
				let cleanPath = path.normalize(file.replace(target, ''));

				svelteFiles.push({
					path: cleanPath,
					file: path.basename(file),
					moduleName: path.basename(file).replace(/\.[^/.]+$/, '')
				});
			}
		});
		return svelteFiles;
	}

	/**
	 *
	 * @param {Array.<FileInfo>} fileInfoList
	 */
	_writeExportFromFileInfoList(fileInfoList) {
		let exportString = '// Reexport of entry components\n';
		fileInfoList.forEach((fileInfo) => {
			let file = fileInfo.file;
			let moduleName = this.dotToCamelCase(fileInfo.moduleName);
			let path = fileInfo.path.replace(/\\/g, '/').replace('.ts', '.js');
			let isSvelteFile = file.endsWith('.svelte');

			if (!isSvelteFile) {
				exportString += `export * from '$lib${path}';\n`;
			} else {
				exportString += `export { default as ${moduleName} } from '$lib${path}';\n`;
			}
		});
		fsx.writeFileSync('./src/lib/index.ts', exportString);
	}

	makeIndexFile() {
		let fileInfoList = this._recursiveListSvelteFile('./src/lib', './src/lib');
		this._writeExportFromFileInfoList(fileInfoList);
	}

	dotToCamelCase(str) {
		return str.replace(/\.([a-z])/g, function (g) {
			return g[1].toUpperCase();
		});
	}
}

/**
 * generate the slotuiCatalog.ts file
 */
async function slotUiCatalogB() {
	const svelteFiles = glob.sync('./src/lib/**/*.svelte');
	const excludePatterns = ['.preview', '.demo', '.wip', '.js'];

	const indexContent = svelteFiles
		.map((file) => {
			if (excludePatterns.some((pattern) => file.includes(pattern))) return;
			const group = file.split('/')[3];
			const compName = file.split('/').slice(-1)[0].split('.')[0];
			const dir = file.split('/').slice(-2, -1);
			const code = compName.toLowerCase();
			const fileName = path.basename(file);
			const component = path.basename(file, '.svelte');
			const fullDir = path.dirname(file);
			console.log(path.join(fullDir, component, fileName + '.demo.svelte'));
			if (fs.existsSync(path.join(fullDir, component + '.demo.svelte'))) {
				console.log('---------------------');
				return `${code}:{name:"${compName}",code:"${code}",group:"${group}",root:"${dir}"},`;
			}
			//if(fs.existsSync(`./src/sitedata/${code}.ts`)) return;
		})
		.filter((f) => f)
		.join('\n');

	// write file
	fs.writeFileSync(
		path.join(__dirname, 'src/sitedata/slotuiCatalog.ts'),
		`export const slotuiCatalog = {${indexContent}} as const`
	);
}

/**
 * generate the demo slotuiCatalog.ts file
 */
async function slotUiDemoCatalog() {
	const svelteFiles = glob.sync('./src/lib/**/*.demo.svelte');
	const excludePatterns = ['.preview', '.wip', '.js'];

	const indexContent = svelteFiles
		.map((file) => {
			if (excludePatterns.some((pattern) => file.includes(pattern))) return;
			const group = file.split('/')[3];
			const comp = file.split('\\').slice(-1).toString()?.replace(/\./g, '');
			const compName = file.split('/').slice(-1)[0].split('.')[0];
			const dir = file.split('/').slice(-2, -1);
			const code = compName.toLowerCase();
			return `${code}:{component:${compName},name:"${compName}",code:"${code}",group:"${group}",root:"${dir}"},`;
		})
		.filter((f) => f)
		.join('\n');

	await generateDemoIndex();
	// write file
	fs.writeFileSync(
		path.join(__dirname, 'src/sitedata/slotuiDemoCatalog.ts'),
		`${await generateDemoIndex()};\r export const slotuiDemoCatalog = {${indexContent}} as const`
	);
}

// slotuiDemoComponents
async function generateDemoIndex() {
	const svelteFiles = glob.sync('./src/lib/**/*.demo.svelte', {
		ignore: ['./src/lib/**/*.{preview,wip,js}.svelte']
	});

	const indexContent = svelteFiles
		.map((file) => {
			if (!file) return;
			file = file.replace('./src/lib/', '$lib/');
			const compName = file.split('/').slice(-1)[0].split('.')[0];
			return `import  ${path.basename(compName, '.svelte')} from '${file}';`;
		})
		.filter((f) => f)
		.join('\n');

	return indexContent;
}
const readFile = (fileName) => {
	return fs.readFileSync(fileName, 'utf8');
};

async function useSvelte2TsxNope() {
	const svelteFiles = glob.sync('./src/lib/**/Alert.svelte', {
		//ignore: ['./src/lib/**/Alert.demo.svelte']
	});

	/* emitDts({
		declarationDir: 'declarationDir', 
		svelteShimsPath: path.resolve('svelte2tsx/svelte-shims.d.ts')
	}); */

	let content;
	svelteFiles.forEach((fileName) => {
		/* let content = fs.readFileSync(fileName, 'utf-8');
	 
		 let tr = svelte2tsx(content, { mode: 'dts', isTsFile: true, version: VERSION }); */
	});
}

async function useSvelte2Tsx(files = './src/lib/**/*.svelte') {
	const svelteFiles = glob.sync(files, {
		//ignore: ['./src/lib/**/Alert.demo.svelte']
	});

	emitDts({
		libRoot: config.libRoot,
		declarationDir: 'declarationDir',
		svelteShimsPath: path.resolve('svelte2tsx/svelte-shims-v4.d.ts')
	});

	/* svelteFiles.forEach((fileName) => {
		let content = fs.readFileSync(fileName, 'utf-8');
		let tr = svelte2tsx(content, { mode: 'dts', isTsFile: true, version: VERSION });
		console.log(tr)
	}); */
}

async function processit(fileName) {
	const config = await loadConfigFromFile({ command: 'build' }, './vite.config.js');
	const plugin = sveltePlugin(config.config.plugins.find((plugin) => plugin.name === 'svelte'))[0];
	// fs.writeFileSync('./src/transform.js', plugin.toString());

	const configPath = ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json');
	if (!configPath) throw new Error("Could not find a valid 'tsconfig.json'.");
	//console.log(configPath);
	const readConfigFile = ts.readConfigFile(configPath, readFile);

	// console.log(readConfigFile.config.extends);

	const readConfigFileExt = ts.readConfigFile(readConfigFile.config.extends, readFile);

	const tsOpt = {
		...readConfigFileExt.config,
		...readConfigFile.config,
		compilerOptions: {
			...readConfigFileExt.config.compilerOptions,
			...readConfigFile.config.compilerOptions
		}
	};

	try {
		let contents = fs.readFileSync(fileName, 'utf-8');
		const scriptContent = contents.match(/<script[^>]*>([\s\S]*?)<\/script>/i)[1];

		// console.log(contents);

		const test = await svelte.preprocess(contents, [sveltePreprocess()], { filename: fileName });
		//console.log(test.code)

		/* const preprocessed = (await preprocess(contents, preprocessor, { filename })).code;
		contents = strip_lang_tags(preprocessed); */

		//return;
		/* const ast = svelte.parse(test.code, {
			filename: fileName,
			dev: true
		}); */

		//console.log(Object.keys(ast));
		// Compiler le fichier Svelte

		///const result = await plugin.transform(contents, fileName);
		// fs.writeFileSync('./src/transform.js', result);
		/* const transp = ts.transpileModule(scriptContent, tsOpt);
		  console.log(transp); */
		const compiled = svelte.compile(contents, {
			dev: true,
			filename: fileName,
			generate: 'dom',
			preserveComments: true
		});
		// console.log(compiled.js.code);
		/* return;
		 fs.writeFileSync(path.resolve(__dirname, 'src/transform.js'), compiled.js.code);  */

		//console.log(compiled)

		const jsCode = await svelte
			.preprocess(contents, sveltePreprocess({ script: true, style: true, sourceMap: false }), {
				filename: fileName
			})
			.then((processed) => {
				const compiled = svelte.compile(processed.code, {
					dev: true,
					filename: fileName,
					generate: 'dom',
					accessors: true,
					preserveComments: true
				});
				console.log(Object.keys(compiled.metadata));
				return compiled.js;
			});
		//fs.writeFileSync(path.resolve(__dirname, 'src/transform.js'), jsCode);

		/* const data = new ComponentParser({
			verbose: false
		}).parseSvelteComponent(jsCode, {
			filePath: fileName,
			moduleName: fileName
		}); */
		return;
	} catch (e) {
		console.error('error converting file ', fileName);
		throw e;
	}
}

async function generateSvelteIndex() {
	const svelteFiles = glob.sync('./src/lib/**/*.svelte', {
		ignore: ['./src/lib/**/*.{demo,preview,wip,js}.svelte']
	});

	const indexContent = svelteFiles
		.map((file) => {
			if (!file) return;
			file = file.replace('./src/lib/', '$lib/');
			return `export { default as ${path.basename(file, '.svelte')} } from '${file}';`;
		})
		.filter((f) => f)
		.join('\n');

	fs.writeFileSync(path.resolve(__dirname, 'src/lib/svelte-index.js'), indexContent);
	fs.writeFileSync(path.resolve(__dirname, `${config.sitedata}/slotuiComponents.ts`), indexContent);

	//console.log(ComponentParser)
}

const config = {
	sitedata: './src/sitedata',
	tsxFiles: './src/sitedata/tsx',
	slotuiDefs: './src/sitedata/slotuiDefs',
	libRoot: './src'
};

function main() {
	fs.mkdirSync(config.slotuiDefs, { recursive: true });
	fs.mkdirSync(config.tsxFiles, { recursive: true });

	// useSvelte2Tsx();

	new FileProcessor().makeIndexFile();
	slotUiCatalogB();
	slotUiDemoCatalog();
	// generateSvelteIndex();
}

main();
