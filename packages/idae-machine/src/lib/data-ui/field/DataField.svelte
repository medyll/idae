<!--
DataField.svelte
Svelte 5 field renderer — dispatches to type-specific input atoms.
@role data-field
@prop {string} collection - Collection name
@prop {string} fieldName - Field name
@prop {object} data - Data object (bindable)
@prop {'show'|'create'|'update'} [mode] - Form mode
@prop {string} [inputForm] - Form id
@prop {boolean|string} [showLabel] - Label visibility/position
-->
<script lang="ts" generics="COL extends Record<string,unknown>">
    import type { TplCollectionName } from '$lib/types/index.js';
    import { getContext, untrack } from 'svelte';
    import { machine } from '$lib/main/machine.js';
    import { MachineRecordIdentity } from '$lib/main/index.js';
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
        fieldName: keyof COL;
        data: COL;
        mode?: 'show' | 'create' | 'update';
        // TODO: editInPlace — legacy app_field_update feature, planned for reimplementation
        inputForm?: string;
        showLabel?: boolean | string
    } = $props();

    const scheme            = $derived(collection ? machine.logic.collectionOr(collection, null) : null);
    const fieldForge        = $derived(scheme ? scheme.fieldForge(String(fieldName), data ?? {}) : null);
    const schemeFieldValues = $derived(scheme?.collectionValues ?? null);
    const inputDataset      = $derived.by(() => {
        if (schemeFieldValues) {
            return schemeFieldValues.getInputDataSet(String(fieldName), data ?? {} as Record<string, unknown>);
        }
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

    // FK: derive from descriptor — single source of truth, no re-parsing fk- strings
    const descriptor   = $derived(scheme?.collectionValues?.descriptor(String(fieldName)) ?? null);
    const fkCollection = $derived(descriptor?.kind === 'fk' ? descriptor.fkCollection! : null);
    const fkIndexField = $derived(descriptor?.fkIndexField ?? 'id');

    // Internal value — bidirectional sync
    let internalValue  = $state<unknown>(undefined);
    let error          = $state<string | null>(null);
    let hasParentValue = $state(false);

    // FK store — guard prevents machine.store('') phantom subscription on non-FK fields
    const fkStore  = $derived(fkCollection ? machine.store(fkCollection) : { records: [] as Record<string, unknown>[] });
    const fkItems  = $derived(fkStore.records as Record<string, unknown>[]);
    const fkScheme = $derived(fkCollection ? machine.logic.collectionOr(fkCollection, null) : null);
    const fkLabel  = $derived.by(() => {
        if (!fkCollection || internalValue == null) return '—';
        const item = fkItems.find(i => MachineRecordIdentity.recordMatchesIndex(i, fkIndexField, internalValue));
        if (!item) return String(internalValue);
        return fkScheme?.collectionValues.presentation(item) || String(internalValue);
    });

    // FK field label = target collection's appscheme.name (e.g. "Catégorie"),
    // resolved upstream-style from the appscheme store. Falls back to fieldName.
    const hasAppscheme  = $derived('appscheme' in (machine.logic?.model ?? {}));
    const fkTargetName  = $derived.by(() => {
        if (!fkCollection || !hasAppscheme) return null;
        const meta = (machine.store('appscheme').records as Record<string, unknown>[])
            .find(i => i.code === fkCollection);
        return (meta?.name as string) ?? fkCollection;
    });
    const fieldLabel    = $derived(fkTargetName ?? String(fieldName));

    // parent → child (tracked read, untracked write to avoid loop)
    $effect(() => {
        const incoming = data?.[fieldName];
        untrack(() => {
            internalValue = incoming;
            hasParentValue = true;
        });
    });

    $effect(() => {
        if (!hasParentValue || !data) return;
        const key = String(fieldName);
        if ((data as Record<string, unknown>)[key] === internalValue) return;

        untrack(() => {
            (data as Record<string, unknown>)[key] = internalValue;
        });
    });

    function updateValue(val: unknown) {
        internalValue = val;
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
            targetField={fkIndexField}
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
            bind:value={internalValue as string}
            error={error}
            id={String(fieldName)}
            name={String(fieldName)}
            form={inputForm}
        />

    {:else if (fieldForge?.fieldType as string) === 'currency'}
        <InputCurrency
            bind:value={internalValue as number | string}
            error={error}
            id={String(fieldName)}
            name={String(fieldName)}
            form={inputForm}
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
            {#if showLabel}
                <span class="field-label">{fieldLabel}</span>
            {/if}
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
    .field-line.input-size-xs   { --field-input-width: 5rem; }
    .field-line.input-size-sm   { --field-input-width: 10rem; }
    .field-line.input-size-md   { --field-input-width: 100%; }
    .field-line.input-size-lg   { --field-input-width: 20rem; }
    .field-line.input-size-full { grid-column: 1 / -1; }

    .field-input { width: var(--field-input-width, 100%); }
    .field-input :global(input),
    .field-input :global(select),
    .field-input :global(textarea) { width: 100%; }
    .field-label {
        font-weight: bold;
    }
    .error-message { color: red; font-size: 0.9em; margin-top: 0.2em; }
</style>
