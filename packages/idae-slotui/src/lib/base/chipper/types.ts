import type {
  CommonProps,
  DemoStoryProps,
  ElementProps,
} from "$lib/types/index.js";
import type { Snippet } from "svelte";
import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";
import type { DemoerStoryProps } from "../demoer/types.js";

export interface ChipperProps extends CommonProps {
  /**
   * Position of the chipper
   * @type {ElementProps["position"]}
   */
  position?: ElementProps["position"];

  /**
   * Theme/status of the chip
   * @type {"primary"|"secondary"|"tertiary"|"success"|"warning"|"danger"|"light"|"medium"|"dark"}
   */
  theme?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "success"
    | "warning"
    | "danger"
    | "light"
    | "medium"
    | "dark";

  /**
   * CSS color code for the chip
   * @type {string}
   */
  color?: string;

  /**
   * Text or HTML content (if snippet is not used)
   * @type {string}
   */
  content?: string;

  /**
   * Show or hide the chip
   * @type {boolean}
   */
  showChip?: boolean;

  /**
   * Slot for custom chip content
   * @type {Snippet<[]>}
   * @template []
   */
  chipperChip?: import('svelte').Snippet<[]>;
}

export const chipperDemoValues: DemoerStoryProps<ChipperProps> = {
  showChip: {
    type: "boolean",
    default: true,
  },
  position: {
    type: "position",
  },
  theme: {
    type: "theme",
  },
  color: {
    type: "color",
    values: ["#ff0000", "#00ff00", "#0000ff"],
  },
  content: {
    type: "string",
    values: ["Some content", "Other content"],
  },
};

export let { parameters, componentArgs } = demoerArgs(chipperDemoValues);
