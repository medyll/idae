import {
  statusPreset,
  type CommonProps,
  type ElementProps,
} from "$lib/types/index.js";
import type { Snippet } from "svelte";
import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";
import type { DemoerStoryProps } from "../demoer/types.js";
// NOTE: `AlertProps` moved to component module script during migration.
// Keep demo exports below; do not reintroduce `AlertProps` here.

export const alertDemoValues: DemoerStoryProps<any> = {
  isOpen: {
    type: "boolean",
    values: [true, false],
    default: true,
  },
  draggable: {
    type: "boolean",
    values: [true, false],
    default: false,
  },
  level: {
    type: "levels",
    values: Object.keys(statusPreset),
    default: statusPreset.info,
  },
  message: {
    type: "string",
    values: ["Some messages"],
  },
};

export let { parameters, componentArgs } = demoerArgs(alertDemoValues);

// Placeholder demo exports for alert subcomponents (non-destructive)
export const alertButtonCloseDemoValues: DemoerStoryProps<any> = {};
export const alertButtonZoneDemoValues: DemoerStoryProps<any> = {};
export const alertMessageDemoValues: DemoerStoryProps<any> = {};
export const alertTopButtonDemoValues: DemoerStoryProps<any> = {};
