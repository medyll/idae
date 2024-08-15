import fs from "fs";
import path from "path";
import * as sass from "sass";
import { glob } from "glob";

export class SCSSConverter {
  constructor(sourceDir, targetDir) {
    // Source and target directory paths
 
    this.sourceDir = sourceDir; //  path.resolve
    this.targetDir = targetDir; //  path.resolve
 
    this.combinedCSSFile = path.join(this.targetDir, "slotui-combined.css");
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
      file: filePath,
      outputStyle: compressed ? "compressed" : "expanded",
    });
    return result.css.toString();
  }

  // Process a single SCSS file
  async processFile(filePath) {
    const cssContent = this.convertScssToCss(filePath);
    const cssMinContent = this.convertScssToCss(filePath, true);
    const fileName = path.basename(filePath);
    const targetFilePath = path.join(
      this.targetDir,
      path.basename(filePath, ".scss") + ".css",
    );
    const targetMinFilePath = path.join(
      this.targetDir,
      path.basename(filePath, ".scss") + ".min.css",
    );
    console.log("write : ", targetFilePath);
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
      // Use path.relative to get the correct glob pattern
      const globPattern = path.relative(
        process.cwd(),
        path.join(this.sourceDir, "**/*.scss"),
      ); 

      const fileList = await glob("./src/lib/**/*.scss", {
        cwd: process.cwd(),
        nodir: true,
        absolute: true,
      }); 

      for (const file of fileList) { 
        // Use path.resolve to get the absolute file path
        const filePath = path.resolve(file);
        const { fileName, cssContent } = await this.processFile(filePath);

        // Add content to combined CSS file
        combinedCSSStream.write(`\n/** ${fileName} ----------------*/\n${cssContent}\n`);
      }

      combinedCSSStream.end();
      console.log("Conversion ended.");
    } catch (error) {
      console.error("Error processing files:", error);
    }
  }
}
