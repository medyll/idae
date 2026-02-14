import type { PreprocessorGroup } from "svelte/types/compiler/preprocess";
import { HtmlElements } from "../htmlu/htmlu-dom-elements.js";
import { htmlu } from "../htmlu/htmlu.js";

type HtmluSveltePreprocessOptionsType = {
  scope: string | false;
  excludeTags: string[];
  allowedTags: string[];
};

/**
 * htmlu : a preprocess utility allowing to use classNames as elements tags. The next step of utility classNames is utility tags.
 * processes HTML content by transforming tags and attributes.
 *<absolute w-full h-full > content </absolute> => <div class="absolute w-full h-full"> content </div>
 *<flex-col:relative gap-2 pad-2>content</flex-col:relative> => <div class="flex-col relative gap-2 pad-2">content</div>
 *<grid gap-2 pad-2>content</grid> => <div class="grid gap-2 pad-2">content</div>
 
 * @param options - The options for HTML preprocessing.
 * @returns The preprocessor group object.
 */
function htmluSveltePreprocess(
  options: HtmluSveltePreprocessOptionsType = {} as HtmluSveltePreprocessOptionsType
): PreprocessorGroup {
  /** tags to exclude from transformation */
  const excludeTags = [
    "svelte",
    ...(Object.values(HtmlElements) as string[]),
    ...(options.excludeTags ?? []),
  ];
  /** tags to transform */
  const allowedTags = [...(options.allowedTags ?? [])];

  return {
    name: "svelte-htmlu",
    markup: ({ content }: { content: string }) => {
      return { code: htmlu({ allowedTags, excludeTags })(content) };
    },
  };
}

export { htmluSveltePreprocess };
