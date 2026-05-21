<script lang="ts">
	import { mount, unmount, type Component } from 'svelte';
	import { machine } from '$lib/main/machine.js';
	import type { FrameControls } from '$lib/main/frame/MachineFrameManager.js';

	let {
		id,
		modulePath,
		collection,
		collectionId,
		vars,
	}: {
		id: string;
		modulePath?: string;
		collection?: string;
		collectionId?: string;
		vars?: Record<string, string>;
	} = $props();

	let bodyEl: HTMLDivElement;
	let visible = $state(true);
	let currentApp: Record<string, unknown> | null = $state(null);

	function doLoad(mp: string, col: string, colId?: string, v?: Record<string, string>) {
		// Unmount previous if any
		if (currentApp) {
			unmount(currentApp);
			currentApp = null;
		}

		machine.componentRegistry.resolve(mp).then((Comp) => {
			const props: Record<string, unknown> = { collection: col };
			if (colId) props.dataId = colId;
			if (v) {
				props.vars = v;
				// Pass mode from vars for Explorer component
				if (v.mode) props.mode = v.mode;
			}

			// Wire legacy explorer.* onclick → load detail in same frame
			if (mp.startsWith('explorer.') && mp !== 'explorer.collections') {
				props.onclick = (record: Record<string, unknown>) => {
					const recordId = (record as any)?.id ?? (record as any)?._id;
					machine.loadFrame('explorer', col, String(recordId), { mode: 'card' });
				};
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			currentApp = mount(Comp as Component<any>, { target: bodyEl, props });
		}).catch(() => {
			// Component not found — silent fail
		});
	}

	const controls: FrameControls = {
		load: (mp, col, colId, v) => doLoad(mp, col, colId, v),
		show: () => { visible = true; },
		hide: () => { visible = false; },
		toggle: () => { visible = !visible; },
		close: () => {
			if (currentApp) {
				unmount(currentApp);
				currentApp = null;
			}
			machine.frameManager.unregister(id);
		},
	};

	$effect(() => {
		machine.frameManager.register(id, controls);
		// Auto-load if initial modulePath provided
		if (modulePath && collection) {
			doLoad(modulePath, collection, collectionId, vars);
		}
		return () => {
			machine.frameManager.unregister(id);
			if (currentApp) {
				unmount(currentApp);
				currentApp = null;
			}
		};
	});
</script>

<div class="frame" id="frame-{id}" data-frame-id={id} style="display: {visible ? 'block' : 'none'};">
	<div class="frame-body" id="frame-body-{id}" bind:this={bodyEl}></div>
</div>
