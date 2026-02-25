<!-- @component snippet component ConfirmInitial — small renderable part for Confirm -->
<script module lang="ts">
export type ConfirmInitialProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<ConfirmInitialProps>();
</script>

{#snippet ConfirmInitial()}
	{@render children?.()}
{/snippet}
