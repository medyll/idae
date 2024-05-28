import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import micromatch from 'micromatch';
import ts from 'typescript';
import { parse } from 'svelte/compiler';
import { svelte as sveltePlugin } from '@sveltejs/vite-plugin-svelte';
import config from './svelte.config.js';
import { loadConfigFromFile } from 'vite';
import { svelte2tsx, emitDts } from 'svelte2tsx';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
class blabla {
	/**
	 *
	 * @param {{
	 * input: string,
	 * output: string,
	 * tsconfig: string,
	 * svelte_extension: string,
	 * }} args
	 */
	constructor(args) {
		if (args.output && args.input) {
			args.output = path.resolve(args.output);
			args.input = path.resolve(args.input);
			this.set_options(args);
		}
	}

	async set_options(args) {
		const config = await loadConfigFromFile({ command: 'serve' }, './svelte.config.js');

		const cwd = process.cwd();
		const tmp = path.join(args.output, '__tmp');
		this.options = {
			cwd,
			config,
			tmp,
			input: config.kit?.files?.lib ?? 'src/lib',
			tsconfig: './tsconfig.json',
			svelte_extension: '.svelte',
			svelte_ignore: [],
			alias: this.#get_aliases(),
			...args
		};

		console.log(this.options);

		this.emit_dts();
	}

	async emit_dts() {
		await emitDts({
			libRoot: path.resolve(this.options.input),
			svelteShimsPath: require.resolve('svelte2tsx/svelte-shims-v4.d.ts'),
			declarationDir: path.relative(this.options.cwd, this.options.tmp)
		});

		// list directory
		for (const file of this.get_root_files(this.options.tmp)) {
			console.log(path.join(this.options.tmp, file));
			continue;
			let content = fs.readFileSync(path.join(this.options.tmp, file), 'utf8');
			content = content.replace(/from\s+('|")([^"';,]+?)\1/g, this.resolve_aliases);
			content = content.replace(/import\s*\(\s*('|")([^"';,]+?)\1\s*\)/g, this.resolve_aliases);
			// write(path.join(output, file), content);
		}
	}

	get_root_files(src) {
		const svelteFiles = glob.sync(path.resolve(src, `**/*${this.options.svelte_extension}`));
		const filesToParse = svelteFiles.filter(
			(file) => !micromatch.some(file, this.options.svelte_ignore)
		);

		path.relative(this.options.cwd, this.options.tmp);

		return filesToParse;
	}

	/**
	 * Resolves aliases in a given path or alias.
	 *
	 * @param {string} pathOrAlias - The path or alias to resolve.
	 * @returns {string} - The resolved path.
	 */
	resolve_aliases(match, _, pathOrAlias) {
		for (const [alias, value] of Object.entries(this.options.alias)) {
			if (pathOrAlias.startsWith(alias)) {
				return path.join(pathOrAlias.replace(alias, value));
			}
		}
		return match;
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
			$lib: path.resolve(this.options?.config.kit?.files?.lib ?? 'src/lib'),
			...Object.fromEntries(test)
		};
	}
}

const ssss = new blabla({
	input: 'src/lib/',
	output: 'typesAOO',
	component_type_filename: 'types.ts',
	svelte_ignore: ['**/*.{demo,preview,wip,js}.svelte']
});

// sveltePlugin
function doer(does) {
	return {
		/**
		 * @param {string} content - The content for the source file
		 * @param {string | undefined} filePath - The path to the TypeScript file. Optional
		 */
		fromContent: (content, filePath = '') => {
			return does(HelperTs.getSourceFile(filePath, content));
		},
		/**
		 * @param {string} tsPath - The path to the TypeScript file.
		 */
		fromFilePath: (tsPath) => {
			return does(HelperTs.getSourceFile(tsPath));
		},
		/**
		 * @param {ts.SourceFile} sourceFile - The TypeScript source file.
		 */
		fromSourceFile: (sourceFile) => {
			return does(sourceFile);
		}
	};
}
export class HelperTs {
	/**
	 * Gets the TypeScript source file from a given file path, or from content
	 */
	ast = parse(test.code, {
		filename: fileName,
		dev: true
	});
	/**
	 *
	 * @param {string} input can be a sourceFile   a path or some content
	 * @param {string} declarationName can be an interface a type a class or an enum
	 */
	getTypedDeclarations(declarationName) {
		const does = (sourceFile) => {
			return this.#getTypeByName(sourceFile, declarationName);
		};

		if (!declaration) {
			throw new Error(`Type or interface ${declarationName} not found in file ${source.fileName}`);
		}

		return doer(does.bind(this));
	}

	/**
	 * Gets the TypeScript source file from a given file path, or from content
	 * @returns {fromContent: (content: string) => void, fromFilePath: (tsPath: string) => void, fromSourceFile: (sourceFile: ts.SourceFile) => void}
	 */
	get getTypeImportPaths() {
		/**
		 *
		 * @param {ts.SourceFile} sourceFile
		 */
		const does = (sourceFile, options = [ts.SyntaxKind.ImportDeclaration]) => {
			// node.importClause.isTypeOnly
			const imports = sourceFile.statements.filter(
				/** @param {ts.Node} node */
				(node) => options.includes(node.kind)
			);
		};
		return doer(does.bind(this));
	}

	/**
	 * Gets the TypeScript source file from a given file path, or from content
	 *
	 * @param {string} tsFilePath - The path to the TypeScript file. can be ''
	 * @param {string} content - The content for the source file
	 * @returns {ts.SourceFile} - The TypeScript source file.
	 */
	static getSourceFile(tsFilePath, content = '') {
		const fileContent =
			(fs.existsSync(tsFilePath) && fs.readFileSync(tsFilePath, 'utf8')) || undefined;
		return ts.createSourceFile(
			tsFilePath,
			(fileContent ?? '') + (content ?? ''),
			ts.ScriptTarget.Latest
		);
	}

	/**
	 * Crée et retourne un type checker.
	 * @param {ts.SourceFile} sourceFile - Le fichier source.
	 * @returns {ts.TypeChecker} Le type checker.
	 */
	#getTypeChecker(sourceFile) {
		const program = ts.createProgram([sourceFile.fileName], {
			allowJs: true,
			skipLibCheck: true
		});
		return program.getTypeChecker();
	}

	/**
	 * Trouve et retourne un type par son nom.
	 * @param {ts.SourceFile} sourceFile - Le fichier source.
	 * @param {string} typeName - Le nom du type ou de l'interface.
	 * @param {ts.TypeChecker | undefined} typeChecker - Le type checker.
	 * @returns {ts.Type | null} Le type trouvé ou null.
	 */
	#getTypeByName(sourceFile, typeName, typeChecker = undefined) {
		typeChecker = typeChecker || this.#getTypeChecker(sourceFile);
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
}

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
const buildTypes = new BuildTypes({
	lib_parse: 'src/lib/',
	dts_output_dir: 'typesAOO',
	component_type_filename: 'types.ts',
	svelte_ignore: ['**/*.{demo,preview,wip,js}.svelte']
});
// buildTypes.buildTypes();
