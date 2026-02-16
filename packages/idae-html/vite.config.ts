import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: [
			{ find: '$lib', replacement: path.resolve(__dirname, 'src/lib') },
			{ find: /^\$lib\/(.*)/, replacement: path.resolve(__dirname, 'src/lib') + '/$1' }
		]
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true
	}
});
