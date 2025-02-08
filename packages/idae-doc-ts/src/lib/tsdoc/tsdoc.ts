import { Project, SyntaxKind, SourceFile, ImportDeclaration, Node } from 'ts-morph';
import { parse } from 'svelte/compiler';

const resolvedTypesCache = new Map<string, AnalyzedFile>();

interface AnalyzedFile {
	filePath: string;
	types: TypeMetadata[];
	comments: Comment[];
	jsDocs: JSDoc[];
	imports: ResolvedImport[];
}

interface TypeMetadata {
	name: string;
	text: string;
	docs: JSDoc[];
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

	constructor(tsConfigFilePath: string) {
		this.project = new Project({ tsConfigFilePath });
	}

	public analyzeFile(filePath: string): AnalyzedFile {
		if (resolvedTypesCache.has(filePath)) {
			return resolvedTypesCache.get(filePath)!;
		}

		const sourceFile = this.project.getSourceFile(filePath);
		if (!sourceFile) {
			if (filePath.endsWith('.svelte')) {
				return this.analyzeSvelteFile(filePath);
			}
			throw new Error(`File not found: ${filePath}`);
		}

		const { types, comments, jsDocs } = this.extractMetadata(sourceFile);
		const imports = this.resolveImportedTypes(sourceFile);

		const analyzedFile: AnalyzedFile = { filePath, types, comments, jsDocs, imports };
		resolvedTypesCache.set(filePath, analyzedFile);

		return analyzedFile;
	}

	private analyzeSvelteFile(filePath: string): AnalyzedFile {
		const fileContent = require('fs').readFileSync(filePath, 'utf-8');
		const { ast } = parse(fileContent);

		const types: TypeMetadata[] = [];
		const comments: Comment[] = [];
		const jsDocs: JSDoc[] = [];
		const imports: ResolvedImport[] = [];

		// Extract script content from Svelte file
		const script = ast.instance ? ast.instance.content : null;
		if (script) {
			const sourceFile = this.project.createSourceFile(`${filePath}.ts`, script.content, {
				overwrite: true
			});
			const metadata = this.extractMetadata(sourceFile);
			types.push(...metadata.types);
			comments.push(...metadata.comments);
			jsDocs.push(...metadata.jsDocs);
			imports.push(...this.resolveImportedTypes(sourceFile));
		}

		const analyzedFile: AnalyzedFile = { filePath, types, comments, jsDocs, imports };
		resolvedTypesCache.set(filePath, analyzedFile);

		return analyzedFile;
	}

	public analyzeDirectory(directoryPath: string): AnalyzedFile[] {
		const sourceFiles = this.project.addSourceFilesAtPaths(`${directoryPath}/**/*.{ts,svelte}`);
		return sourceFiles.map((sourceFile) => this.analyzeFile(sourceFile.getFilePath()));
	}

	private extractMetadata(sourceFile: SourceFile): {
		types: TypeMetadata[];
		comments: Comment[];
		jsDocs: JSDoc[];
	} {
		const types: TypeMetadata[] = [];
		const comments: Comment[] = [];
		const jsDocs: JSDoc[] = [];

		sourceFile.forEachDescendant((node) => {
			if (
				Node.isInterfaceDeclaration(node) ||
				Node.isTypeAliasDeclaration(node) ||
				Node.isEnumDeclaration(node) ||
				Node.isClassDeclaration(node)
			) {
				const typeName = node.getName() || 'Anonymous';
				const typeText = node.getText();
				const typeDocs = node.getJsDocs().map((doc) => ({
					comment: doc.getInnerText().trim(),
					tags: doc.getTags().map((tag) => ({
						tagName: tag.getTagName(),
						tagText: tag.getText()
					}))
				}));

				types.push({ name: typeName, text: typeText, docs: typeDocs });
			}

			const leadingComments = node.getLeadingCommentRanges();
			leadingComments.forEach((comment) => {
				comments.push({ text: comment.getText(), position: comment.getPos() });
			});

			const jsDoc = (node as any).getJsDocs()[0];
			if (jsDoc) {
				const tags = jsDoc.getTags().map((tag) => ({
					tagName: tag.getTagName(),
					tagText: tag.getText()
				}));
				jsDocs.push({ comment: jsDoc.getInnerText().trim(), tags });
			}
		});

		return { types, comments, jsDocs };
	}

	private resolveImportedTypes(sourceFile: SourceFile): ResolvedImport[] {
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

		return imports;
	}
}
