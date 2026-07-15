// idae/frames/FrameCatalog.ts
// Domain implementation of FrameCatalog — registers domain-specific frame types.

import type { FrameCatalog, ComponentRegistry } from '$lib/main/ext/interfaces.js';
import type { ComponentLoaderFn } from '$lib/main/router/componentRegistry.js';

// Source of truth for domain frame keys — module augmentation below feeds this
// into main/router/componentRegistry.ts's RegistryKey, so `machine.framer.loadFrame`,
// ButtonAction's `frame` prop, etc. all get the real literal union, not `string`.
const IDAE_FRAME_ENTRIES = {
	'explorer':         () => import('$lib/shell/frame/explorer/Explorer.svelte'),
	'explorer.content': () => import('$lib/shell/frame/explorer/ExplorerContent.svelte'),
	'form':             () => import('$lib/data-ui/data/DataForm.svelte'),
	'list':             () => import('$lib/data-ui/data/DataList.svelte'),
	'record':           () => import('$lib/data-ui/data/DataRecord.svelte'),
	'columner':         () => import('$lib/shell/layout/Columner.svelte'),
	'fiche':            () => import('$lib/shell/layout/Fiche.svelte'),
	'fiche.update':     () => import('$lib/shell/layout/FicheUpdate.svelte'),
	'rbac.matrix':      () => import('$lib/shell/frame/rbac/RbacMatrix.svelte'),
	'synthesis':        () => import('$lib/shell/frame/synthesis/Synthesis.svelte'),
	'planning':         () => import('$lib/shell/frame/planning/Planning.svelte'),
	'diagram':          () => import('$lib/shell/frame/diagram/Diagram.svelte'),
	'dashboard':        () => import('$lib/shell/frame/dashboard/Dashboard.svelte'),
	'space':            () => import('$lib/shell/frame/space/Space.svelte'),
	'login':            () => import('$lib/shell/auth/Login.svelte'),
	'ai.chat-session':  () => import('$lib/ai/frame/AiChatSession.svelte'),
	'today':            () => import('$lib/shell/frame/today/Today.svelte'),
	'contextmenu':      () => import('$lib/data-ui/fragments/ContextMenuContent.svelte'),
	'main-menu.content': () => import('$lib/shell/frame/main-menu-content/MainMenuContent.svelte'),
} satisfies Record<string, ComponentLoaderFn>;

export type IdaeFrameKey = keyof typeof IDAE_FRAME_ENTRIES;

// Ambient declaration merging — no runtime import added, main→idae law untouched
// (see componentRegistry.ts FrameKeyRegistry doc). This is what turns RegistryKey
// from `string` into the real 18-key union everywhere it's used.
declare module '$lib/main/router/componentRegistry.js' {
	interface FrameKeyRegistry extends Record<IdaeFrameKey, true> {}
}

export class IdaeFrameCatalog implements FrameCatalog {
	registerFrames(registry: Pick<ComponentRegistry, 'registerMany'>): void {
		registry.registerMany(IDAE_FRAME_ENTRIES);
	}
}
