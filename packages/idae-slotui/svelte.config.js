import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import mdsvexConfig from './mdsvex.config.js';
import path from 'path';

const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],

	kit: {
		adapter: adapter(),
		alias: {
			$components: path.resolve('./src/components'),
			$stores: path.resolve('./src/stores'),
			$utils: path.resolve('./src/utils'),
			$styles: path.resolve('./src/styles'), 
			$sitedata: path.resolve('./src/sitedata'),
			$slotuiDefs: path.resolve('./src/sitedata/slotuiDefs'),
		}
	},
	vitePlugin: {
    // set to true for defaults or customize with object
    inspector: {
      toggleKeyCombo: 'meta-shift',
      showToggleButton: 'always',
      toggleButtonPos: 'bottom-right'
    }
  }
};

export default config; 
