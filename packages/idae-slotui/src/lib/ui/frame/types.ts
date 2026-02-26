export const frameDemoValues = {};
import { type Drawer } from "$lib/index.js";
import {
  demoerArgs,
  type DemoerStoryProps,
} from "$lib/base/demoer/demoer.utils.js";
import type { DrawerProps } from "$lib/navigation/drawer/types.js";
import type { CommonProps } from "$lib/types/index.js";
import type { Snippet } from "svelte";

export type FrameProps = CommonProps & {
  /** Width of the drawer */
  drawerWidth?: string;

  /** Props for the drawer */
  drawerProps?: DrawerProps;

  frameDrawerRef?: typeof Drawer;
  elementNav?: HTMLDivElement;
  /** Children snippet for the default content */
  children?: Snippet;
  frameContent?: Snippet;
  /** Slot for the nav left header frame */
  frameNavHeader?: Snippet;
  /** Slot for the frame top */
  frameTop?: Snippet;

  /** Slot for the frame bottom */
  frameBottom?: Snippet;

  /** Slot for the drawer top */
  drawerTop?: Snippet;

  /** Slot for the drawer content */
  drawerContent?: Snippet;
  drawerIcon?: Snippet;
  drawerTitle?: Snippet;
  drawerPrimary?: Snippet;
  drawerSecondary?: Snippet;
  drawerFooter?: Snippet;
};

const frameDemoValues: DemoerStoryProps<FrameProps> = {
  drawerWidth: {
    type: "string",
    values: ["200px", "300px", "400px"],
    default: "200px",
  },
};

export let { parameters, componentArgs } = demoerArgs(frameDemoValues);
