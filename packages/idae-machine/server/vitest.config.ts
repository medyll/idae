import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
	resolve: {
		alias: {
			'$lib':                resolve(__dirname, '../src/lib'),
			// idae-router only exports under 'svelte' condition — bypass exports check in node tests
			'@medyll/idae-router': resolve(__dirname, '../node_modules/@medyll/idae-router/dist/index.js'),
		},
	},
	test: {
		globals:          true,
		environment:      'node',
		include:          ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles:       ['src/__tests__/setup.ts'],
		globalTeardown:   'src/__tests__/teardown.ts',
		// FS-touching suites (files.test / image.test) share the org 'vitest' upload root;
		// parallel file execution races on the same dirs → order-dependent flaky deletes.
		// Serialize test files. Suite is ~8s, determinism > a few saved seconds for a gate.
		fileParallelism:  false,
		// mongodb-memory-server spawns a real mongod on first use; that startup alone
		// blows past the 5s default and made bootstrap/demo-roundtrip fail at random.
		// hookTimeout matters as much as testTimeout here: the spawn happens in
		// beforeAll, and hooks have their own (10s) budget.
		testTimeout:      30000,
		hookTimeout:      30000,
	}
});
