// docs.js
import { glob } from 'glob';
import { readFile } from 'fs/promises';
import { parse } from 'svelte/compiler';
import ts from 'typescript';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

export class DocsProcessor {
    constructor(targetDir = './src/lib') {
        // --- Helper to get __dirname in ESM ---
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // --- Dynamically import svelte.config.js as an ESM module ---
        const svelteConfigPath = path.resolve(__dirname, '../../svelte.config.js');
        const svelteConfigUrl = pathToFileURL(svelteConfigPath);
        this.svelteConfig = (async () => (await import(svelteConfigUrl)).default)();

        // --- Extract alias map from svelte.config.js (kit.alias) ---
        this.ALIAS_MAP = {};
        this.targetDir = targetDir;
    }

    async init() {
        const svelteConfig = await this.svelteConfig;
        const aliasConfig = svelteConfig.kit?.alias || {};
        if (!aliasConfig.$lib) {
            aliasConfig.$lib = path.resolve('./src/lib');
        }
        this.ALIAS_MAP = aliasConfig;
    }

    // --- Fix resolveAlias to handle relative imports ---
    resolveAlias(importPath, fromFile = '') {
        for (const [alias, realPath] of Object.entries(this.ALIAS_MAP)) {
            if (importPath.startsWith(alias)) {
                const relPath = importPath.replace(alias, realPath);
                return path.resolve(path.dirname(fromFile), relPath);
            }
        }
        if (importPath.startsWith('.')) {
            return path.resolve(path.dirname(fromFile), importPath);
        }
        return importPath;
    }

    // --- Recursively extract the real interface name from a possibly generic type annotation ---
    extractPropsTypeFromTypeAnnotation(typeAnnotation) {
        if (
            !typeAnnotation ||
            !typeAnnotation.typeAnnotation ||
            (
                typeAnnotation.typeAnnotation.type !== 'TSTypeReference' &&
                typeAnnotation.typeAnnotation.type !== 'TypeReference'
            )
        ) {
            return null;
        }
        let typeRef = typeAnnotation.typeAnnotation;
        // Traverse generics: ExpandProps<XProps> => XProps
        while (typeRef.typeParameters && typeRef.typeParameters.params.length > 0) {
            const param = typeRef.typeParameters.params[0];
            if (param.type === 'TSTypeReference') {
                typeRef = param;
            } else if (param.typeName && param.typeName.name) {
                return param.typeName.name;
            } else if (param.name) {
                return param.name;
            } else {
                break;
            }
        }
        if (typeRef.typeName && typeRef.typeName.name) {
            return typeRef.typeName.name;
        }
        return null;
    }

