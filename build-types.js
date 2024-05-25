import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import micromatch from 'micromatch';
import ts from 'typescript';

import config from './svelte.config.js';

/**
 * Represents a class for building types for Svelte components.
 */
export class BuildTypes {
	/**
	 * @typedef {Object} BuildTypesOptions
	 * @property {string} project_root - The root directory of the library.
	 * @property {string} lib_parse - The library parse value.
	 * @property {string} dts_output_dir - The directory for the dts files.
	 * @property {string} component_type_filename - The file type name.
	 * @property {boolean} svelte_ignore - The svelte ignore value.
	 * @property {string} svelte_extension - The svelte extension.
	 * @property {boolean} keep_comments - The keep comments value.
	 */

	/**
	 * Represents a BuildTypes object.
	 * @type {BuildTypesOptions} options - The options for the BuildTypes.
	 */
	options = {
		project_root: 'src/',
		lib_parse: 'src/lib/',
		dts_output_dir: 'typesAOO', // target directory for generated d.ts files
		component_type_filename: 'types.ts', // the name of the ts file to parse in the directory
		svelte_ignore: ['**/*.{demo,preview,wip,js}.svelte'], // files to ignore
		svelte_extension: '.svelte', // extension of svelte files
		keep_comments: true // keep comments in the generated d.ts files
	};

	/**
	 * Represents a BuildTypes object.
	 * @constructor
	 * @param {BuildTypesOptions} options - The options for the BuildTypes.
	 */
	constructor(args) {
		this.options = { ...this.options, ...args };

		this.ts_config = this.getTsConfigFile();
		this.aliases = this.#get_aliases();
		this.ModuleResolutionHost = this.#get_host();
	}

	/**
	 * Builds the types for Svelte components having a types.ts in the same directory.
	 */
	buildTypes() {
		fs.StatsFs;
		fs.ensureDirSync(path.dirname(this.options.dts_output_dir));
		// ts.updateSourceFile
		const filesToParse = this.#get_root_files();
		// console.log({ filesToParse });
		filesToParse.forEach((file) => {
			const dir = path.dirname(file);
			const tsFilePath = path.join(dir, this.options.component_type_filename);
			const moduleName = `${path.basename(file, this.options.svelte_extension)}Props`;
			// console.log({ tsFilePath, moduleName });
			if (fs.existsSync(tsFilePath)) {
				const dtsCode = this.extractComponentProps(moduleName, tsFilePath);
				const importCodeMapped = this.getTypeImportPaths(tsFilePath);
				//this.generateDocumentation([tsFilePath], moduleName);
				if (dtsCode) {
					this.createDtsFile(file, dtsCode);
				}
			}
		});
	}

