<!--
FieldInPlace.svelte
Svelte 5 in-place field edit/confirm
@role form-field
@prop {string} collection - Collection name
@prop {string} field - Field name
@prop {Function} validate - Validation callback
@prop {string} [message] - Confirm message
@slot initial - Initial content
@slot children - Button content
@slot confirm - Confirm button content (optional)
@slot cancel - Cancel button content (optional)
@event confirm - Emitted on confirm
@event cancel - Emitted on cancel
--> 
<script lang="ts">
    import { Icon } from '@medyll/idae-slotui-svelte';
    import type { Snippet } from 'svelte';

    // Destructuring props with default snippet values
    let { 
        collection, 
        field, 
        validate, 
        message = '',
        // Snippets can be passed as props in Svelte 5
        initial,
        children,
        confirm,
        cancel
    } = $props<{ 
        collection: string; 
        field: string; 
        validate: () => void; 
        message?: string;
        initial?: Snippet;
        children?: Snippet;
        confirm?: Snippet<[string]>;
        cancel?: Snippet;
    }>();

    let status = $state<'default' | 'show_confirm'>('default');

    // Internal handlers
    const handleValidate = () => {
        validate?.();
        status = 'default';
    };

    const toggleStatus = () => {
        status = status === 'default' ? 'show_confirm' : 'default';
    };
</script>

<div class="line-gap-2 w-full">
    {#if initial}
        {@render initial()}
    {/if}

    {#if status === 'default'}
        <button
            class="line-gap-2"
            aria-label="Edit"
            onclick={toggleStatus}
        >
            {#if children}
                {@render children()}
            {:else}
                <Icon icon="mdi:pencil" class="md" />
            {/if}
        </button>
    {:else}
        <div class="flex items-center gap-2">
            <button
                aria-label="Confirm"
                onclick={handleValidate}
            >
                {#if confirm}
                    {@render confirm(message)}
                {:else}
                    {message}
                    <Icon class="color-success md text-green-800" icon="mdi:done" />
                {/if}
            </button>

            <button
                aria-label="Cancel"
                onclick={toggleStatus}
            >
                {#if cancel}
                    {@render cancel()}
                {:else}
                    <Icon icon="typcn:cancel" style="color: red" class="md fill-red-800" />
                {/if}
            </button>
        </div>
    {/if}
</div>