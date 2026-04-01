<script lang="ts">
    /**
     * @component DataListFields
     * Iterates over a collection's fields and renders a FieldDisplay for each.
     * Supports filtering via `showFields` and dynamic discovery via `scheme` or `data`.
     */
    import FieldDisplay from "$lib/field/FieldDisplay.svelte";
    import { machine } from "$lib/main/machine.js";
	import { getContext } from "svelte";

    /**
     * @typedef {Object} Props
     * @property {string} collection - The name of the collection being rendered.
     * @property {Record<string, any>} data - The data object for the fields (bindable).
     * @property {"show" | "update"} [mode="show"] - Display mode of the fields.
     * @property {string[]} [showFields] - Optional whitelist of field names to display.
     */
    let {
      collection = getContext('collection'),
      data = $bindable(),
      mode = "show",
      showFields
    }:{
      collection: string;
      data: Record<string, any>;
      mode?:  'show' | 'create' | 'update';
      showFields?: string[];
    } = $props ();

    // Svelte 5: $derived must be called as a function in template
    const scheme = $derived(machine.logic.collection(collection));
    const fieldNames = $derived(() => {
      const fields = scheme?.template?.fields;
      if (fields) {
        let keys = Object.keys(fields);
        if (showFields && Array.isArray(showFields)) {
          return keys.filter((key) => showFields.includes(key));
        }
        return keys;
      }
      return [];
    });
 
  </script>
<div class="form">
  {#if scheme && fieldNames()?.length}
    {#each fieldNames() as fieldName (fieldName)}
      {#if scheme.template?.fields && scheme.template.fields[fieldName]}
        <FieldDisplay
          {collection}
          {fieldName} 
          {mode} 
          bind:data={data}
        />
      {/if}
    {/each}
  {/if}
</div>
<style>
    :global(.form) {
        display: grid;
        grid-template-columns: max-content 1fr;
        grid-column-gap: 0.5rem;
        gap: 0.5rem;
    }
</style>