	generateDocumentation(filePaths, moduleName) {
		// Create a Program with the given files
		let program = ts.createProgram(filePaths, {
			target: ts.ScriptTarget.ESNext,
			module: ts.ModuleKind.ESNext,
			declaration: true,
			emitDeclarationOnly: false
		});
		// Get the checker
		let checker = program.getTypeChecker();

		// Visit every sourceFile in the program
		for (const sourceFile of program.getSourceFiles()) {
			if (!sourceFile.isDeclarationFile) {
				console.log(`Source file: ${sourceFile.fileName}`);
				// Walk the tree to search for classes
				ts.forEachChild(sourceFile, (node) => {
					if (node.name?.getText() === moduleName) {
						// for example : export interface AvatarProps extends CommonProps {
						visit(node);
					}
				});
			} else {
				// console.log(`Declaration file: ${sourceFile.fileName}`);
			}
		}

		function visit(node) {
			// Only consider exported nodes
			if (!isNodeExported(node)) {
				return;
			}
			console.log('visit', node?.name?.getText());

			// visit all the properties of the node (interface or type)
			ts.forEachChild(node, (inode) => {
				let typeName = inode?.typeName?.getText();
				let symbol = checker.getSymbolAtLocation(inode.name);
				let type = checker.getTypeOfSymbolAtLocation(symbol, symbol?.valueDeclaration);
				let type2 = checker.getTypeAtLocation(inode);
				//
				if (type) {
					console.log(checker.typeToString(type));
					let elementPropsSymbol = checker.resolveName(
						checker.typeToString(type),
						inode,
						ts.SymbolFlags.All,
						/* excludeGlobals */ false
					);
					if (elementPropsSymbol) {
						let mykeySymbol = checker.getPropertyOfType(
							checker.getDeclaredTypeOfSymbol(elementPropsSymbol),
							symbol?.getName()
						);
						/* let mykeyType = checker.getTypeOfSymbolAtLocation(
							mykeySymbol,
							mykeySymbol.valueDeclaration
						); */
					}
				}

				/* for (const member of inode.members) {
						if (ts.isPropertySignature(member) && member.questionToken) {
							console.log(`property ${member.name.getText()} is optional`);
						}
					} */

				/* let type = checker.getTypeOfSymbolAtLocation(symbol, inode);
					console.log(`Type of export ${exportName}: ${checker.typeToString(type)}`); */
				console.log(
					'----------------------------------------------------------------------------------------------------------------------------------'
				);
				console.log(`property ${symbol?.getName()} of type  ${checker.typeToString(type)}`);
			});
		}

		function isNodeExported(node) {
			return (
				(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
				(!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
			);
		}
	}

	/**
	 * Extracts specific component props from a TypeScript file.
	 * Uses ts.typeChecker to collect types and interfaces.
	 * @param {string} moduleName - The name of the module.
	 * @param {string} tsFilePath - The path to the TypeScript file.
	 * @returns {string} - The extracted component props as a string.
	 */
	extractComponentProps(moduleName, tsFilePath, level = undefined) {
		let importCodeMapped = {};
		if (level === undefined) {
			importCodeMapped = this.getTypeImportPaths(tsFilePath);
		}
		const sourceFileImports = ts.createSourceFile('', Object.values(importCodeMapped).join('\n'));
		const sourceContent = fs.readFileSync(tsFilePath, 'utf8');

		const finalSourceFile = ts.createSourceFile(
			'',
			sourceFileImports.text + sourceContent,
			sourceContent,
			ts.ScriptTarget.Latest
		);

		const propsType = finalSourceFile.statements.find(
			(node) =>
				node.kind === ts.SyntaxKind.InterfaceDeclaration ||
				(node.kind === ts.SyntaxKind.TypeAliasDeclaration && node.name.text === moduleName)
		);
		if (propsType) {
			// ts.updateSourceFile(sourceFile, Object.values(importCodeMapped).join('\n'))
			const dtsCode = this.generateDtsCode(propsType, finalSourceFile);
			console.log(`Generating d.ts code: ${moduleName}`);
	 
			return [dtsCode].join('\n');
		}
	}

	/**
	 * Generates the d.ts code for a given props type.
	 *
	 * @param {ts.Node} propsType - The props type node.
	 * @param {ts.SourceFile} sourceFile - The source file containing the props type.
	 * @returns {string} - The generated d.ts code.
	 */
	generateDtsCode(propsType, sourceFile) {
		const printer = this.#get_printer();
		const dtsCode = printer.printNode(ts.EmitHint.Unspecified, propsType, sourceFile);
		return dtsCode;
	}

	/**
	 * Creates a d.ts file for a Svelte component.
	 *
	 * @param {string} file - The path to the Svelte component file.
	 * @param {string} dtsCode - The d.ts code to write to the file.
	 */
	createDtsFile(file, dtsCode) {
		const componentName = path.basename(file, this.options.svelte_extension);
		const propsTypeName = `${componentName}Props`;
		const dtsFilePath = path.resolve(this.options.dts_output_dir, `${propsTypeName}.d.ts`);
		console.log(`Generating d.ts file: ${dtsFilePath}`);
		fs.writeFileSync(dtsFilePath, dtsCode);
	}

	/**
	 * Gets the imported nodes from a TypeScript source file.
	 *
	 * @param {ts.SourceFile} sourceFile - The TypeScript source file.
	 * @returns {string[]} - The imported nodes as an array of strings.
	 */
	getImportedNodes(sourceFile) {
		const printer = this.#get_printer();
		const imports = sourceFile.statements.filter(
			(node) => node.kind === ts.SyntaxKind.ImportDeclaration
		);
		const importCodes = imports.map((node) =>
			printer.printNode(ts.EmitHint.Unspecified, node, sourceFile)
		);
		return importCodes;
	}

	/**
	 * Gets the TypeScript source file from a given file path.
	 *
	 * @param {string} tsFilePath - The path to the TypeScript file.
	 * @returns {ts.SourceFile} - The TypeScript source file.
	 */
	getTsSourceFile(tsFilePath, content = '') {
		return ts.createSourceFile(
			tsFilePath,
			content + fs.readFileSync(tsFilePath, 'utf8'),
			ts.ScriptTarget.Latest
		);
	}

	/**
	 * Gets the TypeScript configuration file.
	 *
	 * @returns {Object} - The TypeScript configuration object.
	 * @throws {Error} - If a valid 'tsconfig.json' file is not found.
	 */
	getTsConfigFile() {
		const configPath = ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json');
		if (!configPath) throw new Error("Could not find a valid 'tsconfig.json'.");
		const readConfigFile = ts.readConfigFile(configPath, ts.sys.readFile);
		const readConfigFileExt = ts.readConfigFile(readConfigFile.config.extends, ts.sys.readFile);
		return {
			...readConfigFileExt.config,
			...readConfigFile.config,
			compilerOptions: {
				...readConfigFileExt.config.compilerOptions,
				...readConfigFile.config.compilerOptions
			}
		};
	}

	/**
	 * Gets the aliases for resolving paths.
	 *
	 * @returns {Object} - The aliases object.
	 */
	#get_aliases() {
		const test = Array.from(
			Object.entries(config.kit?.alias ?? {}).map(([key, value]) => {
				return [key, path.resolve(value)];
			}) ?? {}
		);
		return {
			$lib: path.resolve(config.kit?.files?.lib ?? 'src/lib'),
			...Object.fromEntries(test)
		};
	}

	/**
	 * Resolves aliases in a given path or alias.
	 *
	 * @param {string} pathOrAlias - The path or alias to resolve.
	 * @returns {string} - The resolved path.
	 */
	#resolve_aliases(pathOrAlias) {
		if (!this.aliases) this.aliases = this.#get_aliases();
		for (const [alias, value] of Object.entries(this.aliases)) {
			if (pathOrAlias.startsWith(alias)) {
				return path.join(pathOrAlias.replace(alias, value));
			}
		}
		return pathOrAlias;
	}

