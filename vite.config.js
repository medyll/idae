import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import UnoCSS from '@unocss/svelte-scoped/vite';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
	plugins: [UnoCSS({ cssFileTransformers: [transformerDirectives()] }), sveltekit()],
	assetsInclude: ['**/*.md'],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
