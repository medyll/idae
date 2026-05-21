// idae-machine v2 — public API

// Core machine
export * from '$lib/main/index.js';

// UI — explorer (collection level)
export { default as Explorer }            from '$lib/shell/explorer/Explorer.svelte';
export { default as ExplorerCollections } from '$lib/shell/explorer/ExplorerCollections.svelte';

// data-ui — data providers (smart, machine-aware)
export { default as DataList }   from '$lib/data-ui/data/DataList.svelte';
export { default as DataForm }   from '$lib/data-ui/data/DataForm.svelte';
export { default as DataFields } from '$lib/data-ui/data/DataFields.svelte';
export { default as DataFk }     from '$lib/data-ui/data/DataFk.svelte';
export { default as DataRfk }    from '$lib/data-ui/data/DataRfk.svelte';

// UI — card (record level)
export { default as CardForm }     from '$lib/shell/card/CardForm.svelte';
export { default as CardCreate }   from '$lib/shell/card/CardCreate.svelte';
export { default as CardEdit }     from '$lib/shell/card/CardEdit.svelte';
export { default as CardFields }   from '$lib/shell/card/CardFields.svelte';
export { default as CardProvider } from '$lib/shell/card/CardProvider.svelte';
export { default as CardPicker }   from '$lib/shell/card/CardPicker.svelte';
export { default as CardFk }       from '$lib/shell/card/CardFk.svelte';
export { default as CardRfk }      from '$lib/shell/card/CardRfk.svelte';

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
export { default as AppShell }   from '$lib/shell/layout/AppShell.svelte';
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
