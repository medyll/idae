import { Project, SyntaxKind, SourceFile, ImportDeclaration, Node, ts } from 'ts-morph';
import { parse } from 'svelte/compiler';
import { glob } from 'glob';
import * as path from 'path';
import * as fs from 'fs';

const resolvedTypesCache = new Map<string, AnalyzedFile>();

interface AnalyzedFile {
	filePath: string;
	fileName: string;
	ts: TypeMetadata[];
	comments: Comment[];
	jsDocs: JSDoc[];
	imports: ResolvedImport[];
}

interface TypeMetadata {
	name: string;
	text: string;
	docs: JSDoc[];
	properties: {
		name: string;
		mandatory: boolean;
		comments: string;
		jsDocs: string;
	}[];
}

interface Comment {
	text: string;
	position: number;
}

interface JSDoc {
	comment: string;
	tags: JSDocTag[];
}

interface JSDocTag {
	tagName: string;
	tagText: string;
}

interface ResolvedImport {
	moduleSpecifier: string;
	namedImports: string[];
	defaultImport: string | null;
	resolvedTypes?: AnalyzedFile;
}

export class TypeScriptAnalyzer {
	private project: Project;
	#libRoot = 'lib';
	#libTs = '$lib';
	#libPath: string;
	#cssNamedExport = true;
	#ignorePatterns: string[] = [];

	#srcPath = 'src';
	#srcLibPath: string;

