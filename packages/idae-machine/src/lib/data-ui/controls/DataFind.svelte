<!--
DataFind.svelte
Debounced search input. Generates a qoolie `where` clause `{ [field]: { $contains: kw } }`.
v1: single field (defaultField). `advanced` flag reserved for later field picker / exact-mode toggle.

@prop {string} collection - Source collection (used for advanced field discovery)
@prop {string} [defaultField] - Field name to search (falls back to template.presentation first token)
@prop {Record<string, unknown> | undefined} where - Bindable qoolie where fragment owned by this control
@prop {boolean} [advanced=false] - Reserved: expose field picker + exact/partial mode toggle (TODO)
@prop {number} [debounceMs=250] - Debounce delay for input → where
-->
<script lang="ts">
	import { untrack } from 'svelte';
	import { machine } from '$lib/main/machine.js';

	let {
		collection,
		defaultField,
		where = $bindable(undefined),
		advanced = false,
		debounceMs = 250
	}: {
		collection: string;
		defaultField?: string;
		where?: Record<string, unknown> | undefined;
		advanced?: boolean;
		debounceMs?: number;
	} = $props();

	let value = $state('');

	const effectiveField = $derived.by(() => {
		if (defaultField) return defaultField;
		const collLogic = safeCollection(collection);
		const presentation = collLogic?.template?.presentation as string | undefined;
		return presentation?.split(/\s+/).filter(Boolean)[0];
	});

	function safeCollection(name: string) {
		try {
			return machine.logic.collection(name);
		} catch {
			return null;
		}
	}

	let timer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		const kw = value.trim();
		const field = effectiveField;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			untrack(() => {
				if (!field || !kw) {
					where = undefined;
				} else {
					where = { [field]: { $contains: kw } };
				}
			});
		}, debounceMs);
		return () => {
			if (timer) clearTimeout(timer);
		};
	});

	function clear(): void {
		value = '';
	}
</script>

<div class="data-find">
	<input
		type="search"
		class="data-find-input"
		placeholder={effectiveField ? `Find by ${effectiveField}…` : 'Find…'}
		bind:value
	/>
	{#if value}
		<button type="button" class="data-find-clear" onclick={clear} title="Clear">×</button>
	{/if}
	{#if advanced}
		<!-- TODO advanced: field picker (all text fields from schema) + exact|partial mode toggle -->
	{/if}
</div>

<style>
	@layer components {
		.data-find {
			display: inline-flex;
			align-items: center;
			gap: 0.25rem;
			position: relative;
		}
		.data-find-input {
			padding: 0.25rem 0.5rem;
			border: 1px solid var(--color-border);
			background: var(--color-surface);
			border-radius: var(--radius-sm);
			font-size: 0.875rem;
			min-width: 180px;
		}
		.data-find-clear {
			position: absolute;
			right: 0.25rem;
			top: 50%;
			transform: translateY(-50%);
			background: transparent;
			border: none;
			cursor: pointer;
			font-size: 1.125rem;
			line-height: 1;
			color: var(--color-text-muted, #888);
			padding: 0 0.25rem;
		}
	}
</style>