	/**
	 * Gets the paths an content of typed imports  from a TypeScript file.
	 *
	 * @param {string} tsFilePath - The path to the TypeScript file.
	 * @returns {Object} - The resolved type import paths.
	 */
	getTypeImportPaths(tsFilePath) {
		tsFilePath = this.#resolve_aliases(tsFilePath.replace('.js', '.ts'));
		const sourceFile = this.getTsSourceFile(tsFilePath);
		console.log(sourceFile.text);
		const imports = sourceFile.statements.filter(
			/** @param {ts.Node} node */
			(node) => node.kind === ts.SyntaxKind.ImportDeclaration // && node.importClause.isTypeOnly
		);

		const resolvedTypes = { sourceFile: sourceFile.text };

		imports.forEach((imp) => {
			const modulePathOrAlias = this.#resolve_aliases(imp.moduleSpecifier.text);
			//

			/** @type {ts.Statement} namedBindings */
			const namedBindings = imp.importClause.namedBindings;

			namedBindings.elements.forEach((element) => {
				if (element.isTypeOnly) {
					console.log(`Type import: ${element.name.escapedText}`);
				}

				const moduleName = element.name.escapedText;
				const resolvedModule = ts.resolveModuleName(
					modulePathOrAlias,
					tsFilePath,
					this.ts_config,
					this.#get_host()
				).resolvedModule;
				//
				const sourceModuleFile = this.getTsSourceFile(resolvedModule?.resolvedFileName);
				const propsType = sourceModuleFile.statements.find(
					(node) => node?.name?.text === moduleName
				);
				if (!propsType) return;
				const dtsCode = this.generateDtsCode(propsType, sourceModuleFile);

				const modulePath = resolvedModule?.resolvedFileName;
				let moduleContent = dtsCode; //this.extractComponentProps(moduleName, modulePath, true); // fs.readFileSync(tsFilePath, 'utf8'),
				// remove all strings starting with import and finishing with ;
				moduleContent = moduleContent.replace(/import .*;/g, '');
				resolvedTypes[moduleName] = moduleContent;
			});
		});
		 
		return resolvedTypes;
	}

	/**
	 * Gets the root files for the TypeScript program.
	 *
	 * @returns {string[]} - The root files for the TypeScript program.
	 */
	#get_root_files() {
		const svelteFiles = glob.sync(
			path.resolve(this.options.lib_parse, `**/*${this.options.svelte_extension}`)
		);
		const filesToParse = svelteFiles.filter(
			(file) => !micromatch.some(file, this.options.svelte_ignore)
		);

