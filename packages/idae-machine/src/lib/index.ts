// idae-machine v2 — public API

// Core machine
export * from '$lib/main/index.js';

// UI — explorer (collection level)
export { default as Explorer }            from '$lib/shell/frame/explorer/Explorer.svelte';

// data-ui — data providers (smart, machine-aware)
export { default as DataList }   from '$lib/data-ui/data/DataList.svelte';
export { default as DataForm }   from '$lib/data-ui/data/DataForm.svelte';
export { default as DataFields } from '$lib/data-ui/data/DataFields.svelte';
export { default as DataFk }     from '$lib/data-ui/data/DataFk.svelte';
export { default as DataRfk }    from '$lib/data-ui/data/DataRfk.svelte';

// UI — frame content: card (record level)

// UI — field (atomic display/edit)
export { default as FieldDisplay } from '$lib/data-ui/field/FieldDisplay.svelte';
export { default as FieldEditor }  from '$lib/data-ui/field/FieldEditor.svelte';

// UI — input atoms
export { default as InputBoolean }  from '$lib/data-ui/input/InputBoolean.svelte';
export { default as InputCurrency } from '$lib/data-ui/input/InputCurrency.svelte';
export { default as InputEmail }    from '$lib/data-ui/input/InputEmail.svelte';
export { default as InputSelect }   from '$lib/data-ui/input/InputSelect.svelte';
export { default as InputTextarea } from '$lib/data-ui/input/InputTextarea.svelte';

// UI — layout
export { default as TemplateShell }  from '$lib/shell/layout/TemplateShell.svelte';
export { default as CollectionNav }  from '$lib/shell/layout/CollectionNav.svelte';
export { default as Navigation } from '$lib/shell/layout/Navigation.svelte';
export { default as Breadcrumb } from '$lib/shell/layout/Breadcrumb.svelte';
export { default as Pane }       from '$lib/shell/layout/Pane.svelte';
export { default as PaneRight }  from '$lib/shell/layout/PaneRight.svelte';

// UI — fragments
export { default as Confirm }  from '$lib/data-ui/fragments/Confirm.svelte';
export { default as Frame }    from '$lib/data-ui/fragments/Frame.svelte';
export { default as InfoLine } from '$lib/data-ui/fragments/InfoLine.svelte';
export { default as Selector } from '$lib/data-ui/fragments/Selector.svelte';
export { default as Skeleton } from '$lib/data-ui/fragments/Skeleton.svelte';

// Utils
export * from '$lib/utils/logger.js';
