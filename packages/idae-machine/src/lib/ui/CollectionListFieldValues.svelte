<script lang="ts">
    /**
     * @component
     * Iterates over a collection's fields and renders a FieldValue for each.
     * Supports filtering via `showFields` and dynamic discovery via `scheme` or `data`.
     */
    import FieldValue from "../form/FieldValue.svelte";
    import { machine } from "$lib/main/machine.js";

    /**
     * @typedef {Object} Props
     * @property {string} collection - The name of the collection being rendered.
     * @property {Record<string, any>} data - The data object for the fields (bindable).
     * @property {"show" | "edit"} [mode="show"] - Display mode of the fields.
     * @property {MachineScheme} [scheme] - The machine scheme defining field metadata.
     * @property {string[]} [showFields] - Optional whitelist of field names to display.
     */
    let {
      collection,
      data = $bindable(),
      mode = "show",
      showFields
    } = $props<{
      collection: string;
      data: Record<string, any>;
      mode?: "show" | "edit";
      showFields?: string[];
    }>();

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

    // Map 'edit' to 'update' for FieldValue
    const fieldMode = $derived(() => mode === 'edit' ? 'update' : mode);
  </script>
  
  {#if scheme && fieldNames()?.length}
    {#each fieldNames() as fieldName}
      {#if scheme.template?.fields && scheme.template.fields[fieldName]}
        <FieldValue
          {collection}
          {fieldName}
          bind:data={data}
          mode={fieldMode()}
        />
      {/if}
    {/each}
  {/if}