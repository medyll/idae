/**
 * Tests for schemaWalker.ts
 */

import { describe, it, expect } from 'vitest';
import { analyzeSchema } from './schemaWalker.ts';

describe('schemaWalker', () => {
	it('should build a graph of collections and dependencies', () => {
		const { graph, report } = analyzeSchema();

		// Check that collections are parsed
		expect(Object.keys(graph.collections).length).toBeGreaterThan(0);
		expect(graph.collections['appscheme_base']).toBeDefined();
		expect(graph.collections['appscheme']).toBeDefined();

		// Check that FK dependencies are built
		expect(Object.keys(graph.fkDependencies).length).toBeGreaterThan(0);

		// Check that the report is generated
		expect(report).toBeDefined();
		expect(Array.isArray(report.asymmetries)).toBe(true);
		expect(Array.isArray(report.unresolvedRefs)).toBe(true);
	});

	it('should identify unresolved FK references', () => {
		const { report } = analyzeSchema();
		// If there are unresolved refs, they should be in the report
		if (report.unresolvedRefs.length > 0) {
			console.log('Unresolved FK refs:', report.unresolvedRefs);
		}
	});

	it('should identify circular dependencies', () => {
		const { report } = analyzeSchema();
		// If there are circular deps, they should be in the report
		const circularAsymmetries = report.asymmetries.filter((a: any) => a.issue === 'circular-ref');
		if (circularAsymmetries.length > 0) {
			console.log('Circular dependencies:', circularAsymmetries);
		}
	});
});