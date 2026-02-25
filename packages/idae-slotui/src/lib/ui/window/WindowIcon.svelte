<!-- @component snippet component WindowIcon — for Window -->
<script module lang="ts">
    export type WindowIconProps = Record<string, any>;
</script>

<script lang="ts">
    const { children } = $props<WindowIconProps>();
</script>

{#snippet windowIcon()}
    {@render children?.()}
{/snippet}
