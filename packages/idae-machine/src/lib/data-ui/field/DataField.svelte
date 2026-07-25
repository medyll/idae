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
<script module lang="ts">
    import type { TplCollectionName } from '$lib/types/index.js';

    export interface DataFieldProps<COL extends Record<string, unknown> = Record<string, unknown>> {
        collection?: TplCollectionName;
        fieldName: keyof COL;
        data: COL;
        mode?: 'show' | 'create' | 'update';
        // TODO: editInPlace — legacy app_field_update feature, planned for reimplementation
        inputForm?: string;
        showLabel?: boolean | string
    }
</script>

<script lang="ts" generics="COL extends Record<string,unknown>">
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
    }: DataFieldProps<COL> = $props();

    const scheme            = $derived(collection ? machine.logic.collection(collection) : null);
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
    const fkScheme = $derived(fkCollection ? machine.logic.collection(fkCollection) : null);
    const fkLabel  = $derived.by(() => {
        if (!fkCollection || internalValue == null) return '—';
        // Prefer the denorm snapshot already fed onto the record (`fks.<field>` bare or
        // `fks.<field>_<value>` suffixed — see MachineFkFold/server FkFolder). The raw
        // scalar's type (id vs code) doesn't have to match fkIndexField for this to work,
        // unlike the fkStore re-lookup below.
        const snapshot = readFkSnapshot(data as Record<string, unknown> | null | undefined, String(fieldName), internalValue);
        if (snapshot) return fkScheme?.collectionValues.presentation(snapshot) || String(internalValue);
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
    // FK denorm snapshot lookup — bare `fks.<name>` (canonical single) or suffixed
    // `fks.<name>_<value>` (server FkFolder convention, always suffixed/id-keyed).
    // Falls back to scanning any `<name>_*` key when `value`'s type doesn't match the
    // suffix verbatim (e.g. numeric id vs string), since this is a single relation.
    function readFkSnapshot(rec: Record<string, unknown> | null | undefined, name: string, value: unknown): Record<string, unknown> | undefined {
        const bag = rec?.fks as Record<string, unknown> | undefined;
        if (!bag) return undefined;
        if (bag[name] != null && typeof bag[name] === 'object') return bag[name] as Record<string, unknown>;
        if (value != null) {
            const suffixed = bag[`${name}_${value}`];
            if (suffixed != null && typeof suffixed === 'object') return suffixed as Record<string, unknown>;
        }
        const prefix = `${name}_`;
        const key = Object.keys(bag).find((k) => k.startsWith(prefix));
        return key ? (bag[key] as Record<string, unknown>) : undefined;
    }

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
        <div class="field-line {labelPosition} {inputSizeClass}">
            {#if showLabel}
                <label class="field-label" for={String(fieldName)} title={fieldLabel}>{fieldLabel}</label>
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
        </div>
    {/if}
{:else}
    <div class="error-message">Champ ou schéma non trouvé pour {fieldName}</div>
{/if}


<style>
	@layer components {
    .field-line {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        gap: var(--gutter-sm);
        padding: var(--pad-xs) var(--pad-sm) var(--pad-xs) 0;
		flex: 1 1 calc(var(--gutter-3xl) * 5);
    }
    .field-line.input-size-full {
        flex: 1 1 100%;
        flex-direction: column;
        align-items: stretch;
    }

    .field-label {
        /* fixed width (legacy .label_field: width:100px) — alignment comes from a
           constant label column, not from an elastic min/max range.
           NB: --field-label-w (not css-base's --field-label-width, which is a
           different token — grid label column for .form/.field, default max-content). */
		flex: 0 0 var(--field-label-w, calc(var(--gutter-3xl) + var(--gutter-2xl)));
		width: var(--field-label-w, calc(var(--gutter-3xl) + var(--gutter-2xl)));
        color: var(--color-text-muted);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .field-line.input-size-full .field-label { flex: 0 0 auto; width: auto; }

    /* inputSize presets — constrain the INPUT, not the field wrapper */
    .field-input { min-width: 0; }
	.field-line.input-size-xs .field-input { width: calc(var(--gutter-3xl) + var(--gutter-md)); }
	.field-line.input-size-sm .field-input { width: calc(var(--gutter-3xl) * 2.5); }
	.field-line.input-size-md .field-input { width: calc(var(--gutter-3xl) * 4.5); }
	.field-line.input-size-lg .field-input { width: calc(var(--gutter-3xl) * 7); }
    .field-line.input-size-full .field-input { width: 100%; }
    /* default (no preset): input fills available */
    .field-input { flex: 1 1 auto; }
    .field-input :global(input),
    .field-input :global(select),
    .field-input :global(textarea) { width: 100%; }
	.error-message { color: var(--color-critical); font-size: var(--text-xs); margin-top: var(--marg-xs); }
	}
</style>
