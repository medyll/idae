<script lang="ts" generics="T=Data">
	//
	import type { Data, ExpandProps } from '$lib/types/index.js';
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
	}: ExpandProps<SwitchProps<T>> = $props();

	let hiddenRef: HTMLInputElement;
</script>

<input bind:this={hiddenRef} {name} id={name} value={checked} type="hidden" />
<label bind:this={element} for="_{name}" class="switch {className} inline-block relative rounded-[var(--switch-border-radius)] overflow-hidden cursor-pointer" {style}>
	<Slotted child={switchLabel} />

	<div class="switchGutter border border-[var(--switch-gutter-border)] rounded-[var(--switch-border-radius)] p-[var(--switch-gutter-padding)] bg-[var(--switch-gutter-background)]">
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
		<div class="switchHandle relative block w-4 h-4 bg-white rounded-[var(--switch-border-radius)] left-0 transition-all">
			<Slotted child={children} />
		</div>
	</div>
</label>
..


