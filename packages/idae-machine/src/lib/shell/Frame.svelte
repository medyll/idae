<script lang="ts">
	import { untrack } from 'svelte';
	import { machine } from '$lib/main/machine.js';
	import type { FrameControls } from '$lib/main/frame/MachineFrameManager.js';

	let {
		id,
		modulePath,
		collection,
		collectionId,
		vars,
		taskbar = true,
	}: {
		id: string;
		modulePath?: string;
		collection?: string;
		collectionId?: string;
		vars?: Record<string, string>;
		taskbar?: boolean;
	} = $props();

	let bodyEl: HTMLDivElement;
	let visible = $state(true);
	const host = machine.framer.createHost(() => bodyEl);

	const controls: FrameControls = {
		load: (mp, col, colId, v) => host.load(mp, col, colId, v),
		show: () => { visible = true; },
		hide: () => { visible = false; },
		toggle: () => { visible = !visible; },
		close: () => {
			host.destroy();
			untrack(() => machine.framer.unregister(id));
		},
		taskbar: untrack(() => taskbar),
	};

	$effect(() => {
		// untrack: register/unregister write to SvelteMap — must not create read-dependency
		untrack(() => machine.framer.register(id, controls, { replace: true }));
		if (modulePath && collection) {
			host.load(modulePath, collection, collectionId, vars);
		}
		return () => {
			untrack(() => machine.framer.unregister(id));
			host.destroy();
		};
	});
</script>

<div class="frame" id="frame-{id}" data-frame-id={id} style="display: {visible ? 'block' : 'none'};">
	<div class="frame-body" id="frame-body-{id}" bind:this={bodyEl}></div>
</div>
<style>
	.frame {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}
	.frame-body {
		position: absolute;
		inset: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
</style>