<svelte:options accessors runes />

<script lang="ts">
	//
	import type { Data } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { Snippet } from 'svelte';

	type SwitchProps = {
		/** className off the root component */
		class?: string;

		/** css style off the root component */
		style?: string;

		/** element root HTMLDivElement props */
		element?: HTMLElement | null;

		/** name of the switch */
		name?: string;

		/** whether the switch is checked */
		checked: boolean;

		/** whether the switch is disabled */
		disabled: boolean;

		/** metadata associated with the switch */
		metaData: Data;

		/** function to be called when the switch is toggled */
		onChange: (val: boolean, metaData: Data) => void;

		children?: Snippet;
		switchLabel?: Snippet;
	};

	let {
		class: className = '',
		style = '',
		element = $bindable<HTMLElement | null>(null),
		name = $bindable<string>(undefined),
		checked = $bindable<boolean>(false),
		disabled = $bindable<boolean>(false),
		metaData = {},
		onChange = (val: boolean, metaData: Data) => {},
		children,
		switchLabel
	}: SwitchProps = $props();

	let hiddenRef: HTMLInputElement;
</script>

<input bind:this={hiddenRef} {name} id={name} value={checked} type="hidden" />
<label bind:this={element} for="_{name}" class="switch {className}" {style}>
	<Slotted child={switchLabel} />

	<div class="switchGutter">
		<input
			onchange={(event) => {
				if (hiddenRef) hiddenRef.value = event.currentTarget.checked;
				onChange(event.currentTarget.checked, metaData);
			}}
			id="_{name}"
			{checked}
			{disabled}
			type="checkbox"
		/>
		<div class="switchHandle">
			<Slotted child={children} />
		</div>
	</div>
</label>
..

<style lang="scss">
	@import '../../styles/slotui-vars.scss';

	@import './switch.scss';
</style>
