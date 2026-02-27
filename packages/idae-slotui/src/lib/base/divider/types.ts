import { densePreset, uiPresets, type ElementProps } from "$lib/types/index.js";
import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";
import type { DemoerStoryProps } from "../demoer/types.js";

// NOTE: `DividerProps` moved to the component module script during migration.
// Demo values are kept below for documentation/generator purposes.

export const DividerDemoValues: DemoerStoryProps<any> = {
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
