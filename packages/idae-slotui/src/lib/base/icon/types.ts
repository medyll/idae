import type { ElementProps, IconObj } from "$lib/types/index.js";
import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";
import type { DemoerStoryProps } from "../demoer/types.js";

/**
 * Properties for the IconApp component.
 */
export type IconAppProps = {
  /**
   * Icon name for Iconify.
   * @param icon
   */
  icon?: ElementProps["icon"];

  /**
   * Class name of the root component.
   * @param class
   */
  class?: string;

  /**
   * CSS style of the root component.
   * @param style
   */
  style?: string;

  /**
   * Root HTMLDivElement properties.
   * @param element
   */
  element?: HTMLDivElement | null | any;

  /**
   * Icon object for Iconify, replaces and invalidates `icon` prop.
   * @param ico
   */
  ico?: IconObj;

  /**
   * Icon size.
   * @param iconSize
   */
  iconSize?: ElementProps["iconSize"];

  /**
   * Rotate icon.
   * @param rotate
   */
  rotate?: boolean;

  /**
   * Icon color.
   * @param color
   */
  color?: string;

  /**
   * Icon rotation.
   * @param rotation
   */
  rotation?: number;

  /**
   * Display property for the icon.
   * @param display
   */
  display?: "block" | "inline-block" | "inline";
};

export const iconAppDemoValues: DemoerStoryProps<IconAppProps> = {
  icon: {
    type: "icon",
    default: "user",
  },
  iconSize: {
    type: "iconSize",
  },
  color: {
    type: "color",
  },
  rotation: {
    type: "number",
    values: [0, 45, 90, 180, 270],
  },
  rotate: {
    type: "boolean",
  },
};

export let { parameters, componentArgs } = demoerArgs(iconAppDemoValues);
