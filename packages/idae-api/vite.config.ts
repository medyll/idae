import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		// Coverage configuration
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'json', 'lcov'],
			exclude: [
				'node_modules/',
				'src/**/*.test.ts',
				'src/**/*.spec.ts',
				'src/**/__tests__/**',
				'dist/',
				'.svelte-kit/'
			],
			lines: 80,
			functions: 80,
			branches: 70,
			statements: 80
		},
		// Global test setup
		globals: true,
		environment: 'node',
		// Test timeout
		testTimeout: 10000,
		// Mock reset behavior
		mockReset: true,
		restoreMocks: true,
		clearMocks: true
	}
});
