<!-- @component snippet component RatingScoredIcon — small renderable part for Rating -->
<script module lang="ts">
export type RatingScoredIconProps = Record<string, any>;
</script>

<script lang="ts">
const { children } = $props<RatingScoredIconProps>();
</script>

{#snippet RatingScoredIcon()}
	{@render children?.()}
{/snippet}
