import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  // The root should stay at project level so it can see /src
  root: process.cwd(),

  server: {
    // This ensures Vite doesn't try to open a port itself 
    // when used via createServer in your script
    middlewareMode: true,
    
    // Optional: add HMR specific settings if you have network constraints
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },

  resolve: {
    alias: {
      // Vital for your internal loading path
      '$lib': path.resolve(__dirname, './src/lib'),
    },
  },

  // Since you use a custom bootstrap (app.html), 
  // we tell Vite to treat it as an entry point if needed
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/app.html'),
      },
    },
  },

  // 'custom' prevents Vite from serving its own HTML and 
  // lets your Koa logic handle the response
  appType: 'custom',
});