<svelte:options accessors />

<script lang="ts">
	/* common slotUi exports*/
	let className = '';
	export { className as class };
	export let element: HTMLDivElement | null = null;
	export let style: string | null = null;
	/* end slotUi exports*/

	export let color = '#fff';
	export let vertical = false;
</script>

<div
	bind:this={element}
	class:vertical
	class="toolbar {className}"
	style="{style};--color: {color}"
>
	<slot />
	<slot name="separator" />
</div>

<style lang="scss" global>
	@import './toolbar.css';
</style>
