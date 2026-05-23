<script lang="ts">
	import { mount, unmount, untrack, type Component } from 'svelte';
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
	let currentApp: Record<string, unknown> | null = null;
	let mountSeq = 0;

	function doLoad(mp: string, col: string, colId?: string, v?: Record<string, string>) {
		const seq = ++mountSeq;

		machine.componentRegistry.resolve(mp).then((Comp) => {
			if (seq !== mountSeq) return;
			if (currentApp) {
				unmount(currentApp);
				currentApp = null;
			}
			const props: Record<string, unknown> = { collection: col };
			if (colId) props.dataId = colId;
			if (v) {
				if (v.mode)     props.mode     = v.mode;
				if (v.pageSize) props.pageSize = Number(v.pageSize);
				if (v.groupBy)  props.groupBy  = v.groupBy;
				if (v.sortBy) {
					const [field, dir] = v.sortBy.split(':');
					props.sortBy = { field, direction: (dir === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc' };
				}
				if (v.where) {
					try { props.where = JSON.parse(v.where); } catch { /* ignore invalid JSON */ }
				}
				if (v.groupId) props.groupId = v.groupId;
				if (v.typeId)  props.typeId  = v.typeId;
			}

			// Wire legacy explorer.* onclick → load detail in same frame
			if (mp.startsWith('explorer.') && mp !== 'explorer.collections') {
				props.onclick = (record: Record<string, unknown>) => {
					const recordId = (record as Record<string, unknown>)?.id ?? (record as Record<string, unknown>)?._id;
					machine.loadFrame('explorer', col, String(recordId), { mode: 'card' });
				};
			}

			currentApp = mount(Comp as Component<Record<string, unknown>>, { target: bodyEl, props });
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
			untrack(() => machine.framer.unregister(id));
		},
	};

	$effect(() => {
		// untrack: register/unregister write to SvelteMap — must not create read-dependency
		untrack(() => machine.framer.register(id, controls));
		if (modulePath && collection) {
			doLoad(modulePath, collection, collectionId, vars);
		}
		return () => {
			untrack(() => machine.framer.unregister(id));
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
