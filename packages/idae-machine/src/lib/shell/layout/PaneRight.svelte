<script lang="ts">
	/**
	 * PaneRight — today dashboard with quick-create buttons and recent history.
	 * Uses machine.collection('appuser_history') and machine.rights directly.
	 */
	import { machine } from '$lib/main/machine.js';
	import PaneQuickCreate from './PaneQuickCreate.svelte';
	import PaneRecents from './PaneRecents.svelte';

	interface Props {
		onSelect?: (detail: { collection: string; id?: string }) => void;
	}

	let { onSelect }: Props = $props();

	/** Collections with create permission */
	let creatableCollections = $derived.by(() => {
		const schemes = machine.logic.collections();
		return schemes
			.filter((s) => machine.rights.checkAccess(s.collection, 'C'))
			.map((s) => ({ code: s.collection, name: s.name }));
	});
</script>

<div class="pane-right">
	<PaneQuickCreate collections={creatableCollections} {onSelect} />
	<PaneRecents {onSelect} />
</div>
