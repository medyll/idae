<!-- @component snippet component LoginForm — small renderable part for Login -->
<script module lang="ts">
export type LoginFormProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<LoginFormProps>();
</script>

{#snippet LoginForm()}
	{@render children?.()}
{/snippet}
