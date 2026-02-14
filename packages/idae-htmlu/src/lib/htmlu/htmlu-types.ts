import type { AllowedProperties } from "./htmlu-utility-first.js";

interface HtmlUTags
  extends Record<
    (typeof AllowedProperties)[number],
    string | undefined | null
  > {}

declare module "svelte/elements" {
  export interface SvelteHTMLElements extends HtmlUTags {}
  export interface HTMLAttributes<T> {
    [key: string]: string | undefined | null;
  }
}

export {};
