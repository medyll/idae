// idae-machine v2 — public API

// Core machine
export * from '$lib/main/index.js';

// UI — explorer (collection level)
export { default as Explorer }            from '$lib/shell/frame/explorer/Explorer.svelte';
export { default as Diagram }             from '$lib/shell/frame/diagram/Diagram.svelte';
export { buildGraph }                     from '$lib/data-ui/utils/diagramUtils.js';
export type { DiagramOptions }            from '$lib/data-ui/utils/diagramUtils.js';

// data-ui — data providers (smart, machine-aware)
export { default as DataList }   from '$lib/data-ui/data/DataList.svelte';
export { default as DataListFk } from '$lib/data-ui/data/DataListFk.svelte';
export { default as DataListRfk } from '$lib/data-ui/data/DataListRfk.svelte';
export { default as DataForm }   from '$lib/data-ui/data/DataForm.svelte';
export { default as DataRecord } from '$lib/data-ui/data/DataRecord.svelte';
export { default as DataFk }     from '$lib/data-ui/data/DataFk.svelte';
export { default as DataRfk }    from '$lib/data-ui/data/DataRfk.svelte';

// UI — frame content: card (record level)

// UI — field (atomic display/edit)
export { default as DataField }     from '$lib/data-ui/field/DataField.svelte';
export { default as DataFieldEdit } from '$lib/data-ui/field/DataFieldEdit.svelte';

// UI — data controls (toolbar layout + composable, prefs-aware controls)
export { default as DataToolbar } from '$lib/data-ui/controls/DataToolbar.svelte';
export { default as ButtonAction } from '$lib/data-ui/controls/ButtonAction.svelte';
export { default as Sort }         from '$lib/data-ui/controls/Sort.svelte';
export { default as Group }        from '$lib/data-ui/controls/Group.svelte';
export { default as Find }         from '$lib/data-ui/controls/Find.svelte';
export { default as ListMode }     from '$lib/data-ui/controls/ListMode.svelte';

// UI — input atoms
export { default as InputBoolean }  from '$lib/data-ui/input/InputBoolean.svelte';
export { default as InputCurrency } from '$lib/data-ui/input/InputCurrency.svelte';
export { default as InputEmail }    from '$lib/data-ui/input/InputEmail.svelte';
export { default as InputSelect }   from '$lib/data-ui/input/InputSelect.svelte';
export { default as InputTextarea } from '$lib/data-ui/input/InputTextarea.svelte';

// UI — columner (Finder-style column navigation)
export { default as Columner }              from '$lib/shell/layout/Columner.svelte';
export type { ColumnId, ColumnerProps }     from '$lib/shell/layout/Columner.svelte';

// UI — layout
export { default as TemplateShell }    from '$lib/shell/layout/TemplateShell.svelte';
export { default as App }              from '$lib/shell/layout/App.svelte';
export { default as Login }            from '$lib/shell/auth/Login.svelte';
export { default as TaskBar }          from '$lib/shell/layout/TaskBar.svelte';
export { default as Breadcrumb }       from '$lib/shell/layout/Breadcrumb.svelte';
export { default as DevResetPanel }    from '$lib/shell/layout/DevResetPanel.svelte';

// UI — fragments
export { default as FrameFragment } from '$lib/data-ui/fragments/Frame.svelte';
export { default as Frame }         from '$lib/shell/Frame.svelte';
export { default as Selector } from '$lib/data-ui/fragments/Selector.svelte';
export { default as Skeleton } from '$lib/data-ui/fragments/Skeleton.svelte';

// MCP — client-side WebMCP tool registration
export { registerMachineMcpTools } from '$lib/mcp/MachineMcpClient.js';

// Auth gate signal
export { authState } from '$lib/main/machine/authState.svelte.js';

// Utils
export * from '$lib/utils/logger.js';
