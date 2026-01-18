<!-- /**
 * Badge.svelte
 * Affiche un badge numérique positionnable sur un élément.
 *
 * Props :
 * - value (number) : valeur affichée dans le badge
 * - ceiling (number) : valeur maximale affichée, au-delà on affiche ceiling+
 * - element (HTMLDivElement) : référence à l'élément DOM du badge
 * - position (object) : position du badge { x: 'left'|'right'|'center', y: 'top'|'bottom'|'center' }
 * - children (slot) : contenu optionnel à afficher dans le badge
 *
 * Utilise le composant utilitaire <Slotted> pour la gestion du slot.
 */ -->
<script module lang="ts">
  import type { CommonProps } from '$lib/types/index.js';
  export interface BadgeProps extends CommonProps {
    /**
     * Value displayed in the badge
     * @type {number}
     */
    value: number;

    /**
     * Maximum value displayed; if value > ceiling, show ceiling+
     * @type {number}
     */
    ceiling: number;

    /**
     * Reference to the badge DOM element
     * @type {HTMLDivElement}
     */
    element: HTMLDivElement;

    /**
     * Position of the badge
     * @type {{ x: 'left' | 'right' | 'center'; y: 'top' | 'bottom' | 'center' }}
     */
    position: { x: 'left' | 'right' | 'center'; y: 'top' | 'bottom' | 'center' };

    /**
     * Slot for custom badge content
     * @type {Snippet<[]>}
     * @template []
     */
    children?: import('svelte').Snippet<[]>;
  }
</script>

<script lang="ts">
  import Slotted from "$lib/utils/slotted/Slotted.svelte";

  let {
    value,
    ceiling,
    element,
    position = { x: "right", y: "top" },
    children,
  }: import('./Badge.svelte').BadgeProps = $props();

  const xM = {
    left: "left:0",
    right: "right:0",
    center: "left:50%;transformation:translate(-50%,0)",
  };
  const yM = {
    top: "top:0",
    bottom: "bottom:0",
    center: "top:50%;transformation:translate(0,-50%)",
  };
</script>

{#if value > ceiling}
  <div
    bind:this={element}
    class="badge absolute rounded-full border border-[var(--badge-color-border)] grid place-items-center w-4 h-4"
    style="{xM[position.x]};{yM[position.y]}"
  >
    <Slotted child={children}>{value}</Slotted>
  </div>
{/if}
