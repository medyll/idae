import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@chroma-core/default-embed': path.resolve('./src/lib/__stubs__/chroma-embed.ts'),
			'@medyll/idae-db':            path.resolve('./src/lib/__stubs__/idae-db-stub.ts'),
			'@medyll/idae-api':           path.resolve('./src/lib/__stubs__/idae-api-stub.ts'),
			'@medyll/skiller':            path.resolve('./src/lib/__stubs__/skiller-stub.ts'),
			'jsonwebtoken':               path.resolve('./src/lib/__stubs__/jwt-stub.ts'),
			'@medyll/qoolie/svelte':      path.resolve('../qoolie/src/adapters/svelte/index.ts'),
			'@medyll/qoolie':             path.resolve('../qoolie/src/index.ts'),
		}
	},
	optimizeDeps: {
		entries: ['src/**/*.{svelte,ts,js}'],
		exclude: ['chromadb'],
	},
	test: {
		projects: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],
				test: {
					name:        'client',
					environment: 'jsdom',
					clearMocks:  true,
					include:     ['src/**/*.svelte.{test,spec}.{js,ts}', 'src/_work/*.spec.ts'],
					exclude:     ['src/lib/server/**'],
					setupFiles:  ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name:        'server',
					environment: 'node',
					include:     ['src/**/*.{test,spec}.{js,ts}'],
					exclude:     ['src/**/*.svelte.{test,spec}.{js,ts}', 'src/e2e/**']
				}
			}
		]
	}
});
