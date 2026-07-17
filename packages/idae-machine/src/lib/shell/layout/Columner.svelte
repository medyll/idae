<script module lang="ts">
	import type { Component } from 'svelte';
	import type { TplCollectionName } from '$lib/types/machine-model.js';

	export type ColumnId = string;

	export interface ColumnerProps {
		collection: TplCollectionName;
		collectionId?: string | number;
		/** Override rendered component — must accept collection + collectionId? + linkTarget? props. */
		component?: Component<any, any, any>;
		componentProps?: Record<string, unknown>;
		/** frameId of the parent Columner dock — passed by framer on programmatic mount. */
		parentFrameId?: string;
	}
</script>

<script lang="ts">
	import { mount, unmount, untrack } from 'svelte';
	import { machine } from '$lib/main/machine.js';
	import { componentRegistry } from '$lib/main/router/componentRegistry.js';
	import type { FrameControls } from '$lib/main/frame/MachineFrameManager.js';
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import { generateFrameId } from '$lib/main/frame/frameUtils.js';
	import Columner from './Columner.svelte';

	let { collection, collectionId, component = DataList, componentProps = {}, parentFrameId }: ColumnerProps = $props();

	const id: ColumnId = generateFrameId('col');
	const frameId = `columner:${id}`;
	let dock: HTMLElement;
	let sticky = $state(false);

	const Comp = $derived(component);

	$effect(() => {
		// hide/show instances — state preserved across toggles (mirrors createHost semantics)
		const instances = new Map<string, { app: Record<string, unknown>; el: HTMLElement }>();
		let activeKey: string | null = null;

		function hideAll() {
			for (const { el } of instances.values()) el.style.display = 'none';
		}

		const controls: FrameControls = {
			load: (modulePath, col, colId, vars) => {
				const key = `${modulePath}::${col}:${colId ?? ''}`;

				// Toggle off: same content already showing
				if (key === activeKey) {
					hideAll();
					activeKey = null;
					return;
				}

				hideAll();

				// Already mounted but hidden — show it
				const existing = instances.get(key);
				if (existing) {
					existing.el.style.display = '';
					activeKey = key;
					return;
				}

				// New content — resolve + mount a child Columner in the dock
				activeKey = key;
				componentRegistry.resolve(modulePath).then((Comp) => {
					if (activeKey !== key) return; // superseded
					const el = document.createElement('div');
					el.style.cssText = 'width:100%;height:100%;';
					dock.appendChild(el);
					const app = mount(Columner, {
						target: el,
						props: {
							collection: col,
							collectionId: colId,
							component: Comp,
							parentFrameId: frameId,
						} satisfies ColumnerProps
					}) as Record<string, unknown>;
					instances.set(key, { app, el });
				}).catch((err) => {
					console.error(`[Columner] failed to resolve "${modulePath}":`, err);
				});
			},
			show: () => {
				const inst = activeKey ? instances.get(activeKey) : null;
				if (inst) inst.el.style.display = '';
			},
			hide: () => hideAll(),
			toggle: () => {
				const inst = activeKey ? instances.get(activeKey) : null;
				if (inst) inst.el.style.display = inst.el.style.display === 'none' ? '' : 'none';
			},
			close: () => {
				for (const { app } of instances.values()) unmount(app);
				instances.clear();
				activeKey = null;
			},
		};

		untrack(() => machine.framer.register(frameId, controls, { replace: true }));

		return () => {
			controls.close();
			untrack(() => machine.framer.unregister(frameId));
		};
	});
</script>

<columner-componet>
	<columner-column>
		<columner-header class:sticky>
			<columner-controls>
				<button class="ctrl-pin" onclick={() => (sticky = !sticky)} title={sticky ? 'Unpin' : 'Pin'}>
					{sticky ? '📌' : '📍'}
				</button>
				{#if parentFrameId}
					<button
						class="ctrl-close"
						onclick={() => machine.framer.close(parentFrameId)}
						title="Close"
					>✕</button>
				{/if}
			</columner-controls>
		</columner-header>
		<columner-body>
			<Comp
				{collection}
				{collectionId}
				{...componentProps}
				linkTarget={frameId}
			/>
		</columner-body>
	</columner-column>
	<columner-dock bind:this={dock}></columner-dock>
</columner-componet>

<style>
	@layer components {
	columner-componet {
		display: flex;
		flex-direction: row;
		height: 100%;
	}

	columner-column {
		display: flex;
		flex-direction: column;
		min-width: calc(var(--gutter-3xl) * 4.5);
		flex-shrink: 0;
		height: 100%;
		border-right: var(--border-width) solid var(--color-border-strong);
		background: var(--color-surface-raised);
	}

	columner-dock {
		display: contents;
	}

	columner-header {
		display: flex;
		align-items: center;
		padding: var(--pad-xs) var(--pad-sm);
		min-height: var(--header-height);
		border-bottom: var(--border-width) solid var(--color-border-strong);
		background: var(--color-surface-alt);
		flex-shrink: 0;
	}

	columner-header.sticky {
		position: sticky;
		top: 0;
		z-index: var(--z-dropdown);
	}

	columner-controls {
		display: flex;
		gap: var(--gutter-xs);
		margin-left: auto;
	}

	columner-body {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow-y: auto;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--control-height);
		height: var(--control-height);
		border: none;
		border-radius: var(--radius-xs);
		background: transparent;
		cursor: pointer;
		font-size: var(--text-base);
		transition: background-color var(--transition-normal);
	}

	button:hover {
		background: var(--color-surface-hover);
	}

	.ctrl-close:hover {
		background: var(--color-critical);
		color: var(--default-color-surface-light);
	}
	}
</style>
