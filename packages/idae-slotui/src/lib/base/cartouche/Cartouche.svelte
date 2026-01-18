/**
 * Cartouche.svelte
 * Composant conteneur stylisé avec titre, sous-titre, icône, actions et contenu extensible.
 *
 * Props :
 * - primary (string) : titre principal
 * - secondary (string) : sous-titre
 * - icon (string) : nom d'icône (Iconify)
 * - stacked (boolean) : mode empilé
 * - bordered (boolean) : bordure visible
 * - isOpen (boolean) : contrôle l'ouverture/fermeture
 * - showTitleDivider (boolean) : séparateur visuel
 * - children, cartoucheIcon, cartouchePrimary, cartoucheSecondary, cartoucheButtons (slot/Snippet) : zones personnalisables
 * - component, componentProps : composant dynamique à afficher dans le contenu
 * - element (HTMLDivElement) : référence DOM
 *
 * Utilise <Icon>, <Button>, <IconButton>, <Slotted> pour la structure et les actions.
 */
<script module lang="ts">
  import {
    tallPreset,
    type CommonProps,
    type ElementProps,
  } from "$lib/types/index.js";
  import type { Snippet, SvelteComponent } from "svelte";
  import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";
  import type { DemoerStoryProps } from "../demoer/types.js";

  export type CartoucheClasses = {
    control: string;
    controlIcon: string;
    controlLabel: string;
    content: string;
  };
  export type CartoucheProps = CommonProps & {
    /**
     * Custom class for the cartouche
     * @type {string}
     */
    class?: string;

    /**
     * Custom classes for cartouche sub-elements
     * @type {CartoucheClasses}
     */
    classes?: CartoucheClasses;

    /**
     * Custom style string for the cartouche
     * @type {string}
     */
    style?: string;

    /**
     * Reference to the cartouche DOM element
     * @type {HTMLDivElement}
     */
    element?: HTMLDivElement;

    /**
     * Main title of the cartouche
     * @type {string}
     */
    primary: string;

    /**
     * Secondary title (subtitle)
     * @type {string}
     */
    secondary?: string;

    /**
     * Icon name (Iconify string)
     * @type {ElementProps["icon"]}
     */
    icon?: ElementProps["icon"];

    /**
     * Display stacked layout
     * @type {boolean}
     */
    stacked?: boolean;

    /**
     * Svelte component to render inside the cartouche
     * @type {SvelteComponent}
     */
    component?: SvelteComponent;

    /**
     * Props for the dynamic component
     * @type {Record<string, any>}
     */
    componentProps?: Record<string, any>;

    /**
     * Keep the cartouche content visible when closed
     * @type {boolean}
     */
    keepCartoucheContent?: boolean;

    /**
     * Show a divider in the title bar
     * @type {boolean}
     */
    showTitleDivider?: boolean;

    /**
     * Show a border around the cartouche
     * @type {boolean}
     */
    bordered?: boolean;

    /**
     * Controls the open/close state
     * @type {boolean}
     */
    isOpen?: boolean;

    /**
     * Actions for open/toggle/close
     * @type {Record<"open" | "toggle" | "close", (event: Event) => void>}
     */
    actions?: Record<"open" | "toggle" | "close", (event: Event) => void>;

    /**
     * Dense mode
     * @type {ElementProps["dense"]}
     */
    dense?: ElementProps["dense"];

    /**
     * Tall mode
     * @type {ElementProps["tall"]}
     */
    tall?: ElementProps["tall"];

    /**
     * Slot for custom cartouche content
     * @type {Snippet<[]>}
     * @template []
     */
    children?: import('svelte').Snippet<[]>;

    /**
     * Slot for custom icon
     * @type {Snippet<[]>}
     * @template []
     */
    cartoucheIcon?: import('svelte').Snippet<[]>;

    /**
     * Slot for custom primary title
     * @type {Snippet<[]>}
     * @template []
     */
    cartouchePrimary?: import('svelte').Snippet<[]>;

    /**
     * Slot for custom secondary title
     * @type {Snippet<[]>}
     * @template []
     */
    cartoucheSecondary?: import('svelte').Snippet<[]>;

    /**
     * Slot for custom buttons in the cartouche
     * @type {Snippet<[]>}
     * @template []
     */
    cartoucheButtons?: import('svelte').Snippet<[]>;
  };

  export const cartoucheDemoValues: DemoerStoryProps<CartoucheProps> = {
    primary: {
      type: "string",
      values: ["A smart title", "Second title"],
    },
    secondary: {
      type: "string",
      values: [undefined, "A smart subtitle", "Second subtitle"],
      default: undefined,
    },
    icon: {
      type: "icon",
      values: ["mdi:window", "mdi:user", undefined],
    },
    stacked: {
      type: "boolean",
      default: false,
    },
    showTitleDivider: {
      type: "boolean",
      default: false,
    },
    bordered: {
      type: "boolean",
      default: false,
    },
    isOpen: {
      type: "boolean",
      default: true,
    },
    tall: {
      type: "tall",
      default: tallPreset.default,
    },
  };

  export let { parameters, componentArgs } = demoerArgs(cartoucheDemoValues);
