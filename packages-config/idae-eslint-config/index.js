import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export const baseConfig = [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2020,
      sourceType: "module",
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts"],
    languageOptions: {
      parser: svelte.parser, // Important pour Svelte
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: [".svelte", ".svelte.ts"],
      },
    },
  },
  {
    ignores: ["build/", ".svelte-kit/", "dist/"],
  },
];

export default baseConfig;
