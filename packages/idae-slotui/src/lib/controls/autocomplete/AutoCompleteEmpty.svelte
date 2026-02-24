<!-- @component snippet component AutoCompleteEmpty for root: AutoComplete -->
<script lang="ts">
  let { children, ...restProps }: { children?: any; [key: string]: any } = $props();
</script>

{#snippet autoCompleteEmpty()}
  {@render children?.()}
{/snippet}
