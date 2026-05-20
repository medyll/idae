// idae-machine v2 — public API

// Core machine
export * from '$lib/main/index.js';

// UI — explorer (collection level)
export { default as ExplorerCollections } from '$lib/main-ui/explorer/ExplorerCollections.svelte';
export { default as ExplorerList }        from '$lib/main-ui/explorer/ExplorerList.svelte';
export { default as ExplorerCard }        from '$lib/main-ui/explorer/ExplorerCard.svelte';
export { default as ExplorerTable }       from '$lib/main-ui/explorer/ExplorerTable.svelte';
export { default as ExplorerActions }     from '$lib/main-ui/explorer/ExplorerActions.svelte';
export { default as ExplorerFilter }      from '$lib/main-ui/explorer/ExplorerFilter.svelte';

// UI — card (record level)
export { default as CardForm }     from '$lib/main-ui/card/CardForm.svelte';
export { default as CardCreate }   from '$lib/main-ui/card/CardCreate.svelte';
export { default as CardEdit }     from '$lib/main-ui/card/CardEdit.svelte';
export { default as CardFields }   from '$lib/main-ui/card/CardFields.svelte';
export { default as CardProvider } from '$lib/main-ui/card/CardProvider.svelte';
export { default as CardPicker }   from '$lib/main-ui/card/CardPicker.svelte';
export { default as CardFk }       from '$lib/main-ui/card/CardFk.svelte';
export { default as CardRfk }      from '$lib/main-ui/card/CardRfk.svelte';

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
export { default as AppShell }   from '$lib/main-ui/layout/AppShell.svelte';
export { default as Navigation } from '$lib/main-ui/layout/Navigation.svelte';
export { default as Breadcrumb } from '$lib/main-ui/layout/Breadcrumb.svelte';
export { default as Pane }       from '$lib/main-ui/layout/Pane.svelte';
export { default as PaneLeft }   from '$lib/main-ui/layout/PaneLeft.svelte';
export { default as PaneRight }  from '$lib/main-ui/layout/PaneRight.svelte';

// UI — fragments
export { default as Confirm }  from '$lib/data-ui/fragments/Confirm.svelte';
export { default as Frame }    from '$lib/data-ui/fragments/Frame.svelte';
export { default as InfoLine } from '$lib/data-ui/fragments/InfoLine.svelte';
export { default as Selector } from '$lib/data-ui/fragments/Selector.svelte';
export { default as Skeleton } from '$lib/data-ui/fragments/Skeleton.svelte';

// Utils
export * from '$lib/utils/logger.js';
