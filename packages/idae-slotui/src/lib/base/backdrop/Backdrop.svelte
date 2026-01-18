/**
 * Backdrop component
 *
 * Displays a modal overlay that can contain custom content or a loading indicator.
 * Supports auto-close, slot content, and custom components.
 *
 * @component
 * @example
 * <Backdrop isOpen={true} autoClose={true}>
 *   <div>Your content here</div>
 * </Backdrop>
 */
<script module lang="ts">
  import type { CommonProps, ElementProps } from "$lib/types/index.js";
  import type { Snippet } from "svelte";
  import type { DemoerStoryProps } from "$lib/base/demoer/types.js";
  import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";

  export interface BackdropProps<T = any, C = any> extends CommonProps {
    class?: string;
    style?: string;
    flow?: ElementProps["flow"];
    autoClose?: boolean;
    isOpen?: boolean;
    isLoading?: boolean;
    element?: HTMLDivElement;
    elementContent?: HTMLDivElement;
    elementContentInner?: HTMLDivElement;
    component?: C;
    componentProps?: Record<string, any>;
    classes?: {
      backdrop?: string;
      backdropContent?: string;
      backdropContentInner?: string;
    };
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
    backdropLoading?: Snippet;
  }

  export const BackdropDemoValues: DemoerStoryProps<BackdropProps> = {
    isOpen: {
      type: "boolean",
      default: true,
    },
    autoClose: {
      type: "boolean",
      default: true,
    },
    isLoading: {
      type: "boolean",
      default: false,
    },
    flow: {
      type: "flow",
      default: "fixed",
    },
  };

  export let { parameters, componentArgs } = demoerArgs(BackdropDemoValues);
</script>

<script lang="ts">
  import { fade } from "svelte/transition";
  import Icon from "$lib/base/icon/Icon.svelte";
  import type { ExpandProps } from "$lib/types/index.js";
  import Slotted from "$lib/utils/slotted/Slotted.svelte";

  /** Backdrop controller */
  export const actions = {
    close: () => {
      isOpen = false;
    },
    open: () => {
      isOpen = true;
    },
  };

  let {
    class: className,
    style,
    flow = "fixed",
    autoClose = false,
    isOpen = $bindable(),
    onclick,
    isLoading = false,
    element,
    elementContent,
    elementContentInner,
    component,
    componentProps,
    classes = {},
    children,
    backdropLoading,
  }: import('./Backdrop.svelte').BackdropProps = $props();

  $effect(() => {
    element?.addEventListener("click", testAutoClose);
    elementContentInner?.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });

  function testAutoClose() {
    if (autoClose) isOpen = false;
  }
</script>

{#if isOpen}
  <div
    in:fade|global
    out:fade|global
    bind:this={element}
    class="backdrop {className} fixed inset-0 z-[10000] h-full w-full top-0 left-0"
    style="position:{flow};{style}"
    role="dialog"
    tabindex="-1"
  >
    <div
      bind:this={elementContent}
      class="backdrop-content absolute z-[10001] h-full w-full bg-[var(--backdrop-background-color)] backdrop-blur-[5px] flex items-center justify-center"
    >
      {#if isLoading}
        <div class="backdrop-content-loader flex justify-center items-center">
          <Slotted child={backdropLoading}>
            <Icon icon="mdi:loading" iconSize="large" rotate />
          </Slotted>
        </div>
      {:else}
        <div
          class="backdrop-content-inner flex"
          bind:this={elementContentInner}
        >
          {#if children}
            {@render children?.()}
          {:else if component}
            <svelte:component this={component} {...componentProps} />
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}
