<!-- @component snippet component SlotRetrievePassword — small renderable part for Login -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet SlotRetrievePassword()}
	{@render children?.()}
{/snippet}
