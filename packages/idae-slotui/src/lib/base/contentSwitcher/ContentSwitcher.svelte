/**
 * ContentSwitcher.svelte
 * Permet de basculer dynamiquement entre deux contenus (toggle/reveal) avec gestion d'icônes et de slots personnalisés.
 *
 * Props :
 * - icon (string|IconObj) : icône du bouton de bascule
 * - iconback (string|IconObj) : icône du bouton retour
 * - parent (HTMLElement) : parent DOM cible pour l'injection
 * - contentSwitcherTogglerIcon, contentSwitcherBackIcon, contentSwitcherReveal (slot/Snippet) : zones personnalisables
 * - class, style, element : personnalisation et référence DOM
 *
 * Utilise <IconButton>, <Button>, <Slotted> pour la structure et l'interaction.
 */
<script module lang="ts">
  import type { CommonProps, IconObj } from "$lib/types/index.js";
  import type { Snippet } from "svelte";
  import type { DemoerStoryProps } from "../demoer/types.js";
  import { demoerArgs } from "$lib/base/demoer/demoer.utils.js";

  export type ContentSwitcherProps = CommonProps & {
    class?: string;
    element?: HTMLDivElement;
    icon?: string | IconObj;
    iconback?: string | IconObj;
    parent?: HTMLElement;
    contentSwitcherTogglerIcon?: Snippet;
    contentSwitcherBackIcon?: Snippet;
    contentSwitcherReveal?: Snippet;
  };

  export const contentSwitcherDemoValues: DemoerStoryProps<ContentSwitcherProps> = {
    icon: {
      type: "icon",
      values: ["mdi:window", "mdi:user", undefined],
    },
    iconback: {
      type: "icon",
      values: ["mdi:window", "mdi:user", undefined],
    },
  };

  export let { parameters, componentArgs } = demoerArgs(contentSwitcherDemoValues);
</script>

<script lang="ts">
  import IconButton from "$lib/controls/button/IconButton.svelte";
  import Button from "$lib/controls/button/Button.svelte";
  import Slotted from "$lib/utils/slotted/Slotted.svelte";
  import type { ExpandProps } from "$lib/types/index.js";

  let {
    class: className = "",
    element = undefined,
    style,
    icon = "toggle",
    iconback = "chevron-left",
    parent = undefined,
    contentSwitcherTogglerIcon: togglerIcon,
    contentSwitcherBackIcon: backIcon,
    contentSwitcherReveal,
  }: ExpandProps<import('./ContentSwitcher.svelte').ContentSwitcherProps> = $props();

  let visibleSate: boolean = $state(false);
  let thisRef: any;
  let realParent: HTMLElement | null = $derived(
    parent ?? element?.parentElement ?? null,
  );

  function handleClick(event: MouseEvent) {
    visibleSate = !visibleSate;
    if (!element || !realParent) return false;
    const children: HTMLCollection = realParent?.children;

    // iterate over all child nodes
    Array.from(children).forEach((li: any) => {
      //li.style.transform = visibleSate ? 'scale(0,0)' : '';
      li.style.display = visibleSate ? "none" : "";
    });

    if (visibleSate) {
      realParent.appendChild(thisRef);
    } else {
      element.appendChild(thisRef);
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={className} {style} onclick={handleClick}>
  <Slotted child={togglerIcon}>
    <IconButton style="aspect-ratio:1/1" {icon} iconFontSize="small" />
  </Slotted>
</div>
<div bind:this={element} style="display:none">
  <div
    bind:this={thisRef}
    class="content-switcher w-full max-w-full gap-2 overflow-[var(--sld-content-switcher-overflow)] relative flex items-center flex-1"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div onclick={handleClick}>
      <Slotted child={backIcon}>
        <Button ratio="1/1" icon={iconback} />
      </Slotted>
    </div>
    <Slotted child={contentSwitcherReveal} />
  </div>
</div>
