<!-- @component snippet component MarqueeChildren — for Marquee -->
<script module lang="ts">
    export type MarqueeChildrenProps = Record<string, any>;
</script>

<script lang="ts">
    const { children } = $props<MarqueeChildrenProps>();
</script>

{#snippet children()}
    {@render children?.()}
{/snippet}