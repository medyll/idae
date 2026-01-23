/**
 * @type {import("prettier").Config}
 */
const config = {
  useTabs: true,
  singleQuote: true,
  trailingComma: "none",
  tabWidth: 2,
  printWidth: 100,
  plugins: [
    "prettier-plugin-svelte",
    "prettier-plugin-tailwindcss",
    "@huggingface/prettier-plugin-vertical-align",
  ],
  overrides: [
    { files: "*.svelte", options: { parser: "svelte" } },
    { files: "*.css", options: { parser: "css" } },
  ],
};

export default config;
