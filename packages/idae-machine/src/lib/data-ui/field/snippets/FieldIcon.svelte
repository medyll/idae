<!--
FieldIcon.svelte
Icon field atom — renders icon glyph in show mode, icon picker in edit.
@role field-atom
@prop {string} value - Current value (bindable, iconify name)
@prop {'xs'|'sm'|'md'|'lg'} [size] - Glyph size preset (maps to --icon-size-* tokens). Default 'sm'.
-->
<script lang="ts">
	import Icon from '@iconify/svelte';

	let {
		value = $bindable<string | undefined>(),
		mode = 'show',
		size = 'md',
		id,
		name,
		form
	}: {
		value?: string;
		mode?: 'show' | 'create' | 'update';
		size?: 'xs' | 'sm' | 'md' | 'lg';
		id?: string;
		name?: string;
		form?: string;
	} = $props();
</script>

{#if mode === 'show'}
	{#if value}
		<Icon icon={'typcn:' + value} class="icon-field icon-size-{size}" />
	{:else}
		<span class="icon-empty">—</span>
	{/if}
{:else}
	<div class="icon-edit">
		{#if value}
			<Icon icon={'typcn:' + value} class="icon-preview icon-size-{size}" />
		{/if}
		<input
			type="text"
			bind:value
			placeholder="ex: home"
			{id}
			{name}
			{form}
		/>
	</div>
{/if}

<style>
	@layer components {
		.icon-edit {
			display: flex;
			align-items: center;
			gap: var(--space-1, 0.25rem);
		}
		.icon-edit input {
			flex: 1;
		}
		/* Iconify <Icon> scales to font-size (default 1em). Size presets mirror
		   the inputSize t-shirt taxonomy and resolve to css-base --icon-size-* tokens. */
		:global(.icon-size-xs) { font-size: var(--icon-size-xs); }
		:global(.icon-size-sm) { font-size: var(--icon-size-sm); }
		:global(.icon-size-md) { font-size: var(--icon-size-md); }
		:global(.icon-size-lg) { font-size: var(--icon-size-lg); }
		:global(.icon-field),
		:global(.icon-preview) { flex-shrink: 0; }
	}
</style>
