<!--
FieldDisplay.svelte
Svelte 5 field input for all types
@role form-field
@prop {string} collection - Collection name
@prop {any} collectionId - Optional collection id
@prop {string} fieldName - Field name
@prop {object} data - Data object (bindable)
@prop {'show'|'create'|'update'} [mode] - Form mode
@prop {boolean} [editInPlace] - Enable in-place editing
@prop {string} [inputForm] - Form id
@prop {boolean|string} [showLabel] - Label position
@slot input (let:fieldName, let:fieldForge, let:data) - Custom input rendering
@event change - Emitted on value change (future)
-->
<script lang="ts" generics="COL extends Record<string,unknown>">
    import type { TplCollectionName } from '@medyll/idae-idbql';
    import { getContext } from 'svelte';
    import { machine } from '$lib/main/machine.js';

    // 1. Unified props with bindable data
    let {
        collection = getContext('collection'),
        fieldName,
        data = $bindable(),
        mode = 'show',
        inputForm,
        showLabel = true
    }:{
        collection?: TplCollectionName;
        collectionId?: unknown;
        fieldName: keyof COL;
        data: COL;
        mode?: 'show' | 'create' | 'update';
        editInPlace?: boolean;
        inputForm?: string;
        showLabel?: boolean | string
    } = $props ();

    // 2. Pure reactive derivations
    const scheme = $derived(machine.logic.collection(collection));
    const fieldForge = $derived(scheme.fieldForge(String(fieldName), data ?? {}));
    const schemeFieldValues = $derived(scheme.collectionValues);
    const inputDataset = $derived(schemeFieldValues.getInputDataSet(fieldName, data ?? {}));

    const isPrivate = $derived(fieldForge.fieldArgs?.includes('private'));
    const labelPosition = $derived(
        typeof showLabel === 'string' ? showLabel : (showLabel === true ? 'above' : '')
    );

    // 3. Bidirectional state binding with $effect
    let internalValue = $state<unknown>(undefined);
    let error = $state<string | null>(null);

    /**
     * Sync parent data changes to internal state (parent → child)
     */
    $effect(() => {
        internalValue = data ? data[fieldName] : undefined;
    });

</script>


{#snippet fieldShow()}
    <div class="flex w-48 gap-2">
        <div class="flex-1" {...inputDataset}>{fieldForge.format}</div>
    </div>
{/snippet}

{#snippet fieldInput()}
    {#if fieldForge.fieldType === 'id'}
        {#if mode !== 'create'}
            <input type="hidden" bind:value={internalValue} {...inputDataset} id={fieldName} name={fieldName} form={inputForm} />
        {/if}
    {:else if fieldForge.fieldType === 'boolean'}
        <input type="checkbox" bind:checked={internalValue as boolean} {...inputDataset} id={fieldName} name={fieldName} form={inputForm} />
    {:else if fieldForge.fieldType?.includes('area')}
        <textarea
            style="width:100%;max-width:100%;"
            bind:value={internalValue}
            rows="3"
            class="input h-24"
            {...inputDataset}
            id={fieldName}
            name={fieldName}
            form={inputForm}
        ></textarea>
    {:else}
        <input
            style="width: 100%"
            bind:value={internalValue}
            type={fieldForge.htmlInputType}
            {...inputDataset}
            id={fieldName}
            name={fieldName}
            form={inputForm}
        />
    {/if}
{/snippet}

{#if fieldForge}
  {#if !isPrivate}
    <label form={inputForm} for={fieldName} class="field-line {labelPosition}">
        <span class="field-label">{fieldName}</span>  
        <div class="field-input">
            {#if mode === 'show'}
                {@render fieldShow()}
            {:else}
                {@render fieldInput()}
            {/if}
            {#if error}
                <div class="error-message">{error}</div>
            {/if}
        </div>
    </label>
  {/if}
{:else}
  <div class="error-message">Champ ou schéma non trouvé pour {fieldName}</div>
{/if}

<style >
 
    .field-line {
        grid-column: span 2;
        display: grid;
        grid: inherit;
        grid-template-columns: subgrid;
        grid-gap: inherit;
    }


    .field-label {
        font-weight: bold;
    }
    
    .error-message { color: red; font-size: 0.9em; margin-top: 0.2em; }
</style>
