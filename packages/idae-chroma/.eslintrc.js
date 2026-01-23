/** @type { import("eslint").Linter.Config } */
import idaeConfig from "@medyll/idae-eslint-config"; 

export default [
  ...idaeConfig,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
