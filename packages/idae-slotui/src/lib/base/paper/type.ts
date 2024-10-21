import type { CommonProps } from "$lib/types/index.js";
import type { Snippet } from "svelte";
import type { DemoerStoryProps } from "$lib/base/demoer/types.js";
import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";

export type PaperProps = {
  /** className off the root component */
  class?: string;

  /** css style off the root component */
  style?: string;

  /** element root HTMLDivElement props */
  element?: HTMLDivElement | null;
  /** from 0 to 5 */
  elevation?: number;

  children?: Snippet;
} & CommonProps;

export const paperDemoValues: DemoerStoryProps<PaperProps> = {
  elevation: {
    type: "elevation",
    default: 0,
  },
};

export let { parameters, componentArgs } = demoerArgs(paperDemoValues);
