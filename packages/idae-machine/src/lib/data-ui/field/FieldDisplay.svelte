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
    import type { TplCollectionName } from '$lib/types/machine-model.js';
    import { getContext, untrack } from 'svelte';
    import { machine } from '$lib/main/machine.js';
    import InputEmail    from '$lib/data-ui/input/InputEmail.svelte';
    import InputCurrency from '$lib/data-ui/input/InputCurrency.svelte';
    import InputBoolean  from '$lib/data-ui/input/InputBoolean.svelte';
    import InputTextarea from '$lib/data-ui/input/InputTextarea.svelte';
    import InputSelect   from '$lib/data-ui/input/InputSelect.svelte';

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
        try { return collection ? machine.logic.collection(collection) : null; } catch { return null; }
    }
    const scheme             = $derived(safeScheme());
    const fieldForge         = $derived(scheme ? scheme.fieldForge(String(fieldName), data ?? {}) : null);
    const schemeFieldValues  = $derived(scheme?.collectionValues ?? null);
    const inputDataset       = $derived.by(() => {
        if (schemeFieldValues) {
            return schemeFieldValues.getInputDataSet(String(fieldName), data ?? {} as Record<string, unknown>);
        }
        // fallback when scheme is unavailable
        const idx = (data as Record<string, unknown> | undefined)?.id;
        return {
            'data-collection':   String(collection ?? ''),
            'data-collectionId': idx !== undefined ? String(idx) : '',
            'data-fieldName':    String(fieldName),
            'data-fieldType':    '',
            'data-fieldArgs':    ''
        };
    });

    const isPrivate      = $derived(fieldForge?.fieldArgs?.includes('private') ?? false);
    const inputSizeClass = $derived(fieldForge?.inputSize ? `input-size-${fieldForge.inputSize}` : '');
    const labelPosition  = $derived(
        typeof showLabel === 'string' ? showLabel : (showLabel === true ? 'above' : '')
    );

    // Extract FK collection name from fieldType like 'fk-category.id' → 'category'
    const fkCollection = $derived(
        fieldForge?.fieldType?.startsWith('fk-')
            ? (fieldForge.fieldType as string).replace('fk-', '').split('.')[0]
            : null
    );

    // FK presentation label — resolves raw id to human-readable label
    const fkScheme = $derived(
        fkCollection
            ? (() => { try { return machine.logic.collection(fkCollection); } catch { return null; } })()
            : null
    );
    const fkIndexField        = $derived((fkScheme?.template?.index ?? 'id') as string);
    const fkPresentationFields = $derived(
        (fkScheme?.template?.presentation ?? 'name').split(' ').filter(Boolean)
    );
    // Internal value — bidirectional sync (declared before fkLabel which uses it)
    let internalValue = $state<unknown>(undefined);
    let error = $state<string | null>(null);

    const fkStore = $derived(machine.store(fkCollection ?? ''));
    const fkItems  = $derived(fkCollection ? fkStore.items : []);
    const fkLabel  = $derived((() => {
        if (!fkCollection || internalValue === undefined || internalValue === null) return '—';
        const item = (fkItems as Record<string, unknown>[]).find(i => i[fkIndexField] === internalValue);
        if (!item) return String(internalValue);
        const label = fkPresentationFields
            .map((f: string) => item[f])
            .filter((v: unknown) => v !== undefined && v !== null && v !== '')
            .join(' ');
        return label || String(item[fkIndexField] ?? '—');
    })());

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
                {fkLabel}
            {:else}
                {fieldForge?.format}
            {/if}
        </div>
    </div>
{/snippet}


{#snippet fieldInput()}
    {#if fieldForge?.fieldType === 'id'}
        {#if mode !== 'create'}
            <input
                type="hidden"
                value={internalValue}
                {...inputDataset}
                id={String(fieldName)}
                name={String(fieldName)}
                form={inputForm}
            />
        {/if}

    {:else if fkCollection}
        <InputSelect
            bind:value={internalValue}
            collection={fkCollection}
            id={String(fieldName)}
            name={String(fieldName)}
            form={inputForm}
        />

    {:else if fieldForge?.fieldType === 'boolean'}
        <InputBoolean
            bind:value={internalValue as boolean}
            id={String(fieldName)}
            name={String(fieldName)}
            form={inputForm}
        />

    {:else if fieldForge?.fieldType === 'email'}
        <InputEmail
            value={internalValue as string}
            error={error}
            id={String(fieldName)}
            oninput={(e: Event) => updateValue((e.target as HTMLInputElement).value)}
        />

    {:else if (fieldForge?.fieldType as string) === 'currency'}
        <InputCurrency
            value={internalValue as number}
            error={error}
        />

    {:else if fieldForge?.fieldType?.includes('area')}
        <InputTextarea
            bind:value={internalValue as string}
            rows={4}
            id={String(fieldName)}
            name={String(fieldName)}
            form={inputForm}
        />

    {:else}
        <!-- Generic: text, number, date, datetime, time, password, url, phone, text-* -->
        <input
            style="width: 100%"
            value={internalValue}
            type={fieldForge?.htmlInputType}
            {...inputDataset}
            id={String(fieldName)}
            name={String(fieldName)}
            form={inputForm}
            oninput={(e: Event) => updateValue((e.target as HTMLInputElement).value)}
        />
    {/if}
{/snippet}


{#if fieldForge}
    {#if !isPrivate}
        <label form={inputForm} for={String(fieldName)} class="field-line {labelPosition} {inputSizeClass}">
            <span class="field-label">{fieldName}</span>
            <div class="field-input" {...inputDataset}>
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
    /* inputSize presets — control .field-input max-width or grid span */
    .field-line.input-size-xs  { --field-input-width: 5rem; }
    .field-line.input-size-sm  { --field-input-width: 10rem; }
    .field-line.input-size-md  { --field-input-width: 100%; }
    .field-line.input-size-full { grid-column: 1 / -1; }

    .field-input { width: var(--field-input-width, 100%); }
    .field-label {
        font-weight: bold;
    }
    .error-message { color: red; font-size: 0.9em; margin-top: 0.2em; }
</style>
