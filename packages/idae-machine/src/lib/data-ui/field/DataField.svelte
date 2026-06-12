<!--
DataField.svelte
Svelte 5 field renderer — dispatches to type-specific field atoms (show + edit).
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
    import {
        FieldText,
        FieldBoolean,
        FieldEmail,
        FieldCurrency,
        FieldTextarea,
        FieldColor,
        FieldIcon,
        FieldSelect,
        FieldAiPrompt
    } from '$lib/data-ui/field/snippets/index.js';

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
    // Icon glyph size: reuse the inputSize t-shirt taxonomy (xs/sm/md/lg); 'full' → 'lg'.
    const iconSize       = $derived(
        (fieldForge?.inputSize === 'full' ? 'lg' : fieldForge?.inputSize) as 'xs' | 'sm' | 'md' | 'lg' | undefined
    );
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
        const incoming = fkCollection
            ? readFkRaw(data as Record<string, unknown> | null | undefined, String(fieldName), fkIndexField)
            : data?.[fieldName];
        untrack(() => {
            internalValue = incoming;
            hasParentValue = true;
        });
    });

    $effect(() => {
        if (!hasParentValue || !data) return;
        const key = String(fieldName);
        const current = fkCollection
            ? readFkRaw(data as Record<string, unknown>, key, fkIndexField)
            : (data as Record<string, unknown>)[key];
        if (current === internalValue) return;

        untrack(() => {
            (data as Record<string, unknown>)[key] = internalValue;
        });
    });

    // FK raw value lookup — supports both canonical flat storage (`data[fieldName]` = code)
    // and legacy nested storage (`data.fks[fieldName]` = { code } or bare scalar), as seeded
    // by publishModel.ts for system appscheme_* collections.
    function readFkRaw(rec: Record<string, unknown> | null | undefined, name: string, indexField: string): unknown {
        if (!rec) return undefined;
        const flat = rec[name];
        if (flat != null) return flat;
        const bag = rec.fks as Record<string, unknown> | undefined;
        const nested = bag?.[name];
        if (nested == null) return undefined;
        if (typeof nested === 'object') {
            return (nested as Record<string, unknown>)[indexField] ?? (nested as Record<string, unknown>).code;
        }
        return nested;
    }
</script>

{#if fieldForge}
    {#if !isPrivate}
        <label form={inputForm} for={String(fieldName)} class="field-line {labelPosition} {inputSizeClass}">
            {#if showLabel}
                <span class="field-label">{fieldLabel}</span>
            {/if}
            <div class="field-input" {...inputDataset}>
                {#if fieldForge.fieldType === 'id'}
                    {#if mode !== 'create'}
                        <input
                            type="hidden"
                            value={internalValue}
                            id={String(fieldName)}
                            name={String(fieldName)}
                            form={inputForm}
                        />
                    {/if}

                {:else if fkCollection}
                    <FieldSelect
                        bind:value={internalValue}
                        display={fkLabel}
                        {mode}
                        collection={fkCollection}
                        targetField={fkIndexField}
                        id={String(fieldName)}
                        name={String(fieldName)}
                        form={inputForm}
                    />

                {:else if fieldForge.fieldType === 'boolean'}
                    <FieldBoolean
                        bind:value={internalValue as boolean}
                        {mode}
                        id={String(fieldName)}
                        name={String(fieldName)}
                        form={inputForm}
                    />

                {:else if fieldForge.fieldType === 'email'}
                    <FieldEmail
                        bind:value={internalValue as string}
                        {mode}
                        {error}
                        id={String(fieldName)}
                        name={String(fieldName)}
                        form={inputForm}
                    />

                {:else if (fieldForge.fieldType as string) === 'currency'}
                    <FieldCurrency
                        bind:value={internalValue as number | string}
                        display={fieldForge.format}
                        {mode}
                        {error}
                        id={String(fieldName)}
                        name={String(fieldName)}
                        form={inputForm}
                    />

                {:else if fieldForge.fieldType?.includes('area')}
                    <FieldTextarea
                        bind:value={internalValue as string}
                        display={fieldForge.format}
                        {mode}
                        rows={4}
                        id={String(fieldName)}
                        name={String(fieldName)}
                        form={inputForm}
                    />

                {:else if fieldForge.fieldType === 'color'}
                    <FieldColor
                        bind:value={internalValue as string}
                        {mode}
                        id={String(fieldName)}
                        name={String(fieldName)}
                        form={inputForm}
                    />

                {:else if fieldForge.fieldType === 'icon'}
                    <FieldIcon
                        bind:value={internalValue as string}
                        {mode}
                        size={iconSize ?? 'md'}
                        id={String(fieldName)}
                        name={String(fieldName)}
                        form={inputForm}
                    />

                {:else if fieldForge.fieldType === 'ai-prompt'}
                    <FieldAiPrompt
                        bind:value={internalValue as string}
                        {mode}
                        session={data && 'id' in data && 'code' in data
                            ? { id: data.id as number, code: data.code as string }
                            : undefined}
                        id={String(fieldName)}
                        name={String(fieldName)}
                        form={inputForm}
                    />

                {:else}
                    <!-- Generic: text, number, date, datetime, time, password, url, phone, text-* -->
                    <FieldText
                        bind:value={internalValue}
                        display={fieldForge.format}
                        {mode}
                        type={fieldForge.htmlInputType}
                        id={String(fieldName)}
                        name={String(fieldName)}
                        form={inputForm}
                    />
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
        display: flex;
        flex-direction: row;
        align-items: baseline;
        gap: var(--space-1, 0.25rem);
        flex: 0 0 auto; /* sized by content: label + input */
    }
    .field-line.input-size-full {
        flex: 1 1 100%;
        flex-direction: column;
        align-items: stretch;
    }

    .field-label {
        flex: 0 0 var(--field-label-w, 90px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .field-line.input-size-full .field-label { flex: 0 0 auto; }

    /* inputSize presets — constrain the INPUT, not the field wrapper */
    .field-input { min-width: 0; }
    .field-line.input-size-xs .field-input { width: 5rem; }
    .field-line.input-size-sm .field-input { width: 10rem; }
    .field-line.input-size-md .field-input { width: 18rem; }
    .field-line.input-size-lg .field-input { width: 28rem; }
    .field-line.input-size-full .field-input { width: 100%; }
    /* default (no preset): input fills available */
    .field-input { flex: 1 1 auto; }
    .field-input :global(input),
    .field-input :global(select),
    .field-input :global(textarea) { width: 100%; }
    .error-message { color: red; font-size: 0.9em; margin-top: 0.2em; }
</style>
