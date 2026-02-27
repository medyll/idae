export const confirmDemoValues = {};

export const confirmInitialDemoValues = {};
import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";
import type { DemoerStoryProps } from "$lib/base/demoer/types.js";
import {
  buttonVariant,
  iconSize,
  tallPreset,
  type CommonProps,
  type ElementProps,
} from "$lib/types/index.js";
import type { Snippet } from "svelte";
import type { ButtonProps } from "../button/types.js";

export type ConfirmProps<T = any> = CommonProps & {
  /** element data sent on confirm */
  data?: T;
  /** element initial HTMLDivElement props */
  initialRef?: HTMLElement | null;

  /** element confirm HTMLDivElement props */
  contentRef?: HTMLElement | null;

  /**  @deprecated text displayed on initial button */
  tooltipInitial?: string | null;

  /** @deprecated text displayed on initial button */
  primaryInitial?: string;
  /**  @deprecated text displayed on the confirm phase */
  primaryConfirm: string;

  /**  @deprecated icon displayed on the initial button */
  iconInitial?: string;

  /**  @deprecated color of the icon displayed on the initial button */
  iconColorInitial?: string;

  /** text displayed on confirm button */
  primary?: string;

  /** icon displayed on the confirm button */
  icon?: ElementProps["icon"];
  /**  button height */
  tall?: ElementProps["tall"];
  /** variant for buttons */
  variant: ElementProps["buttonVariant"];
  /** color of the icon displayed on the confirm button
   * @type string
   */
  iconColor?: string;

  iconSize?: string;

  autoClose?: boolean;
  /** loading state on validate */
  loading?: boolean;
  iconLoading?: ElementProps["icon"];

  /** action initiated on confirmation */
  action?: Promise<T> | ((data?: T) => void);

  /**  @deprecated icon to display for back action */
  iconCancel?: ElementProps["icon"];

  buttonInitial?: ButtonProps;
  buttonConfirm?: ButtonProps;
  buttonCancel?: ButtonProps;

  children?: Snippet;
  confirmInitial?: Snippet;
};

export const ConfirmDemoValues: DemoerStoryProps<ConfirmProps> = {
  primaryInitial: {
    type: "string",
    values: ["Would you please click once ?"],
    private: true,
  },
  tooltipInitial: {
    type: "string",
    values: ["Would you please click once ?"],
    private: true,
  },
  iconInitial: {
    type: "icon",
    values: ["fa-solid:question"],
  },
  iconColorInitial: {
    type: "color",
    values: ["green", "blue", undefined],
  },
  primary: {
    type: "icon",
    values: ["Confirm deletion"],
  },
  icon: {
    type: "icon",
    values: ["mdi:close", undefined],
  },
  iconColor: {
    type: "color",
    values: ["red", "orange", undefined],
  },
  iconSize: {
    type: "iconSize",
    default: iconSize.medium,
  },
  tall: {
    type: "tall",
    values: Object.values(tallPreset),
    default: tallPreset.default,
  },
  variant: {
    type: "buttonVariant",
    values: Object.values(buttonVariant),
    default: buttonVariant.contained,
  },
};

export let { parameters, componentArgs } = demoerArgs(ConfirmDemoValues);
