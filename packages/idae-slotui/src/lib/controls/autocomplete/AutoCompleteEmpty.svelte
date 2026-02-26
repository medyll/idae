<!-- @component snippet component AutoCompleteEmpty for root: AutoComplete -->
<script module lang="ts">
export type AutoCompleteEmptyProps = Record<string, any>;
</script>

<script lang="ts">
  const { children, ...restProps } = $props<AutoCompleteEmptyProps & { children?: any }>();
</script>

{#snippet autoCompleteEmpty()}
  {@render children?.()}
{/snippet}
