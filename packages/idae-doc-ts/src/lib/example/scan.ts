import { TypeScriptAnalyzer } from '$lib/tsdoc/tsdoc.js';

const ignorePatterns = ['**/*.test.ts', '**/*.spec.ts'];
const analyzer = new TypeScriptAnalyzer('../../tsconfig.json', ignorePatterns);
console.log('Starting directory analysis...');

const directoryPath = 'example/dir';

async function runAnalysis() {
	try {
		const directoryResult = await analyzer.analyzeDirectory(directoryPath, { ignorePatterns });
		console.log('Directory analysis result:', JSON.stringify(directoryResult, null, 2));
	} catch (error) {
		console.error('Error during directory analysis:', error);
	}
}

runAnalysis();