		return filesToParse;
	}

	/**
	 * Gets the TypeScript printer.
	 *
	 * @returns {ts.Printer} - The TypeScript printer.
	 */
	#get_printer() {
		return ts.createPrinter({ removeComments: !this.options.keep_comments });
	}

	/**
	 * Gets the ModuleResolutionHost for TypeScript.
	 *
	 * @returns {ts.ModuleResolutionHost} - The ModuleResolutionHost for TypeScript.
	 */
	#get_host() {
		return {
			fileExists: ts.sys.fileExists,
			readFile: ts.sys.readFile,
			getCurrentDirectory: () => this.options.project_root,
			getDirectories: ts.sys.getDirectories,
			getCanonicalFileName: (fileName) =>
				ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase(),
			getNewLine: () => ts.sys.newLine,
			useCaseSensitiveFileNames: () => true,
			trace: (s) => console.log('debug', s),
			// getDefaultLibFileName: ts.getDefaultLibFilePath,
			getSourceFile: ts.sys.getSourceFile,
			maxNodeModuleJsDepth: 3
		};
	}
}

//

/**
 * @class TypeExtractor
 * Une classe pour extraire les clés d'un type ou d'une interface depuis un fichier.
 */
class TypeExtractor {
	/**
	 * @typedef {Object} BuildTypesOptions
	 * @property {string} project_root - The root directory of the library.
	 * @property {string} lib_parse - The library parse value.
	 * @property {string} dts_output_dir - The directory for the dts files.
	 * @property {string} component_type_filename - The file type name.
	 * @property {boolean} svelte_ignore - The svelte ignore value.
	 * @property {string} svelte_extension - The svelte extension.
	 * @property {boolean} keep_comments - The keep comments value.
	 */

	/**
	 * Represents a BuildTypes object.
	 * @type {BuildTypesOptions} options - The options for the BuildTypes.
	 */
	options = {
		project_root: 'src/',
		lib_parse: 'src/lib/',
		dts_output_dir: 'typesAOO', // target directory for generated d.ts files
		component_type_filename: 'types.ts', // the name of the ts file to parse in the directory
		svelte_ignore: ['**/*.{demo,preview,wip,js}.svelte'], // files to ignore
		svelte_extension: '.svelte', // extension of svelte files
		keep_comments: true // keep comments in the generated d.ts files
	};

	/**
	 * Represents a BuildTypes object.
	 * @constructor
	 * @param {BuildTypesOptions} options - The options for the BuildTypes.
	 */
	constructor(args) {
		this.options = { ...this.options, ...args };
		this.aliases = this.#get_aliases();
	}

	/**
	 * Builds the types for Svelte components having a types.ts in the same directory.
	 */
	buildTypes() {
		fs.ensureDirSync(path.dirname(this.options.dts_output_dir));
		const filesToParse = this.#get_root_files();
		filesToParse.forEach((file) => {
			const dir = path.dirname(file);
			const tsFilePath = path.join(dir, this.options.component_type_filename);
			const moduleName = `${path.basename(file, this.options.svelte_extension)}Props`;
			if (fs.existsSync(tsFilePath)) {
				const dtsCode = this.extractTypeKeys(tsFilePath, moduleName); 
			}
		});
	}

	/**
	 * Extrait les clés d'un type ou d'une interface depuis un fichier.
	 * @param {string} fileName - Le nom du fichier.
	 * @param {string} typeName - Le nom du type ou de l'interface à extraire.
	 * @returns {Array<Object>} Un tableau d'objets représentant les clés avec leur nom, type, et résolution.
	 */
	extractTypeKeys(fileName, typeName) {
		const sourceFile = this._getSourceFile(fileName);
		const typeChecker = this._getTypeChecker(sourceFile);

		const type = this._getTypeByName(typeChecker, sourceFile, typeName);
		if (!type) {
			throw new Error(`Type or interface ${typeName} not found in file ${fileName}`);
		}

		return this._extractKeys(typeChecker, type);
	}

	/**
	 * Lit et parse le fichier source TypeScript.
	 * @param {string} fileName - Le nom du fichier.
	 * @returns {ts.SourceFile} Le fichier source analysé.
	 */
	_getSourceFile(fileName) {
		const fileContent = fs.readFileSync(fileName, 'utf8');
		return ts.createSourceFile(fileName, fileContent, ts.ScriptTarget.Latest, true);
	}

