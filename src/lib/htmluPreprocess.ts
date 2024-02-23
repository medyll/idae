import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess';

type HtmluSveltePreprocessOptionsType = {
	scriptTag?: string;
};

/** vite preprocessor */
function htmluSvelteDomPreprocess(
	options: HtmluSveltePreprocessOptionsType = {} as HtmluSveltePreprocessOptionsType
): PreprocessorGroup {
	return {
		name: 'svelte-htmludom-preprocess',
		markup: ({ content }: { content: string }) => {
			console.log(content);
			return { code: muteScript(content) };
		}
	};
}

function muteScript(content: string) {
	return content.replace(/<script data-attr='htmludom'.*>.*<\/script>/g, '');
}

export { htmluSvelteDomPreprocess };
