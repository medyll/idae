/**
 * Chipper.svelte
 * Affiche un composant "chip" positionné avec contenu personnalisable.
 *
 * Props :
 * - content (string) : contenu principal (HTML/text)
 * - chipperChip (slot) : contenu du chip
 * - position (string) : position du chip (ex: 'bottom')
 * - theme (string) : thème/couleur du chip
 * - color (string) : couleur CSS personnalisée
 * - showChip (boolean) : affiche ou masque le chip
 * - class, style : classes et styles personnalisés
 * - element (HTMLDivElement) : référence DOM
 * - children (slot) : contenu additionnel
 *
 * Utilise <Slotted> pour la gestion des slots.
 */
<script lang="ts">
  import type {
    CommonProps,
    ElementProps,
    ExpandProps,
  } from "$lib/types/index.js";
  import Slotted from "$lib/utils/slotted/Slotted.svelte";
  import type { ChipperProps } from "./types.js";

  let {
    class: className = "",
    style,
    element = $bindable<HTMLDivElement>(),
    position = "bottom",
    theme: status = "primary",
    color = "",
    content = "",
    showChip = true,
    chipperChip,
    children,
  }: ExpandProps<ChipperProps> = $props();

  let cssColor = $derived(
    color ?? (status ? `var(--sld-color-${status})` : ""),
  );
</script>

<div
  bind:this={element}
  style="{style};position:relative;"
  class="chipper relative gap-[var(--chipper-gap)] {className}"
>
  <Slotted child={children}>
    {#if content}
      <div class="chipper-content p-2">{@html content ?? ""}</div>
    {/if}
  </Slotted>

  <chip
    class="chipper-chip block absolute z-2 rounded-[var(--chipper-radius)] transition-all max-h-full bg-[var(--chipper-chip-color)]"
    data-position={position}
    style:--css-button-chip-color={cssColor}
  >
    {#if showChip}
      <Slotted child={chipperChip} />
    {/if}
  </chip>
</div>
