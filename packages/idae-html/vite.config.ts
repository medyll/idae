import { defineConfig } from 'vite';
import path from 'path';

// Plugin to serve `src/app.html` as the default index in dev mode
function idaeServe() {
	return {
		name: 'idae-serve',
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				if (!req || !req.url) return next();
				// rewrite root and index requests to src/app.html
				if (req.url === '/' || req.url === '/index.html') {
					req.url = '/src/app.html';
				}
				next();
			});
		}
	};
}

export default defineConfig({
	plugins: [idaeServe()],
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
