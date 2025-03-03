import type { CommonProps, ElementProps } from "$lib/types/index.js";
import type { Snippet } from "svelte";
import type { DemoerStoryProps } from "$lib/base/demoer/types.js";
import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";

export interface BackdropProps<T = any, C = any> extends CommonProps {
  /** backdrop class */
  class?: string;
  /** backdrop style */
  style?: string;
  /** 
			css position mode of the backdrop
			@type {'absolute' | 'fixed' | 'relative'}  
		*/
  flow?: ElementProps["flow"];
  /** auto-close backdrop on click */
  autoClose?: boolean;
  /** show or hide the backdrop */
  isOpen?: boolean;
  /** if in loading state, it will show a loading icon or $$slots.loadingSlot */
  isLoading?: boolean;
  element?: HTMLDivElement;
  elementContent?: HTMLDivElement;
  elementContentInner?: HTMLDivElement;
  component?: C;
  componentProps?: Record<string, any>;
  classes?: {
    backdrop?: string;
    backdropContent?: string;
    backdropContentInner?: string;
  };
  onclick?: (event: MouseEvent) => void;
  children?: Snippet;
  backdropLoading?: Snippet;
}

export const BackdropDemoValues: DemoerStoryProps<BackdropProps> = {
  isOpen: {
    type: "boolean",
    default: true,
  },
  autoClose: {
    type: "boolean",
    default: true,
  },
  isLoading: {
    type: "boolean",
    default: false,
  },
  flow: {
    type: "flow",
    default: "fixed",
  },
};

export let { parameters, componentArgs } = demoerArgs(BackdropDemoValues);
