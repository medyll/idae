// idae/frames/FrameCatalog.ts
// Domain implementation of FrameCatalog — registers domain-specific frame types.

import type { FrameCatalog, ComponentRegistry } from '$lib/machine/ext/interfaces.js';

export class IdaeFrameCatalog implements FrameCatalog {
	registerFrames(registry: ComponentRegistry): void {
		registry.registerMany({
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
			'diagram':          () => import('$lib/shell/frame/diagram/Diagram.svelte'),
			'dashboard':        () => import('$lib/shell/frame/dashboard/Dashboard.svelte'),
			'space':            () => import('$lib/shell/frame/space/Space.svelte'),
			'login':            () => import('$lib/shell/auth/Login.svelte'),
			'ai.chat-session':  () => import('$lib/ai/frame/AiChatSession.svelte'),
			'today':            () => import('$lib/shell/frame/today/Today.svelte'),
			'contextmenu':      () => import('$lib/data-ui/fragments/ContextMenuContent.svelte'),
			'main-menu-content': () => import('$lib/shell/frame/main-menu-content/MainMenuContent.svelte'),
		});
	}
}