	/**
	 * Crée et retourne un type checker.
	 * @param {ts.SourceFile} sourceFile - Le fichier source.
	 * @returns {ts.TypeChecker} Le type checker.
	 */
	_getTypeChecker(sourceFile) {
		const program = ts.createProgram([sourceFile.fileName], {
			allowJs: true,
			skipLibCheck: true
		});
		return program.getTypeChecker();
	}

	/**
	 * Trouve et retourne un type par son nom.
	 * @param {ts.TypeChecker} typeChecker - Le type checker.
	 * @param {ts.SourceFile} sourceFile - Le fichier source.
	 * @param {string} typeName - Le nom du type ou de l'interface.
	 * @returns {ts.Type | null} Le type trouvé ou null.
	 */
	_getTypeByName(typeChecker, sourceFile, typeName) {
		let foundType = null;

		const visitNode = (node) => { 
			if (node?.name?.text === typeName) {
				const symbol = typeChecker.getSymbolAtLocation(node.name);
				if (symbol) { 
					foundType = typeChecker.getDeclaredTypeOfSymbol(symbol);
				}
			}
			ts.forEachChild(node, visitNode);
		};

		visitNode(sourceFile);

		return foundType;
	}

	/**
	 * Extrait les clés du type/interface.
	 * @param {ts.TypeChecker} typeChecker - Le type checker.
	 * @param {ts.Type} type - Le type ou l'interface.
	 * @returns {Array<Object>} Un tableau d'objets représentant les clés avec leur nom, type, et résolution.
	 */
	_extractKeys(typeChecker, type) {
		const keys = [];

		type.getProperties().forEach((symbol) => {
			const keyName = symbol.getName();
			const keyType = typeChecker.getTypeOfSymbolAtLocation(
				symbol,
				symbol.valueDeclaration || symbol.declarations[0]
			);
			const keyTypeString = typeChecker.typeToString(keyType);
			const keyResolution = this._getTypeResolution(typeChecker, keyType);

			keys.push({
				name: keyName,
				type: keyTypeString,
				resolution: keyResolution
			});
		});

		return keys;
	}

	/**
	 * Résout le type.
	 * @param {ts.TypeChecker} typeChecker - Le type checker.
	 * @param {ts.Type} type - Le type à résoudre.
	 * @returns {string} La résolution du type.
	 */
	_getTypeResolution(typeChecker, type) {
		if (type.isClassOrInterface()) {
			const symbol = type.getSymbol();
			if (symbol) {
				const declarations = symbol.getDeclarations();
				if (declarations && declarations.length > 0) {
					const declarationFile = declarations[0].getSourceFile().fileName;
					return `imported from ${declarationFile}`;
				}
			}
		}
		return typeChecker.typeToString(type);
	}

	/**
	 * Gets the aliases for resolving paths.
	 *
	 * @returns {Object} - The aliases object.
	 */
	#get_aliases() {
		const test = Array.from(
			Object.entries(config.kit?.alias ?? {}).map(([key, value]) => {
				return [key, path.resolve(value)];
			}) ?? {}
		);
		return {
			$lib: path.resolve(config.kit?.files?.lib ?? 'src/lib'),
			...Object.fromEntries(test)
		};
	}

	/**
	 * Gets the root files for the TypeScript program.
	 *
	 * @returns {string[]} - The root files for the TypeScript program.
	 */
	#get_root_files() {
		const svelteFiles = glob.sync(
			path.resolve(this.options.lib_parse, `**/*${this.options.svelte_extension}`)
		);
		const filesToParse = svelteFiles.filter(
			(file) => !micromatch.some(file, this.options.svelte_ignore)
		);

		return filesToParse;
	}
}

const typeExtractor = new TypeExtractor({
	lib_parse: 'src/lib/base/avatar',
	dts_output_dir: 'typesAOO',
	component_type_filename: 'types.ts',
	svelte_ignore: ['**/*.{demo,preview,wip,js}.svelte']
});
// typeExtractor.buildTypes();

//
const buildTypes = new BuildTypes({
	lib_parse: 'src/lib/base/avatar',
	dts_output_dir: 'typesAOO',
	component_type_filename: 'types.ts',
	svelte_ignore: ['**/*.{demo,preview,wip,js}.svelte']
});
buildTypes.buildTypes();
