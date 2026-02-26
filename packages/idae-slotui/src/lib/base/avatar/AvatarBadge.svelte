<!-- @component snippet component AvatarBadge — for Avatar -->
<script module lang="ts">
	export type AvatarBadgeProps = any;
</script>

<script lang="ts">
	const { children } = $props();
</script>

{#snippet avatarBadge()}
	{@render children?.()}
{/snippet}

