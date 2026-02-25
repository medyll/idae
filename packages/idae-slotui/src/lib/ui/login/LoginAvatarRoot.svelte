<!-- @component snippet component LoginAvatarRoot — small renderable part for Login -->
<script module lang="ts">
export type LoginAvatarRootProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<LoginAvatarRootProps>();
</script>

{#snippet LoginAvatarRoot()}
	{@render children?.()}
{/snippet}