    // --- Add logging to debug imports and type resolution ---
    findTypeImport(tsSource, typeName) {
        const sourceFile = ts.createSourceFile('temp.ts', tsSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        let found = null;
        function visit(node) {
            if (
                ts.isImportDeclaration(node) &&
                node.importClause &&
                node.importClause.namedBindings &&
                ts.isNamedImports(node.importClause.namedBindings)
            ) {
                for (const element of node.importClause.namedBindings.elements) {
                    if (element.name.text === typeName) {
                        found = node.moduleSpecifier.text;
                        console.log(`Found import for type '${typeName}': ${found}`); // Log the found import
                    }
                }
            }
            ts.forEachChild(node, visit);
        }
        visit(sourceFile);
        if (!found) {
            console.log(`No import found for type '${typeName}'`); // Log if no import is found
        }
        return found;
    }

    // --- Update file resolution logic in resolveType ---
    async resolveType(typeStr, tsSource, fromFile, visited = new Set()) {
        console.log(`Resolving type: ${typeStr}`); // Log the type being resolved

        // If it's a primitive, union, or already a literal, return as is
        if (!typeStr.includes('[') && !typeStr.includes('.') && !typeStr.includes('|')) {
            console.log(`Primitive or literal type resolved: ${typeStr}`); // Log resolved primitive type
            return typeStr;
        }

        // Handle ElementProps["levels"]
        const match = typeStr.match(/^([\w]+)\["([^"]+)"\]$/);
        if (match) {
            const [_, interfaceName, propName] = match;
            console.log(`Resolving indexed type: ${interfaceName}["${propName}"]`); // Log indexed type
            let interfaceSource = tsSource;
            let importPath = this.findTypeImport(tsSource, interfaceName);
            if (importPath) {
                const resolved = this.resolveAlias(importPath, fromFile);
                console.log(`Resolved import path for '${interfaceName}': ${resolved}`); // Log resolved path
                const fileToTry = [resolved.replace('.js', '.ts'), resolved + '.ts', resolved + '.d.ts']; // Correctly replace .js with .ts
                for (const filePath of fileToTry) {
                    try {
                        interfaceSource = await readFile(filePath, 'utf-8');
                        console.log(`Successfully read file: ${filePath}`); // Log successful file read
                        break;
                    } catch (err) {
                        console.log(`Failed to read file: ${filePath}, Error: ${err.message}`); // Log file read failure
                    }
                }
            }

            const sourceFile = ts.createSourceFile('temp.ts', interfaceSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
            let propType = null;
            function visit(node) {
                if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
                    for (const member of node.members) {
                        if (ts.isPropertySignature(member) && member.name.getText() === propName) {
                            propType = member.type ? member.type.getText() : null;
                            console.log(`Found property type for '${propName}': ${propType}`); // Log found property type
                        }
                    }
                } else if (ts.isEnumDeclaration(node) && node.name.text === interfaceName) {
                    propType = node.members.map(member => `'${member.name.getText()}'`).join(' | ');
                    console.log(`Resolved enum '${interfaceName}' to: ${propType}`); // Log resolved enum
                }
                ts.forEachChild(node, visit);
            }
            visit(sourceFile);

            if (propType && !visited.has(`${interfaceName}.${propName}`)) {
                visited.add(`${interfaceName}.${propName}`);
                return await this.resolveType(propType, interfaceSource, fromFile, visited);
            }
            return propType || typeStr;
        }

        // Handle union types and enums
        if (typeStr.includes('|')) {
            console.log(`Union type resolved: ${typeStr}`); // Log resolved union type
            return typeStr.split('|').map(part => part.trim()).join(' | ');
        }

        // Handle direct enum resolution
        const enumMatch = typeStr.match(/^keyof typeof ([\w]+)$/);
        if (enumMatch) {
            const [_, enumName] = enumMatch;
            console.log(`Resolving enum type: keyof typeof ${enumName}`); // Log enum type resolution
            const importPath = this.findTypeImport(tsSource, enumName);
            if (importPath) {
                const resolved = this.resolveAlias(importPath, fromFile);
                console.log(`Resolved import path for enum '${enumName}': ${resolved}`); // Log resolved path for enum
                const fileToTry = [resolved.replace('.js', '.ts'), resolved + '.ts', resolved + '.d.ts']; // Correctly replace .js with .ts
                for (const filePath of fileToTry) {
                    try {
                        const enumSource = await readFile(filePath, 'utf-8');
                        console.log(`Successfully read file for enum '${enumName}': ${filePath}`); // Log successful file read for enum
                        const enumFile = ts.createSourceFile('temp.ts', enumSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
                        let enumValues = null;
                        function visitEnum(node) {
                            if (ts.isEnumDeclaration(node) && node.name.text === enumName) {
                                enumValues = node.members.map(member => `'${member.name.getText()}'`).join(' | ');
                                console.log(`Resolved enum '${enumName}' to: ${enumValues}`); // Log resolved enum values
                            }
                            ts.forEachChild(node, visitEnum);
                        }
                        visitEnum(enumFile);
                        if (enumValues) return enumValues;
                    } catch (err) {
                        console.log(`Failed to read file for enum '${enumName}': ${filePath}, Error: ${err.message}`); // Log file read failure for enum
                    }
                }
            }
        }

        console.log(`Type resolution failed for: ${typeStr}`); // Log failed type resolution
        return typeStr;
    }

    async resolveTypeWithCompiler(typeStr, tsSource, fromFile) {
        const program = ts.createProgram({
            rootNames: [fromFile],
            options: {
                target: ts.ScriptTarget.ESNext,
                module: ts.ModuleKind.ESNext,
                strict: true
            }
        });

        const checker = program.getTypeChecker();
        const sourceFile = program.getSourceFile(fromFile);

        if (!sourceFile) {
            console.error(`Source file not found: ${fromFile}`);
            return typeStr;
        }

        let resolvedType = typeStr;

        function visit(node) {
            if (ts.isTypeAliasDeclaration(node) && node.name.text === typeStr) {
                const type = checker.getTypeAtLocation(node);
                resolvedType = checker.typeToString(type);
            } else if (ts.isTypeReferenceNode(node) && node.typeName.getText() === 'ExpandProps') {
                const typeArguments = node.typeArguments;
                if (typeArguments && typeArguments.length === 1) {
                    const innerType = checker.getTypeFromTypeNode(typeArguments[0]);
                    resolvedType = checker.typeToString(innerType);
                }
            }
            ts.forEachChild(node, visit);
        }

        ts.forEachChild(sourceFile, visit);

        if (resolvedType === typeStr) {
            console.warn(`Failed to resolve type: ${typeStr}`);
        } else {
            console.log(`Resolved type: ${typeStr} -> ${resolvedType}`);
        }

        return resolvedType;
    }

    async resolveImportedType(typeStr, tsSource, fromFile) {
        const importPath = this.findTypeImport(tsSource, typeStr);
        if (!importPath) {
            console.warn(`No import found for type '${typeStr}' in file '${fromFile}'`);
            return null; // Return null explicitly if the import path is not found
        }

        const resolvedPath = this.resolveAlias(importPath, fromFile);
        const fileToTry = [
            resolvedPath.replace('.js', '.ts'),
            resolvedPath,
            resolvedPath.replace('.js', '.d.ts')
        ];

        let iter = 0;
        // 
        for (const filePath of fileToTry) {
            iter ++;
            try {
                const importedSource = await readFile(filePath, 'utf-8');
                const sourceFile = ts.createSourceFile('temp.ts', importedSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

                let resolvedType = null;
                function visit(node) {
                    if (ts.isTypeAliasDeclaration(node) && node.name.text === typeStr) {
                        resolvedType = node.type ? node.type.getText() : null;
                    } else if (ts.isInterfaceDeclaration(node) && node.name.text === typeStr) {
                        resolvedType = typeStr; // Return the interface name for further processing
                    }
                    ts.forEachChild(node, visit);
                }
                ts.forEachChild(sourceFile, visit);

                if (resolvedType) {
                    return resolvedType;
                }
            } catch (err) {
                if(iter === fileToTry.length) {
                    console.warn(`Failed to read or process file: ${filePath}, Error: ${err.message}`);
                }
            }
        }

        console.warn(`Failed to resolve imported type: ${typeStr}`);
        return typeStr;
    }

    // --- Extracts properties from a TypeScript interface in a source string, resolving index types ---
    async extractInterfaceProps(tsSource, interfaceName, fromFile) {
        const sourceFile = ts.createSourceFile('temp.ts', tsSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        const props = [];
        function visit(node) {
            if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
                for (const member of node.members) {
                    if (ts.isPropertySignature(member)) {
                        const name = member.name.getText();
                        let type = member.type ? member.type.getText() : 'any';
                        // We can't await here, so we push a promise for later resolution
                        props.push({ name, type, member, optional: !!member.questionToken });
                    }
                }
            }
            ts.forEachChild(node, visit);
        }
        visit(sourceFile);

        // Now resolve types asynchronously
        const resolvedProps = [];
        for (const prop of props) {
            const resolvedType = await this.resolveType(prop.type, tsSource, fromFile);
            const jsDoc = ts.getJSDocCommentsAndTags(prop.member)
                .map(doc => doc.comment)
                .filter(Boolean)
                .join(' ');
            resolvedProps.push({
                name: prop.name,
                type: resolvedType,
                optional: prop.optional,
                jsDoc
            });
        }
        return resolvedProps;
    }

    // --- Try to extract interface from current or imported files, resolving index types ---
    async getInterfaceProps(tsSource, interfaceName, fromFile) {
        let props = await this.extractInterfaceProps(tsSource, interfaceName, fromFile);
        if (props.length > 0) return props;

        // If not found, look for an import statement for this type
        const importPath = this.findTypeImport(tsSource, interfaceName);
        if (importPath) {
            // Resolve alias and file path
            let resolved = this.resolveAlias(importPath, fromFile);
            let fileToTry = [resolved, resolved + '.ts', resolved + '.d.ts', resolved];
            for (const filePath of fileToTry) {
                try {
                    const extSource = await readFile(filePath, 'utf-8');
                    props = await this.extractInterfaceProps(extSource, interfaceName, filePath);
                    if (props.length > 0) return props;
                } catch (e) {
                    // File does not exist, try next
                }
            }
        }
        return [];
    }

    // --- Main script logic ---
    async process() {

        const files = await glob(`${this.targetDir}/**/*.svelte`, { ignore: ['**/**.demo**','**/**.preview**'] });

        const results = {};

        for (const file of files) {
            const source = await readFile(file, 'utf-8');
            const componentName = path.basename(file, '.svelte');
            const ast = parse(source, { filename: file, modern: true });

            results[componentName] = {};
            console.log(`Processing component: ${componentName} in file: ${file}`); // Log component processing
            // Concatenate TypeScript code from both <script module> and <script>
            let tsSource = '';
            if (ast.module && ast.module.content) {
                tsSource += source.slice(ast.module.content.start, ast.module.content.end) + '\n';
            }
            if (ast.instance && ast.instance.content) {
                tsSource += source.slice(ast.instance.content.start, ast.instance.content.end);
            }

            // Find the $props() destructuring and its type annotation in the instance script
            let propsType = null;

            console.log(`Processing file: ${file}`); // Log the file being processed
            console.log(`TypeScript source: ${tsSource}`); // Log the TypeScript source extracted from the file
            console.log(`Props type detected: ${propsType}`); // Log the detected props type

            if (ast.instance && ast.instance.content && ast.instance.content.body) {
                for (const node of ast.instance.content.body) {
                    if (
                        node.type === 'VariableDeclaration' &&
                        node.declarations.length === 1
                    ) {
                        const decl = node.declarations[0];
                        if (
                            decl.init &&
                            decl.init.type === 'CallExpression' &&
                            decl.init.callee.name === '$props'
                        ) {
                            const typeAnnotation = decl.id.typeAnnotation;
                            propsType = this.extractPropsTypeFromTypeAnnotation(typeAnnotation);
                            if (propsType) break;
                        }
                    }
                }
            }

            let props = [];
            if (propsType) {
                // Tentative de résolution des types importés
                const resolvedImportedType = await this.resolveImportedType(propsType, tsSource, file);
                if (resolvedImportedType) {
                    propsType = resolvedImportedType;
                }

                props = await this.extractInterfaceProps(tsSource, propsType, file);
            }

            // Output
            console.log(`\nComponent: ${file}`);
            if (props.length === 0) {
                console.log('  (No exported props detected)');
            } else {
                props.forEach(prop =>{                     
                    results[componentName][prop.name] = {
                        name: prop.name,
                        type: prop.type,
                        optional: prop.optional,
                        jsDoc: prop.jsDoc
                    }
                  }  
                );
            }
 
            console.log(results);
        }

        return results;
    }
}

// Usage
(async () => {
    const processor = new DocsProcessor(process.argv[2] || './src/lib');
    await processor.init();
    const results = await processor.process();
    console.log(results);
})();
