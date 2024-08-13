import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config.js';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		environment: 'happy-dom',
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
