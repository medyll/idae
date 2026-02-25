<!-- @component snippet component LoginAvatar — small renderable part for Login -->
<script module lang="ts">
export type LoginAvatarProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<LoginAvatarProps>();
</script>

{#snippet LoginAvatar()}
	{@render children?.()}
{/snippet}
