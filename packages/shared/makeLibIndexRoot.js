import path from "path";
import { glob } from "glob";
import fs from "fs-extra";

export class MakeLibIndex {
  #ignorePatterns = [
    "*.html",
    "index.ts",
    "*.demo.svelte",
    "*Demo.svelte",
    "*preview.svelte",
    "*sitedata*",
    "*.md",
    "*.scss*",
    "*.test.ts*",
    "*wip*",
    "*Example.svelte",
    "*indexApi*",
    "*Readme*",
  ];

  #libRoot = "lib";
  #libPath;
  constructor(options={}) {
    this.#ignorePatterns = options.ignorePatterns ?? this.#ignorePatterns;
    this.#libRoot = options.libRoot ?? this.#libRoot;

    this.#libPath = options.libPath ?? path.join(process.cwd(), this.#libRoot);

    console.log("libPath", this.#libPath);
  }
  /**
   * @param {string} directory
   * @param {string} target
   * @returns {Promise<Array.<FileInfo>>}
   */
  /**
   * @param {string} directory
   * @param {string} target
   * @returns {Promise<Array.<FileInfo>>}
   */
  async _recursiveListSvelteFile(directory, target) {
    this.#ignorePatterns.map((pattern) => path.posix.join("**", pattern));

    const files = await glob("**/*", {
      cwd: directory,
      ignore: this.#ignorePatterns,
      nodir: true,
      absolute: true,
    });

    return files.map((file) => {
      const relativePath = path.relative(target, file);
      return {
        path: path.normalize(relativePath),
        file: path.basename(file),
        moduleName: path.basename(file, path.extname(file)),
      };
    });
  }

  /**
   * @param {Array.<FileInfo>} fileInfoList
   */
  async _writeExportFromFileInfoList(fileInfoList) {
    let exportString = "// Reexport of entry components\n";
    fileInfoList.forEach((fileInfo) => {
      const { file, moduleName, path: filePath } = fileInfo;
      const normalizedPath = filePath
        .split(path.sep)
        .join("/")
        .replace(".ts", ".js");
      const isSvelteFile = file.endsWith(".svelte");

      if (!isSvelteFile) {
        exportString += `export * from '$lib/${normalizedPath}';\n`;
      } else {
        const camelCaseModuleName = this.dotToCamelCase(moduleName);
        exportString += `export { default as ${camelCaseModuleName} } from '$lib/${normalizedPath}';\n`;
      }
    });
    await fs.writeFile(
      path.join("src", this.#libRoot, "index.ts"),
      exportString,
    );
  }

  async makeIndexFile() {
    const fileInfoList = await this._recursiveListSvelteFile(
      path.join("src", this.#libRoot),
      path.join("src", this.#libRoot),
    );
    console.log(fileInfoList)
    // await this._writeExportFromFileInfoList(fileInfoList);
  }

  dotToCamelCase(str) {
    return str.replace(/\.([a-z])/g, (_, g) => g.toUpperCase());
  }
}
