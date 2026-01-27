<script lang="ts" generics="COL = Record<string,any>">
    import { machine } from '$lib/main/machine.js'; 
    import { SchemeFieldDefaultValues } from '$lib/main/machine/SchemeFieldDefaultValues.js';
    import type { CreateUpdateProps } from './types.js';
    import CollectionReverseFks from '$lib/ui/CollectionReverseFks.svelte';
    import FieldInput from '$lib/form/FieldValue.svelte';

    // Define props with Svelte 5 syntax
    // Replaces createEventDispatcher with a callback prop
    let { 
        onsubmit: onsubmit_callback, 
        ...createUpdateProps 
    }: CreateUpdateProps<COL> & { onsubmit?: (payload: any) => void } = $props();

    // Logic and Store references
    const logic = machine.logic;
    const store = $derived(createUpdateProps.collection ? machine.store[createUpdateProps.collection] : undefined);

    // Reactive derivations for metadata
    const collLogic = $derived(createUpdateProps.collection ? logic.collection(createUpdateProps.collection) : null);
    const formFields = $derived(collLogic?.parse() ?? {});
    const validator = $derived(collLogic?.validator);
    const indexName = $derived(collLogic?.template.index);
    
    // UI derivations
    const inputFormId = $derived(`form-${String(createUpdateProps.collection ?? '')}-${createUpdateProps.mode ?? ''}`);

    // Reactive State
    let formData = $state<Record<string, any>>({});
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
    const validate = (data: Record<string, any>) => {
        const v = typeof validator === 'function' ? validator() : validator;
        if (!v || typeof v.validateForm !== 'function') return true;

        const ignore = createUpdateProps.mode === 'create' && indexName ? [indexName] : undefined;
        const { isValid, errors } = v.validateForm(data, { ignoreFields: ignore });
        
        validationErrors = errors; // Updates UI automatically
        return isValid;
    };

    /**
     * Form submission handler
     */
    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        isSubmitting = true; 

        const snapshot = $state.snapshot(formData);

        if (!validate(snapshot)) {
            isSubmitting = false;
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

{#snippet fieldInput(fieldName: string, fieldInfo: any)}
    <div class="field-wrapper">
        <FieldInput
            collection={createUpdateProps.collection}
            {fieldName}
            mode={createUpdateProps.mode}
            editInPlace={createUpdateProps.inPlaceEdit === true ||
                (Array.isArray(createUpdateProps.inPlaceEdit) && createUpdateProps.inPlaceEdit.includes(fieldName))}
            data={formData}
            setData={(field, value) => { 
                formData[field] = value; 
                clearError(field); 
            }}
            inputForm={inputFormId}
        />
        {#if validationErrors[fieldName]}
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

<div style="width:750px; display:flex;">
    <div class="crud {createUpdateProps.displayMode}">
        {#each Object.entries(formFields) as [fieldName, fieldInfo]}
            {#if !createUpdateProps.showFields || createUpdateProps.showFields.includes(fieldName)}
                {@render fieldInput(fieldName, fieldInfo)}
            {/if}
        {/each}
    </div>

    {#if createUpdateProps.showFks && (createUpdateProps.mode === 'show' || createUpdateProps.mode === 'update')}
        <div>
            <CollectionReverseFks 
                showTitle={true} 
                collection={createUpdateProps.collection} 
                collectionId={createUpdateProps.dataId}
            >
                {#snippet children()}
                    <div class="p2">Presentation</div>
                {/snippet}
            </CollectionReverseFks>
        </div>
    {/if}
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
    @reference "../../styles/references.css";

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