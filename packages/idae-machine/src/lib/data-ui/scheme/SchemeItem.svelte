<!--
SchemeItem.svelte
Renders a single collection item with type-based icon.
@role scheme-item
@prop {string} collection - Collection code
@prop {string} name - Display name
@prop {string} [type] - Collection type (standard|type|group)
@prop {boolean} [active] - Is currently active
@prop {() => void} [onclick] - Click handler
-->
<script lang="ts">
	let {
		collection,
		name,
		type = 'standard',
		active = false,
		onclick
	}: {
		collection: string;
		name: string;
		type?: 'standard' | 'type' | 'group';
		active?: boolean;
		onclick?: () => void;
	} = $props();

	const icon = $derived(
		type === 'type' ? '📐'
		: type === 'group' ? '📁'
		: '📄'
	);
</script>

<button
	class="scheme-item {active ? 'active' : ''}"
	onclick={onclick}
	aria-label={name}
>
	<span class="scheme-icon">{icon}</span>
	<span class="scheme-name">{name}</span>
</button>

<style>
	.scheme-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.4rem 0.5rem;
		border: none;
		background: transparent;
		cursor: pointer;
		border-radius: 4px;
		text-align: left;
	}
	.scheme-item:hover { background: var(--color-hover, #f0f0f0); }
	.scheme-item.active { background: var(--color-active, #e0e7ff); font-weight: 600; }
	.scheme-icon { font-size: 0.9em; }
	.scheme-name { flex: 1; }
</style>
