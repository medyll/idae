/**
 * Columner.svelte
 * Fournit un conteneur pour organiser des colonnes dynamiques avec gestion d'état via contexte Svelte.
 *
 * Props :
 * - children (slot/Snippet) : contenu des colonnes
 * - ...rest : props additionnels passés au conteneur
 *
 * Utilise le contexte Svelte pour partager l'état des colonnes.
 */
<script module lang="ts">
  import type { CommonProps } from '$lib/types/index.js';
  import type { Snippet } from 'svelte';

  export type ColumnProps = CommonProps & {
    columnId: string;
    drawerTop?: Snippet;
    bottomSlot?: Snippet;
  };
  export type ColumnerStoreType = Record<string, ColumnType>;

  export interface ColumnType {
    columnId: string;
    state: keyof typeof states;
  }

  const states = ['expanded', 'equal', 'minimal', 'default'];
</script>

<script lang="ts">
  import type { ExpandProps } from "$lib/types/index.js";
  import { setContext, type Snippet } from "svelte";
  import { writable } from "svelte/store";

  const columner = writable<import('./Columner.svelte').ColumnerStoreType>({});
  setContext("columner", columner);
  type Props = {
    children: Snippet;
  };
  let { children, ...restProps }: ExpandProps<Props> = $props();
</script>

<div class="columner flex h-full relative" {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</div>
