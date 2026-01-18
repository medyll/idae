/**
 * BreadCrumb.svelte
 * Affiche une liste de navigation hiérarchique (fil d'Ariane).
 *
 * Props :
 * - breadList (array) : liste des éléments du fil d'Ariane (texte, icône, lien, action)
 * - class, style : classes et styles personnalisés
 * - element (HTMLElement) : référence DOM
 * - children (slot) : contenu additionnel
 *
 * Utilise <Slotted> pour la gestion des slots.
 */
<script module lang="ts">
  import type { CommonProps } from '$lib/types/index.js';
  import type { Snippet } from 'svelte';

  interface BreadListType {
    action?: () => void;
    breads?: BreadListItemType[];
  }

  interface BreadListItemType<D = Record<string, any>> {
    text: string;
    icon: string;
    link?: string;
    data?: D;
    children: Snippet;
  }

  export interface BreadCrumbProps extends CommonProps {
    /**
     * Custom class for the breadcrumb container
     * @type {string}
     */
    class?: string;

    /**
     * Custom style string for the breadcrumb container
     * @type {string}
     */
    style?: string;

    /**
     * List of breadcrumb items
     * @type {BreadListType[]}
     */
    breadList: BreadListType[];

    /**
     * Reference to the breadcrumb DOM element
     * @type {HTMLElement}
     */
    element: HTMLElement;
  }
</script>

<script lang="ts">
  import type { ExpandProps } from "$lib/types/index.js";
  import Slotted from "$lib/utils/slotted/Slotted.svelte";

  let {
    class: className,
    element,
    children,
    style,
    breadList = [],
  }: ExpandProps<import('./BreadCrumb.svelte').BreadCrumbProps> = $props();
</script>

<nav bind:this={element} class={className ?? ""} {style}>
  <ul class="flex">
    <li>
      <Slotted child={children} />
    </li>
  </ul>
</nav>
