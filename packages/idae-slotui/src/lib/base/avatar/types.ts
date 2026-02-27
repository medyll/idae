import { widthPreset, iconSize } from "$lib/types/index.js";
import type { DemoerStoryProps } from "$lib/base/demoer/types.js";
type EnumValueType<T> = T[keyof T];
export enum statusPreset {
  success = "success",
  warning = "warning",
  alert = "alert",
  error = "error",
  info = "info",
  discrete = "discrete",
}
import type { CommonProps, ElementProps } from "$lib/types/index.js";
import type { Snippet } from "svelte";
import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";
import type { AvatarProps } from "./Avatar.svelte";


export const AvatarDemoValues: DemoerStoryProps<AvatarProps> = {
  icon: {
    type: "icon",
    default: "user",
  },
  size: {
    type: "width",
    default: widthPreset.med,
  },
  iconSize: {
    type: "iconSize",
    default: iconSize.medium,
  },
};

export let { parameters, componentArgs } = demoerArgs(AvatarDemoValues);

// Placeholder demo exports for avatar subcomponents
export const avatarBadgeDemoValues: DemoerStoryProps<any> = {};
