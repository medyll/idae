import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  root: process.cwd(),

  server: {
    middlewareMode: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },

  resolve: {
    alias: {
      '$lib': path.resolve(__dirname, './src/lib'),
    },
  },

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/app.html'),
      },
    },
  },

  appType: 'custom',

  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.{test,spec}.{js,ts}', 'src/**/*.{test,spec}.{js,ts}'],
  },
});