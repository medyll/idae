import fs from 'fs';
import path from 'path';
import * as sass from 'sass';
import pkg from 'glob';
const { glob } = pkg;

class SCSSConverter {
	constructor(sourceDir, targetDir) {
		// Source and target directory paths
		this.sourceDir = sourceDir;
		this.targetDir = targetDir;
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
		const result = sass.compile(filePath,{ 
			style: compressed ? 'compressed' : 'expanded'
		});
		return result.css 
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
			const files = await new Promise((resolve, reject) => {
				glob('**/*.scss', { cwd: this.sourceDir }, (err, matches) => {
					if (err) reject(err);
					else resolve(matches);
				});
			});

			for (const file of files) {
				const filePath = path.join(this.sourceDir, file);
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

// Usage
/* const converter = new SCSSConverter('./src/lib', './src/lib/_css');
converter.processAllFiles(); */

/* const converter = new SCSSConverter('.\\src\\lib', '.\\src\\lib\\_css');
converter.processAllFiles(); */
