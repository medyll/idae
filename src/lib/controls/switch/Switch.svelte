<script lang="ts" generics="T=Data">
	//
	import type { Data } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { SwitchProps } from './types.js';

	let {
		class: className = '',
		style = '',
		element = $bindable<HTMLElement | null>(null),
		name = $bindable<string>(undefined),
		checked = $bindable<boolean>(false),
		disabled = $bindable<boolean>(false),
		metaData,
		onChange = (val: boolean, metaData: T) => {},
		children,
		switchLabel
	}: SwitchProps<T> = $props();

	let hiddenRef: HTMLInputElement;
</script>

<input bind:this={hiddenRef} {name} id={name} value={checked} type="hidden" />
<label bind:this={element} for="_{name}" class="switch {className}" {style}>
	<Slotted child={switchLabel} />

	<div class="switchGutter">
		<input
			onchange={(event) => {
				if (hiddenRef) hiddenRef.value = `${event.currentTarget.checked}`;
				onChange(event.currentTarget.checked, metaData as T);
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
