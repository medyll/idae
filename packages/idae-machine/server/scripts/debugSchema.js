/**
 * Script to debug schema analysis (FK asymmetries)
 */

import { analyzeSchema } from './src/lib/types/schemaWalker.js';

const { graph, report } = analyzeSchema();

console.log('=== Schema Analysis Report ===');
console.log(`Collections: ${Object.keys(graph.collections).length}`);
console.log(`FK Dependencies: ${Object.keys(graph.fkDependencies).length}`);

if (report.unresolvedRefs.length > 0) {
	console.log(`\n⚠ Unresolved FK Refs (${report.unresolvedRefs.length}):`);
	report.unresolvedRefs.forEach(ref => console.log(`  - ${ref}`));
}

if (report.asymmetries.length > 0) {
	console.log(`\n⚠ FK Asymmetries (${report.asymmetries.length}):`);
	report.asymmetries.forEach(a => {
		console.log(`  - ${a.sourceCollection}.${a.sourceField} → ${a.targetCollection}`);
		console.log(`    Issue: ${a.issue}`);
		console.log(`    Details: ${a.details}`);
	});
}

console.log('\n=== Graph Summary ===');
for (const [name, collection] of Object.entries(graph.collections)) {
	console.log(`${name}: ${Object.keys(collection.fks).length} FKs`);
}

console.log('\n=== Dependency Tree ===');
for (const [collection, deps] of Object.entries(graph.fkDependencies)) {
	if (deps.length > 0) {
		console.log(`${collection} → ${deps.join(', ')}`);
	}
}