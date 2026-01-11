import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
		globals: true,
		environment: 'node',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			exclude: [
				'node_modules/',
				'dist/',
				'**/*.d.ts',
				'**/*.config.*',
				'**/mockData.ts',
				'tests/fixtures/**',
				'tests/helpers/**'
			],
			lines: 80,
			functions: 80,
			branches: 75,
			statements: 80
		}
	}
});
