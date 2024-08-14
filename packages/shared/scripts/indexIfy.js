import path from "path";
import { glob } from "glob";
import fs from "fs-extra";

export class MakeLibIndex {
  #mainGlobPattern = "**/*";
  #ignorePatterns = [
    "*.json",
    "*.json",
    "*.html",
    "*index.ts",
    "*index.ts",
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
  #libTs = "$lib";
  #libPath;
  #cssNamedExport = true;

  #srcPath = "src";
  #srcLibPath;
  #target;
  /**
   * Constructs a new instance of the IndexIfy class.
   * @param {Object} options - The options for configuring the IndexIfy instance.
   * @param  {string} options.mainGlobPattern -  The glob pattern to use for indexing.
   * @param {string} options.srcPath - The source path of the directory (src).
   * @param {string} options.srcLibPath - The srcLibPath path (overrides  path.join(srcPath,libRoot).
   * @param {string} options.target - The target path (overrides  path.join(srcPath,libRoot).
   * @param {string[]} options.ignorePatterns - The patterns to ignore when indexing.
   * @param {string} options.libRoot - The root directory of the library. (lib)
   * @param {string} options.libTs - The path name to the TypeScript file of the library ($lib).
   * @param {string} options.libPath - The path to the library.
   * @param {boolean} options.cssNamedExport - If true, CSS files will be exported as named exports.
   */
  constructor(options = {}) {
    //
    this.#ignorePatterns = [...options.ignorePatterns ?? [], ...this.#ignorePatterns];
    this.#mainGlobPattern = options.mainGlobPattern ?? this.#mainGlobPattern;
    this.#libRoot = options.libRoot ?? this.#libRoot;
    this.#libTs = options.libTs ?? this.#libTs;

    this.#srcLibPath = options.src ?? path.join(this.#srcPath, this.#libRoot);
    this.#target = options.target ?? path.join(this.#srcPath, this.#libRoot);

    this.#libPath = options.libPath ?? path.join(process.cwd(), this.#libRoot);
    this.#cssNamedExport = options.cssNamedExport ?? this.#cssNamedExport;

    this.#ignorePatterns = this.#ignorePatterns.map((pattern) =>
      path.posix.join("**", pattern)
    );

    console.log("libPath : ", this.#libPath);
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
    const files = await glob(this.#mainGlobPattern, {
      cwd: directory,
      ignore: this.#ignorePatterns,
      nodir: true,
      absolute: true,
    });

    return files.map((file) => {
      const relativePath = path.relative(target, file);
      if (fs.existsSync(path.join("src", this.#libRoot)))
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
    let exportString = "// auto exports of entry components\n";
    fileInfoList.forEach((fileInfo) => {
      const { file, moduleName, path: filePath } = fileInfo;
      const normalizedPath = filePath
        .split(path.sep)
        .join("/")
        .replace(".ts", ".js");

      const isSvelteFile = file.endsWith(".svelte");
      const isCssFile = file.endsWith(".css");
      const camelCaseModuleName = this.dotToCamelCase(moduleName);

      if (isCssFile) {
        exportString += `export * as ${camelCaseModuleName}Css from '${this.#libTs}/${normalizedPath}';\n`;
      } else if (!isSvelteFile) {
        exportString += `export * from '${this.#libTs}/${normalizedPath}';\n`;
      } else {
        exportString += `export { default as ${camelCaseModuleName} } from '${this.#libTs}/${normalizedPath}';\n`;
      }
    });
    if (fs.existsSync(path.join("src", this.#libRoot, "index.ts")))
      await fs.writeFile(
        path.join("src", this.#libRoot, "index.ts"),
        exportString
      );
  }

  async makeIndexFile(src, target) {
    this.#srcLibPath = src ?? this.#srcLibPath;
    this.#target = target ?? this.#target;

    const fileInfoList = await this._recursiveListSvelteFile(
      this.#srcLibPath,
      this.#target
    );
    await this._writeExportFromFileInfoList(fileInfoList);
  }

  dotToCamelCase(str) {
    str = str.replace(/\.([a-z])/g, (_, g) => g.toUpperCase());
    return str.replace(/\-([a-z])/g, (_, g) => g.toUpperCase());
  }
}

// npm i @medyll/idae-be@next @medyll/idae-api@next @medyll/idae-data-tpl@next @medyll/idae-dom-events@next @medyll/idae-engine@next @medyll/idae-idbql@next @medyll/idae-mongo@next @medyll/idae-query@next @medyll/idae-slotui-svelte@next -f
