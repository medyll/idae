<!-- @component snippet component AutoCompleteNoResults for root: AutoComplete -->
<script module lang="ts">
export type AutoCompleteNoResultsProps = Record<string, any>;
</script>

<script lang="ts">
  const { children, ...restProps } = $props<AutoCompleteNoResultsProps & { children?: any }>();
</script>

{#snippet autoCompleteNoResults()}
  {@render children?.()}
{/snippet}
