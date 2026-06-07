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
	import { mount, unmount } from 'svelte';
	import { machine } from '$lib/main/machine.js';
	import { componentRegistry } from '$lib/main/router/componentRegistry.js';
	import type { FrameControls } from '$lib/main/frame/MachineFrameManager.js';
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import Columner from './Columner.svelte';

	let { collection, collectionId, component = DataList, componentProps = {}, parentFrameId }: ColumnerProps = $props();

	const id: ColumnId = crypto.randomUUID();
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

		machine.framer.register(frameId, controls, { replace: true });

		return () => {
			controls.close();
			machine.framer.unregister(frameId);
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
	columner-componet {
		display: flex;
		flex-direction: row;
		height: 100%;
	}

	columner-column {
		display: flex;
		flex-direction: column;
		min-width: 280px;
		flex-shrink: 0;
		height: 100%;
		border-right: 1px solid var(--sl-color-neutral-200, #e0e0e0);
		background: var(--sl-color-neutral-0, #fff);
	}

	columner-dock {
		display: contents;
	}

	columner-header {
		display: flex;
		align-items: center;
		padding: 4px 8px;
		min-height: 36px;
		border-bottom: 1px solid var(--sl-color-neutral-200, #e0e0e0);
		background: var(--sl-color-neutral-50, #f5f5f5);
		flex-shrink: 0;
	}

	columner-header.sticky {
		position: sticky;
		top: 0;
		z-index: 10;
	}

	columner-controls {
		display: flex;
		gap: 4px;
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
		width: 28px;
		height: 28px;
		border: none;
		border-radius: 4px;
		background: transparent;
		cursor: pointer;
		font-size: 14px;
		transition: background-color 0.15s;
	}

	button:hover {
		background: var(--sl-color-neutral-200, #e0e0e0);
	}

	.ctrl-close:hover {
		background: var(--sl-color-danger-600, #e53935);
		color: #fff;
	}
</style>
