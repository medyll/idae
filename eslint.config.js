// ESLint monorepo config: étend le preset partagé
import baseConfig from "@medyll/idae-eslint-config";

export default {
	...baseConfig,
	ignores: [
		"dist/",
		"build/",
		".svelte-kit/",
		"node_modules/",
		"coverage/",
		"*.d.ts",
	],
};
