<script lang="ts">
    let {
        value = $bindable<string>('#000000'),
        mode = 'show',
        id,
        name,
        form
    }: {
        value?: string;
        mode?: 'show' | 'create' | 'update';
        id?: string;
        name?: string;
        form?: string;
    } = $props();
</script>

{#if mode === 'show'}
    <span class="color-swatch" style="background:{value}" title={value}></span>
{:else}
    <input
        type="color"
        bind:value
        {id}
        {name}
        {form}
    />
{/if}

<style>
    .color-swatch {
        display: inline-block;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: var(--radius-xs, 2px);
        border: 1px solid var(--color-border, #ccc);
        vertical-align: middle;
    }
</style>
