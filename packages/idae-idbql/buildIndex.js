import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';
import fsx from 'fs-extra';
const __filename = fileURLToPath(import.meta.url);

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
				directory + '/**Alourt*',
				directory + '/**preview.svelte',
				directory + '/**sitedata*',
				directory + '/**.md',
				directory + '/**.scss*',
				directory + '/**wip*',
				directory + '/**Example.svelte',
				directory + '/**indexApi*',
				directory + '/**test*'
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
			console.log('exported', moduleName);
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

new FileProcessor().makeIndexFile();
