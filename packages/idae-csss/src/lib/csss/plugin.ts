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
        // Simple evaluation for now, in a real scenario we'd use a safer parser or JSON
        // If the file is valid JSON, parse it, otherwise try to evaluate it as a JS object
        let styleObj;
        try {
          styleObj = JSON.parse(code);
        } catch {
          // If not JSON, it might be an exported object or raw object literal
          // This is a very basic implementation
          const cleanCode = code
            .replace(/export\s+default\s+/, "")
            .replace(/;$/, "");
          styleObj = new Function(`return ${cleanCode}`)();
        }

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
