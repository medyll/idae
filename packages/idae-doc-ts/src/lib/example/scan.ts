import { TypeScriptAnalyzer } from '$lib/tsdoc/tsdoc.js';

const analyzer = new TypeScriptAnalyzer('tsconfig.json');
const result = analyzer.analyzeFile('./example.ts');
console.log(JSON.stringify(result, null, 2));

const directoryResult = analyzer.analyzeDirectory('./dir');
console.log(JSON.stringify(directoryResult, null, 2));
