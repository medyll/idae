<!--
FieldDisplay.svelte
Svelte 5 field renderer — dispatches to type-specific input atoms.
@role form-field
@prop {string} collection - Collection name
@prop {string} fieldName - Field name
@prop {object} data - Data object (bindable)
@prop {'show'|'create'|'update'} [mode] - Form mode
@prop {string} [inputForm] - Form id
@prop {boolean|string} [showLabel] - Label visibility/position
-->
<script lang="ts" generics="COL extends Record<string,unknown>">
    import type { TplCollectionName } from '@medyll/idae-idbql';
    import { getContext, untrack } from 'svelte';
    import { machine } from '$lib/main/machine.js';
    import InputEmail    from '$lib/main-ui/input/InputEmail.svelte';
    import InputCurrency from '$lib/main-ui/input/InputCurrency.svelte';
    import InputBoolean  from '$lib/main-ui/input/InputBoolean.svelte';
    import InputTextarea from '$lib/main-ui/input/InputTextarea.svelte';
    import InputSelect   from '$lib/main-ui/input/InputSelect.svelte';

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
    } = $props();

    function safeScheme() {
        try { return machine.logic.collection(collection); } catch { return null; }
    }
    const scheme             = $derived(safeScheme());
    const fieldForge         = $derived(scheme ? scheme.fieldForge(String(fieldName), data ?? {}) : null);
    const schemeFieldValues  = $derived(scheme?.collectionValues ?? null);
    const inputDataset       = $derived(schemeFieldValues ? schemeFieldValues.getInputDataSet(fieldName, data ?? {}) : {});

    const isPrivate      = $derived(fieldForge?.fieldArgs?.includes('private') ?? false);
    const labelPosition  = $derived(
        typeof showLabel === 'string' ? showLabel : (showLabel === true ? 'above' : '')
    );

    // Extract FK collection name from fieldType like 'fk-category.id' → 'category'
    const fkCollection = $derived(
        fieldForge?.fieldType?.startsWith('fk-')
            ? (fieldForge.fieldType as string).replace('fk-', '').split('.')[0]
            : null
    );

    // Internal value — bidirectional sync
    let internalValue = $state<unknown>(undefined);
    let error = $state<string | null>(null);

    // parent → child (tracked read, untracked write to avoid loop)
    $effect(() => {
        const incoming = data?.[fieldName];
        untrack(() => { internalValue = incoming; });
    });

    // child → parent
    function updateValue(val: unknown) {
        internalValue = val;
        if (data) (data as Record<string, unknown>)[String(fieldName)] = val;
    }
</script>


{#snippet fieldShow()}
    <div class="flex w-48 gap-2">
        <div class="flex-1" {...inputDataset}>
            {#if fkCollection}
                <!-- FK show: display from related store if available -->
                {internalValue ?? '—'}
            {:else}
                {fieldForge.format}
            {/if}
        </div>
    </div>
{/snippet}


{#snippet fieldInput()}
    {#if fieldForge.fieldType === 'id'}
        {#if mode !== 'create'}
            <input
                type="hidden"
                value={internalValue}
                {...inputDataset}
                id={fieldName}
                name={fieldName}
                form={inputForm}
            />
        {/if}

    {:else if fkCollection}
        <InputSelect
            bind:value={internalValue}
            collection={fkCollection}
            id={fieldName}
            name={fieldName}
            form={inputForm}
        />

    {:else if fieldForge.fieldType === 'boolean'}
        <InputBoolean
            bind:value={internalValue as boolean}
            id={fieldName}
            name={fieldName}
            form={inputForm}
        />

    {:else if fieldForge.fieldType === 'email'}
        <InputEmail
            value={internalValue as string}
            error={error}
            id={fieldName}
            oninput={(e: Event) => updateValue((e.target as HTMLInputElement).value)}
        />

    {:else if fieldForge.fieldType === 'currency'}
        <InputCurrency
            value={internalValue as number}
            error={error}
        />

    {:else if fieldForge.fieldType?.includes('area')}
        <InputTextarea
            bind:value={internalValue as string}
            rows={4}
            id={fieldName}
            name={fieldName}
            form={inputForm}
        />

    {:else}
        <!-- Generic: text, number, date, datetime, time, password, url, phone, text-* -->
        <input
            style="width: 100%"
            value={internalValue}
            type={fieldForge.htmlInputType}
            {...inputDataset}
            id={fieldName}
            name={fieldName}
            form={inputForm}
            oninput={(e: Event) => updateValue((e.target as HTMLInputElement).value)}
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


<style>
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
