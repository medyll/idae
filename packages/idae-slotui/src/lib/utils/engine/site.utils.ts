export const sitePaths = {
	component: (args: { code: string; group?: string }) => `./svelte-components/${args.code}`,
	api: (args: { code: string; group?: string }) => `./svelte-components/${args.code}/api`
};
