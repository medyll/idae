import type { CommonProps, IconObj } from "$lib/types/index.js";
import type { Snippet } from "svelte";
import type { DemoerStoryProps } from "../demoer/types.js";
import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";

export type ContentSwitcherProps = CommonProps & {
  /** className off the root component */
  class?: string;

  /** element root HTMLDivElement props */
  element?: HTMLDivElement;
  /** icon for the switcher */
  icon?: string | IconObj;

  /** icon for the back action */
  iconback?: string | IconObj;

  /** parent element of the switcher */
  parent?: HTMLElement;
  contentSwitcherTogglerIcon?: Snippet;
  contentSwitcherBackIcon?: Snippet;
  contentSwitcherReveal?: Snippet;
};

export const contentSwitcherDemoValues: DemoerStoryProps<ContentSwitcherProps> =
  {
    icon: {
      type: "icon",
      values: ["mdi:window", "mdi:user", undefined],
    },
    iconback: {
      type: "icon",
      values: ["mdi:window", "mdi:user", undefined],
    },
  };

export let { parameters, componentArgs } = demoerArgs(
  contentSwitcherDemoValues,
);

// Placeholder demo exports for ContentSwitcher subcomponents
export const contentSwitcherBackIconDemoValues: DemoerStoryProps<any> = {};
export const contentSwitcherRevealDemoValues: DemoerStoryProps<any> = {};
export const contentSwitcherTogglerIconDemoValues: DemoerStoryProps<any> = {};
