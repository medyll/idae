<!-- /**
* @component CardForm
* @role User form for creating or editing records in a collection
* @description Renders an editable form with automatic field generation from schema.
* Handles form validation, submission, and data persistence to IndexedDB via machine.store.
* Supports three modes: 'create' (new record), 'update' (existing), 'show' (readonly).
*
* @example
* ```svelte
* <CardForm
*   collection="users"
*   mode="create"
*   onsubmit={handleSave}
* />
* ```
*/ -->
<script lang="ts" generics="COL = Record<string,unknown>">
    import { machine } from '$lib/main/machine.js';
    import { SchemeFieldDefaultValues } from '$lib/main/machine/SchemeFieldDefaultValues.js';
    import type { CreateUpdateProps } from './types.js';
    import type { IDbForge } from '$lib/types/machine-model.js';
    import CardRfk from '$lib/main-ui/card/CardRfk.svelte';
    import FieldDisplay from '$lib/data-ui/field/FieldDisplay.svelte';
	import CardFk from '$lib/main-ui/card/CardFk.svelte';
	import CardFields from '$lib/main-ui/card/CardFields.svelte';

    let {
        onsubmit: onsubmit_callback,
        mode = 'create',
        collection,
        data,
        dataId,
        withData,
        ...createUpdateProps
    }: CreateUpdateProps<COL> & { onsubmit?: (payload: unknown) => void } = $props();

    const logic = machine.logic;
    const store = $derived(collection ? machine.store[collection] : undefined);

    const collLogic = $derived(collection ? logic.collection(collection) : null);
    const formFields = $derived(collLogic?.parse() ?? {});
    const validator = $derived(collLogic?.validator);
    const indexName = $derived(collLogic?.index);

    const inputFormId = $derived(`form-${String(collection ?? '')}-${mode ?? ''}`);

    let formData = $state<Record<string, unknown>>({});
    let validationErrors = $state<Record<string, string>>({});
    let isSubmitting = $state(false);

    $effect(() => {
        if (mode === 'create') {
            formData = {
                ...SchemeFieldDefaultValues.getDefaults(Object.keys(formFields), collection),
                ...data,
                ...withData
            };
        } else if (store && dataId) {
            const id = isNaN(Number(dataId)) ? dataId : Number(dataId);
            (async () => {
                const record = await store.get(id) ?? {};
                formData = { ...data, ...withData, ...record };
            })();
        }
    });

    const validate = async (data: Record<string, unknown>) => {
        const v = validator;
        if (!v || typeof v.validateForm !== 'function') return true;

        const ignore = mode === 'create' && indexName ? [indexName] : undefined;
        const out = await v.validateForm(data, { ignoreFields: ignore });

        validationErrors = out.errors || {};
        return out.isValid;
    };

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        isSubmitting = true;

        const snapshot = $state.snapshot(formData);

        if (!(await validate(snapshot))) {
            isSubmitting = false;
            console.log('Validation failed', validationErrors, snapshot);
            return;
        }

        try {
            if (mode === 'create' && !dataId) {
                await store?.create({ ...snapshot, ...withData });
            } else if (mode === 'update' && dataId) {
                await store?.update(dataId, snapshot);
            }

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
    <CardFields
        bind:data={formData}
        collection={collection}
        mode={mode} />
    </div>
    <!-- {#if showFks && (mode === 'show' || mode === 'update')} -->
        <div>
            <CardFk
                collection={collection}
                collectionId={dataId}
            >
            {#snippet children()}
                <div class="p2">{collection}</div>
            {/snippet}
            </CardFk>
            <CardRfk
                showTitle={true}
                collection={collection}
                collectionId={dataId}
            >
                {#snippet children()}
                    <div class="p2">Presentation</div>
                {/snippet}
            </CardRfk>
        </div>
    <!-- {/if} -->
</div>

<div class="toolbar toolbar-end">
    <button
        type="submit"
        class="btn-primary"
        form={inputFormId}
        disabled={isSubmitting}
        aria-label="Submit"
    >
        {isSubmitting ? '...' : 'Valider'}
    </button>
</div>

<style>
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
