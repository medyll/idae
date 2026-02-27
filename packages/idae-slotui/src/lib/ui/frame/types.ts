export const frameDemoValues = {};
import { type Drawer } from "$lib/index.js";
import {
  demoerArgs,
  type DemoerStoryProps,
} from "$lib/base/demoer/demoer.utils.js";
import type { DrawerProps } from "$lib/navigation/drawer/types.js";
import type { CommonProps } from "$lib/types/index.js";
import type { Snippet } from "svelte";

// Props moved to the component module script during migration.

const frameDemoValues: DemoerStoryProps<any> = {
  drawerWidth: {
    type: "string",
    values: ["200px", "300px", "400px"],
    default: "200px",
  },
};

export let { parameters, componentArgs } = demoerArgs(frameDemoValues);
