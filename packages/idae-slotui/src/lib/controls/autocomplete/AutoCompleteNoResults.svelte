<!-- @component Snippet: AutoCompleteNoResults - snippet component for root: AutoComplete -->
<script lang="ts">
  let { children, ...restProps }: { children?: any; [key: string]: any } = $props();
</script>

{#snippet autoCompleteNoResults()}
  {@render children?.()}
{/snippet}
