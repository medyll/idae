<!--
FieldValue.svelte
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
<script lang="ts" generics="COL extends Record<string,any>">
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
    } = $props<{ 
        collection?: TplCollectionName; 
        collectionId?: any; 
        fieldName: keyof COL; 
        data: COL; 
        mode?: 'show' | 'create' | 'update'; 
        editInPlace?: boolean; 
        inputForm?: string; 
        showLabel?: boolean | string 
    }>();

    // 2. Pure reactive derivations
    const scheme = $derived(machine.logic.collection(collection));
    const fieldForge = $derived(scheme.fieldForge(String(fieldName), data));
    const schemeFieldValues = $derived(scheme.collectionValues);
    const inputDataset = $derived(schemeFieldValues.getInputDataSet(fieldName, data));
    
    const isPrivate = $derived(fieldForge.fieldArgs?.includes('private'));
    const labelPosition = $derived(
        typeof showLabel === 'string' ? showLabel : (showLabel === true ? 'above' : '')
    );

    let error = $state<string | null>(null);

</script>


{#snippet fieldShow()}
    <div class="flex w-48 gap-2">
        <div class="flex-1" {...inputDataset}>{fieldForge.format}</div>
    </div>
{/snippet}

{#snippet fieldInput()}
    {#if fieldForge.fieldType === 'id'}
        {#if mode !== 'create'}
            <input type="hidden" bind:value={data[fieldName]} {...inputDataset} id={fieldName} name={fieldName} form={inputForm} />
        {/if}
    {:else if fieldForge.fieldType === 'boolean'}
        <input type="checkbox" bind:checked={data[fieldName]} {...inputDataset} id={fieldName} name={fieldName} form={inputForm} />
    {:else if fieldForge.fieldType?.includes('area')}
        <textarea 
            style="width:100%;max-width:100%;" 
            bind:value={data[fieldName]} 
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
            class="input" 
            bind:value={data[fieldName]} 
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
      <div class="cell relative flex flex-col gap-2 wrapper-{fieldForge.fieldType}">
          {#if fieldForge.fieldType !== 'id' && (labelPosition === 'before' || labelPosition === 'above')}
              <label form={inputForm} for={fieldName} class="field-label {labelPosition}">
                  {fieldName}
              </label>
          {/if}

          <div class="field-input flex">
              {#if mode === 'show'}
                  {@render fieldShow()}
              {:else}
                  {@render fieldInput()}
              {/if}
          </div>

          {#if labelPosition === 'after' || labelPosition === 'below'}
              <label form={inputForm} for={fieldName} class="field-label {labelPosition}">
                  {fieldName}
              </label>
          {/if}

          {#if error}
              <div class="error-message">{error}</div>
          {/if}
      </div>
  {/if}
{:else}
  <div class="error-message">Champ ou schéma non trouvé pour {fieldName}</div>
{/if}

<style lang="postcss">
    @reference "../../styles/references.css";

    .error-message { color: red; font-size: 0.9em; margin-top: 0.2em; }
    
    .field-label {
        display: block;
        font-weight: bold;
        padding: 0.5rem;
        
        &.before, &.after { display: block; margin-right: 0.5em; }
        &.above { margin-bottom: 0.25em; }
        &.below { margin-top: 0.25em; }
    }

    .wrapper-text-tiny { width: 110px; }
    .wrapper-text-medium { width: 370px; }
    .wrapper-text-area, .wrapper-text-long {
        flex-basis: 100%;
        flex-grow: 1;
        max-width: 100%;
    }
</style>
