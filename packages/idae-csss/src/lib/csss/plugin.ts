import { OpCssParser } from "./parser";

/**
 * Zero-Runtime Vite Plugin
 * Handles .csss files and transforms them into standard CSS
 */
export const idaeCssVitePlugin = () => {
  const parser = new OpCssParser();

  return {
    name: "vite-plugin-idae-csss",

    /**
     * Handle .csss extension
     */
    async transform(code: string, id: string) {
      if (!id.endsWith(".csss")) return null;

      try {
        // Parse the .csss source using the dedicated parser without executing it as code.
        // NOTE: Avoid evaluating user-provided content (e.g. via `new Function` or `eval`)
        // to prevent code injection vulnerabilities.
        const css = parser.parseCsss(code);

        // Return as a JS module that exports the CSS string
        return {
          code: `export default ${JSON.stringify(css)};`,
          map: null,
        };
      } catch (e: any) {
        this.error(`Failed to parse .csss file ${id}: ${e.message}`);
        return null;
      }
    },
  };
};
