import adapter from '@sveltejs/adapter-auto';
import { sveltePreprocess } from 'svelte-preprocess';

const config = {
	preprocess: sveltePreprocess({ postcss: true }),
	kit: {
		adapter: adapter(),
    alias: {
      '$lib': './src/lib',  
      '$sitedata': './src/sitedata',  
    }
	}
};

export default config;