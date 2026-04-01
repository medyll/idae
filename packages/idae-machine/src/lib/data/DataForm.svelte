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
        mode = 'create',
        collection,
        data,
        dataId,
        withData,
        ...createUpdateProps
    }: CreateUpdateProps<COL> & { onsubmit?: (payload: unknown) => void } = $props();

    // Logic and Store references
    const logic = machine.logic;
    const store = $derived(collection ? machine.store[collection] : undefined);

    // Reactive derivations for metadata
    const collLogic = $derived(collection ? logic.collection(collection) : null);
    const formFields = $derived(collLogic?.parse() ?? {});
    const validator = $derived(collLogic?.validator);
    const indexName = $derived(collLogic?.template.index);

    // UI derivations
    // `inputFormId` must be a plain string for the DOM `id`/`form` attributes.
    const inputFormId = $derived(`form-${String(collection ?? '')}-${mode ?? ''}`);

    // Reactive State
    let formData = $state<Record<string, unknown>>({});
    let validationErrors = $state<Record<string, string>>({});
    let isSubmitting = $state(false);

    // Initialize or Reset form data when collection/mode/dataId changes
    $effect(() => {
        if (mode === 'create') {
            formData = {
                ...SchemeFieldDefaultValues.getDefaults(Object.keys(formFields), collection),
                ...data,
                ...withData
            };
        } else if (store && dataId) {
            // Logic to fetch existing data from store
            const query = store.where({ [indexName]: { eq: dataId } });
            const snap = $state.snapshot(query);
            const record = Array.isArray(snap) && snap.length > 0 ? snap[0] : {};

            formData = {
                ...data,
                ...withData,
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

        const ignore = mode === 'create' && indexName ? [indexName] : undefined;
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
            if (mode === 'create' && !dataId) {
                await store?.add({ ...snapshot, ...withData });
            } else if (mode === 'update' && dataId) {
                await store?.update(dataId, snapshot);
            }

            // Trigger callback if provided
            onsubmit_callback?.({ mode, data: snapshot });
        } catch (e) {
            console.error("Submission failed", e);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<form
    id={inputFormId}
    name={inputFormId}
    aria-labelledby="form-title"
    onsubmit={handleSubmit}
>
    </form>

<h2 id="form-title" class="sr-only">
    {mode} {collection}
</h2>

<div class="flex">
    <div class="crud {mode}">
    <DataListFields
        bind:data={formData}
        collection={collection}
        mode={mode} /> 
    </div>
    <!-- {#if showFks && (mode === 'show' || mode === 'update')} -->
        <div>
            <DataLinks 
                collection={collection}
                collectionId={dataId}
            >
            {#snippet children()}
                <div class="p2">{collection}</div>
            {/snippet}
            </DataLinks>
            <DataLinksBack
                showTitle={true}
                collection={collection}
                collectionId={dataId}
            >
                {#snippet children()}
                    <div class="p2">Presentation</div>
                {/snippet}
            </DataLinksBack>
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

<style >
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
