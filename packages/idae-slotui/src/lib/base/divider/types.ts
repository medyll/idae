import { densePreset, uiPresets, type ElementProps } from "$lib/types/index.js";
import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";
import type { DemoerStoryProps } from "../demoer/types.js";

export type DividerProps = {
  /** className off the root component */
  class?: string;

  /** css style off the root component */
  style?: CSSStyleDeclaration;

  /** element root HTMLDivElement props */
  element?: HTMLDivElement | null;

  /**
   * margins and with applied to divider
   */
  dense?: ElementProps["dense"];

  /**
   * default direction of the divider
   * @type {'vertical' | 'horizontal'}
   */
  orientation?: ElementProps["orientation"];

  /**
   * expansion of the divider
   * @type {'full' | 'padded' | 'centered'}
   */
  expansion?: "full" | "padded" | "centered";

  /** give shadow to divider */
  shadowed?: boolean;

  /** give color to divider */
  color?: string | null;
};

export const DividerDemoValues: DemoerStoryProps<DividerProps> = {
  dense: {
    type: "dense",
    default: densePreset.default,
  },
  orientation: {
    type: "direction",
  },
  expansion: {
    type: "string",
    values: ["full", "padded", "centered"],
  },
  shadowed: {
    type: "boolean",
  },
  color: {
    type: "color",
  },
};

export let { parameters, componentArgs } = demoerArgs(DividerDemoValues);
