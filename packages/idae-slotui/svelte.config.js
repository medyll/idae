import adapter from '@sveltejs/adapter-auto';
import { sveltePreprocess } from 'svelte-preprocess';
import { vi } from 'vitest';

const config = {
	preprocess: sveltePreprocess({ postcss: true }),
	kit: {
		adapter: adapter(),
    alias: {
      '$lib': './src/lib',  
      '$sitedata': './src/sitedata',  
    }
	}
};vi

export default config;