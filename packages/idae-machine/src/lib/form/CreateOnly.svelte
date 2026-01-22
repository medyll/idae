<!-- 
    Component CreateOnly : to open a Create window for a specific collection.
    Only handles creation, not update or show.
    Button validate and cancel is in the Window component.
-->

<script lang="ts" generics="COL = Record<string,any>">
  import { machine } from '$lib/main/machine.js';
  import type { CreateUpdateProps } from './types.js';
  import FieldValue from '$lib/form/FieldValue.svelte';

  let {
    collection,
    data = {},
    withData,
    showFields,
    inPlaceEdit,
    displayMode = 'wrap',
  }: CreateUpdateProps = $props();

  let inputForm = `form-${String(collection)}-create`;
  let logic = machine.logic;
  let store = machine.store[(collection as string)];
  let formFields = $derived(logic.collection(collection).parse());
  let validator = $derived(logic.collection(collection).validator);
  let indexName = $derived(logic.collection(collection).template.index);

  let formData = $state<Record<string, any>>({ ...data, ...withData });

  $effect.pre(() => {
    setFormDataDefaultFieldValues();
  });

  let validationErrors: Record<string, string> = {};

  const validateFormData = (formData: Record<string, any> = {}) => {
    const { isValid, errors } = validator.validateForm(formData, {
      ignoreFields: [indexName]
    });
    validationErrors = errors;
    return isValid;
  };

  export const submit = async (event: FormDataEvent) => {
    if (!validateFormData($state.snapshot(formData))) {
      Object.entries(validationErrors).forEach(([fieldName, errorMessage]) => {
        const inputElement = document.querySelector(
          `[name="${fieldName}"][form="${inputForm}"]`
        ) as HTMLInputElement | null;
        if (inputElement) {
          inputElement.classList.add('input-error');
          let errorElement = inputElement.nextElementSibling as HTMLElement;
          if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.classList.add('error-message');
            inputElement.parentNode?.insertBefore(errorElement, inputElement.nextSibling);
          }
          errorElement.textContent = errorMessage;
          inputElement.setAttribute('aria-invalid', 'true');
          inputElement.setAttribute('aria-describedby', `error-${fieldName}`);
          errorElement.id = `error-${fieldName}`;
        }
      });
      return;
    }
    let datadb = $state.snapshot(formData);
    await store.add({ ...datadb, ...withData });
  };

  function setFormDataDefaultFieldValues() {
    Object.entries(formFields).forEach(([fieldName, field]) => {
      if (formData[fieldName] === undefined && getDefaultValue(field?.fieldType)) {
        formData[fieldName] = getDefaultValue(field?.fieldType);
      }
    });
  }

  function getDefaultValue(fieldType?: string) {
    switch (fieldType) {
      case 'timestamp':
        return Date.now();
      case 'date':
        return new Date().toISOString().split('T')[0];
      case 'datetime':
        return new Date().toISOString();
      case 'time':
        return new Date().toISOString().split('T')[1].split('.')[0];
    }
  }
</script>

<form
  id={inputForm}
  name={inputForm}
  onchange={(event) => {
    console.log('Form changed', event);
  }}
  onsubmit={(event) => {
    event.preventDefault();
    // onSubmit(event);
  }}
></form>
<input type="submit" form={inputForm} />
<div style="width:750px;display:flex;">
  <div class="crud {displayMode}">
    {#each Object.entries(formFields) as [fieldName, fieldInfo]}
      <FieldValue
        {collection}
        {fieldName}
        mode="create"
        editInPlace={inPlaceEdit === true ||
          (Array.isArray(inPlaceEdit) && inPlaceEdit.includes(fieldName))}
        bind:data={formData}
        {inputForm}
      />
    {/each}
  </div>
</div>

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
  [aria-invalid='true'] {
    background-color: #ffeeee;
    border-color: red;
  }
  .error-message {
    color: red;
    font-size: 0.8em;
    margin-top: 0.2em;
  }
</style>
