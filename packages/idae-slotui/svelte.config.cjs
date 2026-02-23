const sveltePreprocess = require('svelte-preprocess');

const config = {
  preprocess: [
    sveltePreprocess({
      postcss: true,
    }),
  ],
  // ...other config options...
};

module.exports = config;
