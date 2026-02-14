import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths({ allowJs: true }), sveltekit()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});
