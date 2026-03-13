<!-- /**
* @component DataForm Component
* @role User form for creating or editing records in a collection
* @description Renders an editable form with automatic field generation from schema.
* Handles form validation, submission, and data persistence to IndexedDB via machine.store.
* Supports three modes: 'create' (new record), 'edit' (existing), 'show' (readonly).
*
* @example
* ```svelte
* <DataForm
*   collection="users"
*   mode="create"
*   onsubmit={handleSave}
* />
* ```
*/ -->
<script lang="ts" generics="COL = Record<string,unknown>">
    import { machine } from '$lib/main/machine.js';
    // change to MachineSchemeValues.getDefault
    import { SchemeFieldDefaultValues } from '$lib/main/machine/SchemeFieldDefaultValues.js';
    import type { CreateUpdateProps } from '$lib/form/types.js';
    import type { IDbForge } from '@medyll/idae-idbql';
    import DataLinksBack from '$lib/data/DataLinksBack.svelte';
    import FieldDisplay from '$lib/field/FieldDisplay.svelte';
	import DataLinks from './DataLinks.svelte';
	import DataListFields from './DataListFields.svelte';

    /**
     * Component props
     * @typedef {Object} Props
     * @property {string} collection - Collection name to bind form to (e.g., 'users')
     * @property {'create' | 'edit' | 'show'} [mode='create'] - Form mode
     * @property {Record<string, unknown>} [data] - Initial data for edit/show modes
     * @property {Record<string, unknown>} [withData] - Additional data to merge
     * @property {string} [dataId] - Record ID for edit/show modes
     * @property {(payload: unknown) => void} [onsubmit] - Callback when form is submitted successfully
     */
    let {
        onsubmit: onsubmit_callback,
        ...createUpdateProps
    }: CreateUpdateProps<COL> & { onsubmit?: (payload: unknown) => void } = $props();

    // Logic and Store references
    const logic = machine.logic;
    const store = $derived(createUpdateProps.collection ? machine.store[createUpdateProps.collection] : undefined);

    // Reactive derivations for metadata
    const collLogic = $derived(createUpdateProps.collection ? logic.collection(createUpdateProps.collection) : null);
    const formFields = $derived(collLogic?.parse() ?? {});
    const validator = $derived(collLogic?.validator);
    const indexName = $derived(collLogic?.template.index);

    // UI derivations
    // `inputFormId` must be a plain string for the DOM `id`/`form` attributes.
    const inputFormId = `form-${String(createUpdateProps.collection ?? '')}-${createUpdateProps.mode ?? ''}`;

    // Reactive State
    let formData = $state<Record<string, unknown>>({});
    let validationErrors = $state<Record<string, string>>({});
    let isSubmitting = $state(false);

    // Initialize or Reset form data when collection/mode/dataId changes
    $effect(() => {
        if (createUpdateProps.mode === 'create') {
            formData = {
                ...SchemeFieldDefaultValues.getDefaults(Object.keys(formFields), createUpdateProps.collection),
                ...createUpdateProps.data,
                ...createUpdateProps.withData
            };
        } else if (store && createUpdateProps.dataId) {
            // Logic to fetch existing data from store
            const query = store.where({ [indexName]: { eq: createUpdateProps.dataId } });
            const snap = $state.snapshot(query);
            const record = Array.isArray(snap) && snap.length > 0 ? snap[0] : {};

            formData = {
                ...createUpdateProps.data,
                ...createUpdateProps.withData,
                ...record
            };
        }
    });

    /**
     * Validates form data using the logic validator
     */
    const validate = async (data: Record<string, unknown>) => {
        const v = typeof validator === 'function' ? validator() : validator;
        if (!v || typeof v.validateForm !== 'function') return true;

        const ignore = createUpdateProps.mode === 'create' && indexName ? [indexName] : undefined;
        const out = await v.validateForm(data, { ignoreFields: ignore });

        validationErrors = out.errors || {};
        return out.isValid;
    };

    /**
     * Form submission handler
     */
    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        isSubmitting = true;

        const snapshot = $state.snapshot(formData);

        if (!(await validate(snapshot))) {
            isSubmitting = false;
            console.log('Validation failed', validationErrors,snapshot);
            return;
        }

        try {
            if (createUpdateProps.mode === 'create' && !createUpdateProps.dataId) {
                await store?.add({ ...snapshot, ...createUpdateProps.withData });
            } else if (createUpdateProps.mode === 'update' && createUpdateProps.dataId) {
                await store?.update(createUpdateProps.dataId, snapshot);
            }

            // Trigger callback if provided
            onsubmit_callback?.({ mode: createUpdateProps.mode, data: snapshot });
        } catch (e) {
            console.error("Submission failed", e);
        } finally {
            isSubmitting = false;
        }
    }

    // Helper to clear error when user modifies a field
    const clearError = (fieldName: string) => {
        if (validationErrors[fieldName]) {
            delete validationErrors[fieldName];
        }
    };
