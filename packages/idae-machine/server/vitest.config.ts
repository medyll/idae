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
	}
});