</script>

<script lang="ts">
  import { slide } from "svelte/transition";
  import Icon from "$lib/base/icon/Icon.svelte";
  import Button from "$lib/controls/button/Button.svelte";
  import IconButton from "$lib/controls/button/IconButton.svelte";
  import Slotted from "$lib/utils/slotted/Slotted.svelte";
  import type { ExpandProps } from "$lib/types/index.js";

  export const actions = {
    open,
    toggle,
    close,
  };

  let {
    class: className = "",
    classes = {} as (import('./Cartouche.svelte').CartoucheClasses),
    style = undefined,
    element = $bindable(),
    primary,
    secondary,
    icon,
    stacked = false,
    component,
    componentProps = {},
    keepCartoucheContent = true,
    showTitleDivider = false,
    bordered = false,
    children,
    cartoucheIcon,
    cartouchePrimary,
    cartoucheSecondary,
    cartoucheButtons,
    isOpen = $bindable(),
    dense,
    tall = "small",
  }: ExpandProps<import('./Cartouche.svelte').CartoucheProps> = $props();

  function open() {
    isOpen = true;
  }
  function toggle(event: Event) {
    isOpen = !isOpen;
  }
  function close() {
    isOpen = false;
  }

  const chevronIcon = $derived(!isOpen ? "chevron-down" : "chevron-up");

  let Component = $state(component);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class:stacked
  bind:this={element}
  class="cartouche rounded-[var(--cartouche-radius)] overflow-hidden bg-clip-padding shadow-[var(--sld-elevation-1)] transition-all {className}"
  data-bordered={bordered ?? false}
  aria-expanded={isOpen}
  {style}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="control {classes.control} tall-{tall} flex items-center gap-[var(--cartouche-control-gap)] bg-[var(--cartouche-background-color)] px-1 cursor-pointer transition-all hover:bg-[var(--cartouche-background-color-hover)]"
    {tall}
    onclick={actions.toggle}
  >
    {#if icon || cartoucheIcon}
      <div class="controlIcon {classes.controlIcon} flex items-center px-2">
        <Slotted child={cartoucheIcon}>
          <Icon {icon} />
        </Slotted>
      </div>
    {/if}
    <div class="controlLabel {classes.controlLabel} cursor-pointer">
      {#if primary || cartouchePrimary}
        <Slotted child={cartouchePrimary}>
          {primary}
        </Slotted>
        <div>
          <Slotted child={cartoucheSecondary}>
            {secondary ?? ""}
          </Slotted>
        </div>
      {/if}
    </div>
    <div
      class={showTitleDivider
        ? "divider border-l border-[var(--cartouche-divider-border)]"
        : ""}
      style="flex:1"
    />
    {#if cartoucheButtons}
      <div
        onclick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        class="cartouche-control-actions"
      >
        <Slotted child={cartoucheButtons}></Slotted>
      </div>
    {/if}
    <div class="chevron">
      <Button variant="flat" icon={chevronIcon} />
    </div>
  </div>
  {#if isOpen || keepCartoucheContent}
    <div class="content-wrapper" aria-expanded={isOpen}>
      <div
        aria-expanded={isOpen}
        class="content {classes.content}"
        transition:slide
      >
        {#if Component}
          <Component {...componentProps} />
        {/if}
        <Slotted child={children} />
      </div>
    </div>
  {/if}
</div>