</script>

{#snippet fieldInput(fieldName: string, fieldInfo: IDbForge)}
    <div class="field-wrapper">
        <FieldDisplay
            {fieldName}
            collection={createUpdateProps.collection}
            mode={createUpdateProps.mode}
            editInPlace={createUpdateProps.inPlaceEdit === true ||
                (Array.isArray(createUpdateProps.inPlaceEdit) && createUpdateProps.inPlaceEdit.includes(fieldName))}
            bind:data={formData}
            setData={(field, value) => {
                formData[field] = value;
                clearError(field);
            }}
            inputForm={inputFormId}
        />
        {#if validationErrors?.[fieldName]}
            <span class="error-message" id="error-{fieldName}">
                {validationErrors[fieldName]}
            </span>
        {/if}
    </div>
{/snippet}

<form
    id={inputFormId}
    name={inputFormId}
    aria-labelledby="form-title"
    onsubmit={handleSubmit}
>
    </form>

<h2 id="form-title" class="sr-only">
    {createUpdateProps.mode} {createUpdateProps.collection}
</h2>

<div class="flex">
    <div class="crud {createUpdateProps.displayMode}">
    <DataListFields
        bind:data={formData}
        collection={createUpdateProps.collection} />
        <!-- {#each Object.entries(formFields) as [fieldName, fieldInfo]}
            {#if !createUpdateProps.showFields || createUpdateProps.showFields.includes(fieldName)}
                {@render fieldInput(fieldName, fieldInfo)}
            {/if}
        {/each} -->
    </div>
    <!-- {#if createUpdateProps.showFks && (createUpdateProps.mode === 'show' || createUpdateProps.mode === 'update')} -->
        <div>
            <DataLinks 
            collection={createUpdateProps.collection}
            collectionId={createUpdateProps.dataId}
            >
            {#snippet children()}
                <div class="p2">{createUpdateProps.collection}</div>
            {/snippet}
        </DataLinks>
            <!-- <DataLinksBack
                showTitle={true}
                collection={createUpdateProps.collection}
                collectionId={createUpdateProps.dataId}
            >
                {#snippet children()}
                    <div class="p2">Presentation</div>
                {/snippet}
            </DataLinksBack> -->
        </div>
    <!-- {/if} -->
</div>

<button
    type="submit"
    form={inputFormId}
    disabled={isSubmitting}
    aria-label="Submit"
>
    {isSubmitting ? '...' : 'Valider'}
</button>

<style lang="postcss">
    @reference "tailwindcss";

    :global(.crud) {
        min-width: 32rem;
        padding: 2rem;

        &.wrap {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        &.inline {
            display: flex;
            flex-direction: row;
            gap: 1rem;
        }
    }

    .field-wrapper {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
    }

    /* Target inputs with errors using CSS only, driven by Svelte state */
    .error-message {
        color: red;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
        white-space: nowrap;
        border-width: 0;
    }
</style>