	constructor(tsConfigFilePath: string, ignorePatterns: string[] = []) {
		console.log(`Initializing TypeScriptAnalyzer with tsConfigFilePath: ${tsConfigFilePath}`);
		this.project = new Project({ tsConfigFilePath });
		this.#ignorePatterns = ignorePatterns;

		this.#srcLibPath = path.join(this.#srcPath, this.#libRoot);
		this.#libPath = path.join(process.cwd(), this.#libRoot);

		console.log('libPath:', this.#libPath);
		console.log('srcLibPath:', this.#srcLibPath);
	}

	public analyzeFile(filePath: string): AnalyzedFile {
		if (filePath.endsWith('.svelte')) {
			return this.analyzeSvelteFile(filePath);
		} else {
			return this.analyzeTsFile(filePath);
		}
	}

	public analyzeTsFile(filePath: string): AnalyzedFile {
		console.log(`Analyzing TypeScript file: ${filePath}`);
		if (resolvedTypesCache.has(filePath)) {
			console.log(`Cache hit for file: ${filePath}`);
			return resolvedTypesCache.get(filePath)!;
		}

		let sourceFile = this.project.getSourceFile(filePath);
		if (!sourceFile) {
			console.log(`File not found in project: ${filePath}`);
			sourceFile = this.project.addSourceFileAtPath(filePath);
			if (!sourceFile) {
				throw new Error(`File not found: ${filePath}`);
			}
		}

		const { types, comments, jsDocs } = this.extractMetadata(sourceFile);
		const imports = this.resolveImportedTypes(sourceFile);

		const analyzedFile: AnalyzedFile = {
			filePath,
			fileName: path.basename(filePath),
			ts: types,
			comments,
			jsDocs,
			imports
		};
		resolvedTypesCache.set(filePath, analyzedFile);

		console.log(`Finished analyzing TypeScript file: ${filePath}`);
		return analyzedFile;
	}

	private analyzeSvelteFile(filePath: string): AnalyzedFile {
		console.log(`Analyzing Svelte file: ${filePath}`);

		// Read the content of the Svelte file
		const fileContent = fs.readFileSync(filePath, 'utf-8');

		// Use a regular expression to extract the content of the <script lang="ts"> tag
		const scriptMatch = fileContent.match(/<script\s+lang="ts">([\s\S]*?)<\/script>/);

		const types: TypeMetadata[] = [];
		const comments: Comment[] = [];
		const jsDocs: JSDoc[] = [];
		const imports: ResolvedImport[] = [];
		const extractedTypes: any[] = [];

		if (scriptMatch && scriptMatch[1]) {
			const scriptContent = scriptMatch[1];
			console.log(`Extracting script content from Svelte file: ${filePath}`);
			console.log({ scriptContent });

			// Create a TypeScript source file from the script content
			const sourceFile = this.project.createSourceFile(`${filePath}.ts`, scriptContent, {
				overwrite: true
			});

			// Extract metadata from the TypeScript source file
			const metadata = this.extractMetadata(sourceFile);
			types.push(...metadata.types);
			comments.push(...metadata.comments);
			jsDocs.push(...metadata.jsDocs);
			extractedTypes.push(...metadata.extractedTypes);
			imports.push(...this.resolveImportedTypes(sourceFile));
		} else {
			console.warn(`No <script lang="ts"> content found in Svelte file: ${filePath}`);
		}

		// Create the analyzed file object
		const analyzedFile: AnalyzedFile = {
			filePath,
			fileName: path.basename(filePath),
			ts: types,
			comments,
			jsDocs,
			imports
		};

		// Cache the analyzed file result
		resolvedTypesCache.set(filePath, analyzedFile);

		console.log(`Finished analyzing Svelte file: ${filePath}`);
		return analyzedFile;
	}

	public async analyzeDirectory(
		directoryPath: string,
		options: { ignorePatterns?: string[] } = {}
	): Promise<AnalyzedFile[]> {
		console.log(`Analyzing directory: ${directoryPath}`);
		const resolvedPath = path.resolve(this.#srcLibPath, directoryPath);
		console.log(`Resolved directory path: ${resolvedPath}`);

		const ignorePatterns = options.ignorePatterns ?? this.#ignorePatterns;
		// commented for test purpose : {ts,tsx,js,jsx,svelte}
		const files = await glob(`**/*.svelte`, {
			cwd: resolvedPath,
			absolute: true,
			nodir: true,
			ignore: ignorePatterns
		});

		console.log('Source files found:', files);

		const analyzedFiles: AnalyzedFile[] = [];
		for (const file of files) {
			try {
				console.log(`Analyzing file in directory: ${file}`);
				const analyzedFile = this.analyzeFile(file);
				analyzedFiles.push(analyzedFile);
			} catch (error) {
				console.error(`Error analyzing file ${file}:`, error);
			}
		}

		return analyzedFiles;
	}

	private extractMetadata(sourceFile: SourceFile): {
		types: TypeMetadata[];
		comments: Comment[];
		jsDocs: JSDoc[];
		extractedTypes: any[];
	} {
		console.log(`Extracting metadata from source file: ${sourceFile.getFilePath()}`);
		const types: TypeMetadata[] = [];
		const comments: Comment[] = [];
		const jsDocs: JSDoc[] = [];
		const extractedTypes: any[] = [];

		sourceFile.forEachDescendant((node) => {
			// Extract types (interfaces, type aliases, enums, classes)
			if (
				Node.isInterfaceDeclaration(node) ||
				Node.isTypeAliasDeclaration(node) ||
				Node.isEnumDeclaration(node) ||
				Node.isClassDeclaration(node)
			) {
				const typeName = node.getName() || 'Anonymous';
				const typeText = node.getText();
				const typeDocs =
					node.getJsDocs?.().map((doc) => ({
						comment: doc.getText().trim(),
						tags:
							doc.getTags?.().map((tag) => ({
								tagName: tag.getTagName(),
								tagText: tag.getText()
							})) || []
					})) || [];

				const properties: { name: string; mandatory: boolean; comments: string; jsDocs: string }[] =
					[];

				// Check if keys are optional or required
				if (Node.isInterfaceDeclaration(node)) {
					node.getMembers().forEach((member) => {
						const memberName = member.getName();
						const isOptional = member.hasQuestionToken();
						const memberComments = member
							.getLeadingCommentRanges()
							.map((comment) => comment.getText())
							.join('\n');
						const memberJsDocs = member
							.getJsDocs()
							.map((jsDoc) => jsDoc.getText())
							.join('\n');
						properties.push({
							name: memberName,
							mandatory: !isOptional,
							comments: memberComments,
							jsDocs: memberJsDocs
						});
					});
				} else if (Node.isTypeAliasDeclaration(node)) {
					const typeNode = node.getTypeNode();
					if (Node.isTypeLiteral(typeNode)) {
						typeNode.getMembers().forEach((member) => {
							const memberName = member.getName();
							const isOptional = member.hasQuestionToken();
							const memberComments = member
								.getLeadingCommentRanges()
								.map((comment) => comment.getText())
								.join('\n');
							const memberJsDocs = member
								.getJsDocs()
								.map((jsDoc) => jsDoc.getText())
								.join('\n');
							properties.push({
								name: memberName,
								mandatory: !isOptional,
								comments: memberComments,
								jsDocs: memberJsDocs
							});
						});
					}
				}

				types.push({ name: typeName, text: typeText, docs: typeDocs, properties });
			}

			// Extract comments
			const leadingComments = node.getLeadingCommentRanges();
			leadingComments.forEach((comment) => {
				comments.push({ text: comment.getText(), position: comment.getPos() });
			});

			// Extract JSDoc
			const jsDoc = Node.isJSDocable(node) ? node.getJsDocs()[0] : undefined;
			if (jsDoc) {
				const tags =
					jsDoc.getTags?.().map((tag) => ({
						tagName: tag.getTagName(),
						tagText: tag.getText()
					})) || [];
				jsDocs.push({ comment: jsDoc.getText().trim(), tags });
			}

			// Extract Svelte specific metadata
			if (Node.isVariableDeclaration(node)) {
				const variableName = node.getName();
				const extractedType = this.extractTypeForType(variableName, sourceFile);
				extractedTypes.push({ name: variableName, type: extractedType });
			}

			// Extract specific types
			/* 			if (Node.isVariableDeclaration(node)) {
				const variableName = node.getName();
				const extractedType = this.extractTypeForType(variableName, sourceFile);
				extractedTypes.push({ name: variableName, type: extractedType });
			} */
			if (Node.isVariableStatement(node)) {
				const declarationList = node.getDeclarationList();
				declarationList.getDeclarations().forEach((declaration) => {
					if (declaration.getName() === 'ExampleProps') {
						const examplePropsText = this.extractTypeForType('ExampleProps', sourceFile);
						types.push({
							name: 'ExampleProps',
							text: examplePropsText || '',
							docs: [],
							properties: []
						});
					}
				});
			}

			if (Node.isObjectBindingPattern(node)) {
				node.getElements().forEach((element) => {
					const propName = element.getName();
					const propText = element.getText();
					const propComments = element
						.getLeadingCommentRanges()
						.map((comment) => comment.getText())
						.join('\n');
					const propJsDocs = Node.isJSDocable(element)
						? element
								.getJsDocs()
								.map((jsDoc) => jsDoc.getText())
								.join('\n')
						: '';
					types.push({
						name: propName,
						text: propText,
						docs: [],
						properties: [
							{
								name: propName,
								mandatory: true,
								comments: propComments,
								jsDocs: propJsDocs
							}
						]
					});
				});
			}
		});

		// Prioritize ExampleProps details from types
		const examplePropsType = types.find((type) => type.name === 'ExampleProps');
		if (examplePropsType) {
			examplePropsType.properties.forEach((prop) => {
				const existingProp = types.find((type) => type.name === prop.name);
				if (existingProp) {
					existingProp.properties = [prop];
				} else {
					types.push({
						name: prop.name,
						text: prop.text,
						docs: [],
						properties: [prop]
					});
				}
			});
		}

		console.log(`Finished extracting metadata from source file: ${sourceFile.getFilePath()}`);
		return { types, comments, jsDocs, extractedTypes };
	}

	private resolveImportedTypes(sourceFile: SourceFile): ResolvedImport[] {
		console.log(`Resolving imported types for source file: ${sourceFile.getFilePath()}`);
		const imports: ResolvedImport[] = [];

		sourceFile.getImportDeclarations().forEach((importDecl: ImportDeclaration) => {
			const moduleSpecifier = importDecl.getModuleSpecifierValue();
			const namedImports = importDecl.getNamedImports().map((imp) => imp.getName());
			const defaultImport = importDecl.getDefaultImport()?.getText() || null;

			const resolvedModule = this.project.getSourceFile(moduleSpecifier);
			if (resolvedModule) {
				const resolvedTypes = this.analyzeFile(resolvedModule.getFilePath());
				imports.push({ moduleSpecifier, namedImports, defaultImport, resolvedTypes });
			} else {
				console.warn(`Module not found: ${moduleSpecifier}`);
			}
		});

		console.log(`Finished resolving imported types for source file: ${sourceFile.getFilePath()}`);
		return imports;
	}

	/**
	 * Extracts the type for a given type name.
	 * @param {string} typeName - The name of the type to extract.
	 * @returns {string | undefined} - The extracted type text or undefined if not found.
	 */
	private extractTypeForType(typeName: string, sourceFile: SourceFile): string | undefined {
		const sourceFiles = this.project.getSourceFiles();
		let foundType: string | undefined;
		sourceFile.forEachDescendant((node) => {
			if (ts.isVariableStatement(node as ts.Node)) {
				const declaration = (node as ts.VariableStatement).declarationList.declarations[0];
				if (ts.isVariableDeclaration(declaration) && declaration.name.getText() === typeName) {
					const type = declaration.type;
					if (type) {
						foundType = type.getText();
					}
				}
			}
		});
		if (foundType) {
			return foundType;
		}
		return undefined;
	}
}
