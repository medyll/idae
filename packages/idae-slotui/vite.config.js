import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
	plugins: [tailwindcss(),sveltekit()],
	assetsInclude: ['**/*.md'],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	resolve: {
		alias: {
			$lib: './src/lib',
			$sitedata: './src/sitedata',
		},
	},
});
