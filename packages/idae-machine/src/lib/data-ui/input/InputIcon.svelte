<script lang="ts">
    import Icon from '@iconify/svelte';

    let {
        value = $bindable<string>(''),
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
    {#if value}
        <Icon icon={value} class="icon-field" />
    {:else}
        <span class="icon-empty">—</span>
    {/if}
{:else}
    <div class="icon-edit">
        {#if value}
            <Icon icon={value} class="icon-preview" />
        {/if}
        <input
            type="text"
            bind:value
            placeholder="ex: mdi:home"
            {id}
            {name}
            {form}
        />
    </div>
{/if}

<style>
    .icon-edit {
        display: flex;
        align-items: center;
        gap: var(--space-1, 0.25rem);
    }
    .icon-edit input {
        flex: 1;
    }
    :global(.icon-preview) {
        font-size: 1.25rem;
        flex-shrink: 0;
    }
</style>
