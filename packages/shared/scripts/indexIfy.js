import path from "path";
import { glob } from "glob";
import fs from "fs-extra";

/**
 * @typedef {Object} FileInfo
 * @property {string} target - The target path for the file.
 * @property {string} fullPath - The full path of the file.
 * @property {string} path - The normalized relative path of the file.
 * @property {string} file - The name of the file.
 * @property {string} moduleName - The module name derived from the file name.
 */

export class MakeLibIndex {
  #mainGlobPattern = "**/*";
  #ignorePatterns = [
    "*.json",
    "*.json",
    "*.html",
    "*d.ts",
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
    this.#ignorePatterns = [
      ...(options.ignorePatterns ?? []),
      ...this.#ignorePatterns,
    ];
    this.#mainGlobPattern = options.mainGlobPattern ?? this.#mainGlobPattern;
    this.#libRoot = options.libRoot ?? this.#libRoot;
    this.#libTs = options.libTs ?? this.#libTs;

    this.#srcLibPath = options.src ?? path.join(this.#srcPath, this.#libRoot);
    this.#target = options.target ?? path.join(this.#srcPath, this.#libRoot);

    this.#libPath = options.libPath ?? path.join(process.cwd(), this.#libRoot);
    this.#cssNamedExport = options.cssNamedExport ?? this.#cssNamedExport;

    this.#ignorePatterns = this.#ignorePatterns.map((pattern) =>
      path.posix.join("**", pattern),
    );

    console.log("libPath : ", this.#libPath);
  }
  /**
   * @param {string} directory
   * @param {string} target
   * @returns {Promise<Array.<FileInfo>>}
   */
  async #recursiveListFiles(directory, target) {
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
          // type FIleInfo
          target,
          fullPath: file,
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
    console.log(
      "start ----------------------------------------------------------",
    );
    let exportString = "// auto exports of entry components\n";
    const seen = new Set();

    fileInfoList.forEach((fileInfo) => {
      if (!fileInfo) return;
      const { file, moduleName, path: filePath } = fileInfo;
      const normalizedPath = filePath
        .split(path.sep)
        .join("/")
        .replace(".ts", ".js");

      const isSvelteFile = file.endsWith(".svelte");
      const isCssFile = file.endsWith(".css");
      const camelCaseModuleName = this.dotToCamelCase(moduleName);

      let exportKey, exportLine;
      if (isCssFile) {
        exportKey = `${camelCaseModuleName}Css|export*as`;
        exportLine = `export * as ${camelCaseModuleName}Css from '${this.#libTs}/${normalizedPath}';\n`;
      } else if (!isSvelteFile) {
        exportKey = `${moduleName}|${normalizedPath}|export*`;
        exportLine = `export * from '${this.#libTs}/${normalizedPath}';\n`;
      } else {
        exportKey = `${camelCaseModuleName}|${normalizedPath}|exportDefaultAs`;
        exportLine = `export { default as ${camelCaseModuleName} } from '${this.#libTs}/${normalizedPath}';\n`;
      }

      if (seen.has(exportKey)) return;
      seen.add(exportKey);
      exportString += exportLine;
    });

    console.log(
      "write ----------------------------------------------------------",
    );
    if (fs.existsSync(path.join(this.#srcPath, this.#libRoot, "index.ts"))) {
      let indexPath = path.join(this.#srcPath, this.#libRoot, "index.ts");
      // if content differs, write
      if (fs.readFileSync(indexPath, "utf8") !== exportString) {
        await fs.writeFile(indexPath, exportString);
      }
    }
  }
  /**
   * Extracts exports from a given TypeScript or JavaScript file.
   * @param {FileInfo} fileInfo - The file information object.
   * @returns {Promise<string>} - A string of export statements.
   */
  _getExportsFromFile(fileInfo) {
    const fullPath = fileInfo.fullPath; // Use fullPath from fileInfo
    const fileContent = fs.readFileSync(fullPath, "utf8");

    const normalizedPath = fileInfo.path
      .split(path.sep)
      .join("/")
      .replace(".ts", ".js");

    let exportsString = "";

    // Match all export statements
    const exportStatements =
      fileContent.match(
        /export\s+(?:default\s+)?(?:(const|let|var|function|class|interface|type)\s+(\w+)|({\s*[\w\s,]+\s*})|\w+)(?:\s*=\s*(?:{[\s\S]*?}|\([^)]*\)\s*=>|function\s*\([^)]*\)\s*{[\s\S]*?}|[\s\S]*?;))?/gm,
      ) || [];

    exportStatements.forEach((statement) => {
      console.log(statement);
      const cleanedStatement = statement.replace("export ", "").trim();
      const exportedAs = statement.split("export ")[1].split(" ")[0];
      const exportedAsValue = statement.split("export ")[1].split?.(" ")?.[1];

      console.log(exportedAs, exportedAsValue, { statement });
      switch (exportedAs) {
        case "default":
          exportsString += `export default '${this.#libTs}/${normalizedPath}';\n`;
          break;
        case "const":
        case "let":
        case "var":
          {
            const variableName = cleanedStatement.split(" ")[1]; // Get the variable name
            exportsString += `export { ${variableName} } from '${this.#libTs}/${normalizedPath}';\n`;
          }
          break;
        case "function":
          exportsString += `export { ${exportedAsValue} } from '${this.#libTs}/${normalizedPath}';\n`;
          break;
        case "class":
          exportsString += `export { ${exportedAsValue} } from '${this.#libTs}/${normalizedPath}';\n`;
          break;
        case "interface":
        case "type":
          const variableName =
            cleanedStatement.split("type")[1] ??
            cleanedStatement.split("interface")[1];
          const exportsArray = variableName
            .split(",")
            .map((item) => {
              return checkAlias(removeBracket(item.trim()));
            })
            .join(",");
          // if array (,)
          exportsString += `export type { ${exportsArray} }  from '${this.#libTs}/${normalizedPath}';\n`;
          break;
        default:
      }
      // Handle default exports
      if (cleanedStatement.startsWith("default")) {
        exportsString += "";
      } else if (isVariableDeclarationLine(cleanedStatement)) {
      } else if (
        cleanedStatement.startsWith("type") ||
        cleanedStatement.startsWith("interface") ||
        cleanedStatement.startsWith("class") ||
        cleanedStatement.startsWith("function")
      ) {
      } else {
        // Use asMatch to analyze the export statement
        const asMatch = cleanedStatement.match(/(.*?)(\s+as\s+(\w+))?/);
        const exportInput = asMatch ? asMatch.input : cleanedStatement;

        // Handle named exports
        if (exportInput.includes(",")) {
          const exportsArray = exportInput.split(",").map((item) => {
            return checkAlias(removeBracket(item.trim()));
          });
          // exportsString += `export { ${exportsArray.join(", ")} } from '${this.#libTs}/${normalizedPath}';\n`;
        } else {
          const exportName = exportInput.replace(/^{|}$/g, "").trim(); // Remove curly braces
          exportsString += `export { ${exportName} } from '${this.#libTs}/${normalizedPath}';\n`;
        }

        // Handle aliasing
        /* if (asMatch && asMatch[3]) {
          const aliasName = asMatch[3].trim();
          exportsString += `export { ${aliasName} as ${exportName} } from '${this.#libTs}/${normalizedPath}';\n`;
        } */
      }
    });

    function removeBracket(str) {
      const cleanedStr = str.replace(/^{\s*|\s*}$/g, "").trim();
      return cleanedStr;
    }

    function isVariableDeclarationLine(cleanedStatement) {
      return (
        cleanedStatement.startsWith("const") ||
        cleanedStatement.startsWith("let") ||
        cleanedStatement.startsWith("var")
      );
    }

    function checkAlias(entry) {
      const entryList = entry.split(" as ").filter((x) => x.trim());
      return entryList[1] ?? entryList[0];
    }

    return exportsString;
  }

  async makeIndexFile(src, target) {
    this.#srcLibPath = src ?? this.#srcLibPath;
    this.#target = target ?? this.#target;

    const fileInfoList = await this.#recursiveListFiles(
      this.#srcLibPath,
      this.#target,
    );
    await this._writeExportFromFileInfoList(fileInfoList);
  }

  dotToCamelCase(str) {
    str = str.replace(/\.([a-z])/g, (_, g) => g.toUpperCase());
    return str.replace(/\-([a-z])/g, (_, g) => g.toUpperCase());
  }
}

// npm i @medyll/idae-be@next @medyll/idae-api@next @medyll/idae-data-tpl@next @medyll/idae-dom-events@next @medyll/idae-engine@next @medyll/idae-idbql@next @medyll/idae-mongo@next @medyll/idae-query@next @medyll/idae-slotui-svelte@next -f
