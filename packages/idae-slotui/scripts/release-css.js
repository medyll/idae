import fs from 'fs';
import path from 'path';
import * as sass from 'sass'; 

export class SCSSConverter {
	constructor(sourceDir, targetDir) {
		// Source and target directory paths
		this.sourceDir = path.resolve(sourceDir);
		this.targetDir = path.resolve(targetDir);
		this.combinedCSSFile = path.join(this.targetDir, 'slotui-combined.css');
	}

	// Ensure target directory exists
	ensureTargetDir() {
		if (!fs.existsSync(this.targetDir)) {
			fs.mkdirSync(this.targetDir, { recursive: true });
		}
	}

	// Convert SCSS to CSS
	convertScssToCss(filePath, compressed = false) {
		const result = sass.renderSync({
			file: filePath,
			outputStyle: compressed ? 'compressed' : 'expanded'
		});
		return result.css.toString();
	}

	// Process a single SCSS file
	processFile(filePath) {
		const cssContent = this.convertScssToCss(filePath);
		const cssMinContent = this.convertScssToCss(filePath, true);
		const fileName = path.basename(filePath);
		const targetFilePath = path.join(this.targetDir, path.basename(filePath, '.scss') + '.css');
		const targetMinFilePath = path.join(
			this.targetDir,
			path.basename(filePath, '.scss') + '.min.css'
		);

		// Save individual CSS files
		fs.writeFileSync(targetFilePath, cssContent);
		fs.writeFileSync(targetMinFilePath, cssMinContent);

		return { fileName, cssContent };
	}

	// Process all SCSS files and combine them
	async processAllFiles() {
		this.ensureTargetDir();

		const combinedCSSStream = fs.createWriteStream(this.combinedCSSFile);

		try {
			// Dynamically import glob
			const { glob } = (await import('glob')).glob;
			const globPromise = (pattern, options) =>
				new Promise((resolve, reject) => {
					glob(pattern, options, (err, matches) => {
						if (err) reject(err);
						else resolve(matches);
					});
				});

			// Use path.relative to get the correct glob pattern
			const globPattern = path.relative(process.cwd(), path.join(this.sourceDir, '**/*.scss'));

			// Use the promisified version of glob
			const files = await globPromise(globPattern);

			for (const file of files) {
				// Use path.resolve to get the absolute file path
				const filePath = path.resolve(file);
				const { fileName, cssContent } = this.processFile(filePath);

				// Add content to combined CSS file
				combinedCSSStream.write(`/** ${fileName} -----*/\n${cssContent}\n`);
			}

			combinedCSSStream.end();
			console.log('Conversion ended.');
		} catch (error) {
			console.error('Error processing files:', error);
		}
	}
}
