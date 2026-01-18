
<script module lang="ts">
  import {
    statusPreset,
    type CommonProps,
    type ElementProps,
  } from "$lib/types/index.js";
  import type { Snippet } from "svelte";
  import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";
  import type { DemoerStoryProps } from "../demoer/types.js";

  export interface AlertProps extends CommonProps {
    /** alert level */
    level?: ElementProps["levels"];
    /** message to be shown */
    message?: string;
    /** make the alert draggable */
    draggable?: boolean;
    /** show or hide the alert */
    isOpen?: boolean;
    children?: Snippet;
    alertTopButton?: Snippet;
    alertMessage?: Snippet;
    alertButtonZone?: Snippet;
    alertButtonClose?: Snippet;
  }

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
</script>

<script lang="ts">
  import { fade } from "svelte/transition";
  import Divider from "$lib/base/divider/Divider.svelte";
  import Button from "$lib/controls/button/Button.svelte";
  import type { ExpandProps } from "$lib/types/index.js";
  // import type { AlertProps } from './types.js';
  import Slotted from "$lib/utils/slotted/Slotted.svelte";
  import IconButton from "$lib/controls/button/IconButton.svelte";

  let {
    class: className,
    message,
    draggable = false,
    level = $bindable<ElementProps["levels"]>("info"),
    isOpen = $bindable<boolean>(false),
    element = $bindable<HTMLDialogElement>(),
    children,
    alertTopButton,
    alertMessage,
    alertButtonZone,
    alertButtonClose,
  }: AlertProps = $props();

  export const actions: Record<"open" | "toggle" | "close", Function> = {
    open,
    toggle,
    close,
  };

  const handleClick = (event: Event) => {
    if ((event?.target as Element)?.getAttribute("data-close")) {
      event.stopPropagation();
      actions.close();
    }
  };

  $effect(() => {
    if (element) {
      element.addEventListener("click", handleClick, true);
    }
    return () => {
      if (element) {
        element.removeEventListener("click", handleClick);
      }
    };
  });

  function open() {
    isOpen = true;
  }
  function toggle() {
    isOpen = !isOpen;
  }
  function close() {
    isOpen = false;
  }
</script>

{#if isOpen}
  <dialog
    open={isOpen}
    {draggable}
    bind:this={element}
    transition:fade|global
    class="alert {className} relative min-w-[350px] inline-block rounded-[var(--alert-radius)] border border-[var(--alert-color-border)] bg-[var(--alert-color-background)] shadow-[var(--alert-elevation)] overflow-hidden p-0"
  >
    <article
      class="dialog-content border-b-4 border-[var(--alert-color-border)] p-[var(--alert-pad)]"
    >
      <header
        class="header-bar flex items-center p-[var(--alert-pad-small)] gap-[var(--alert-gap-small,1rem)]"
      >
        <div
          class="dot inline-block border border-[var(--alert-color-border)] rounded-[var(--alert-radius)] h-4 w-1 transform -translate-x-1/2 {`bg-${level}`}"
        ></div>
        <div class="title flex-1 flex items-center">
          <Slotted child={children}>{message}</Slotted>
        </div>
        <Slotted child={alertTopButton} />
        <div data-close class="rounded-[var(--alert-radius)] m-1 p-1">
          <Slotted child={alertButtonClose}>
            <IconButton
              icon="window-close"
              variant="naked"
              onclick={() => {
                isOpen = !isOpen;
              }}
              aria-label="Close"
            />
          </Slotted>
        </div>
      </header>
      {#if alertMessage}
        <Divider />
        {@render alertMessage()}
      {/if}
      {#if alertButtonZone}
        <footer
          class="dialog-footer flex justify-end p-[var(--alert-pad)] border-t border-[var(--alert-color-border)]"
        >
          {@render alertButtonZone()}
        </footer>
      {/if}
    </article>
  </dialog>
{/if}
