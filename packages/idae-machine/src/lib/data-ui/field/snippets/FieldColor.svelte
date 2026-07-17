<!--
FieldColor.svelte
Color field atom — swatch in show mode, color picker in edit.
@role field-atom
@prop {string} value - Current value (bindable)
-->
<script module lang="ts">
	export interface FieldColorProps {
		value?: string;
		mode?: 'show' | 'create' | 'update';
		id?: string;
		name?: string;
		form?: string;
	}
</script>

<script lang="ts">
	let {
		value = $bindable<string | undefined>(),
		mode = 'show',
		id,
		name,
		form
	}: FieldColorProps = $props();
</script>

{#if mode === 'show'}
	<span class="color-swatch" style="background:{value}" title={value}></span>
{:else}
	<input
		type="color"
		bind:value
		{id}
		{name}
		{form}
	/>
{/if}

<style>
	.color-swatch {
		display: inline-block;
		width: var(--icon-size-sm);
		height: var(--icon-size-sm);
		border-radius: var(--radius-xs);
		border: var(--border-width) solid var(--color-border);
		vertical-align: middle;
	}
</style>
