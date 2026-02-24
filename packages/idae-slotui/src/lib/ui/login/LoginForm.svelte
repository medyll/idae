<!-- @component snippet component LoginForm — small renderable part for Login -->
<script lang="ts">
const { children } = $props();
</script>

{#snippet LoginForm()}
	{@render children?.()}
{/snippet}
