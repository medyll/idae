<script module lang="ts">
import type { Snippet } from 'svelte';
/**
 * Props for the Switch component.
 * Represents a toggle switch with metadata, slot, and event support.
 */
export type SwitchProps<T = Record<string, any>> = {
	/** Class name for the root component */
	class?: string;
	/** Inline style for the root component */
	style?: string;
	/** Reference to the root element */
	element?: HTMLElement | null;
	/** Name of the switch */
	name?: string;
	/** Whether the switch is checked */
	checked: boolean;
	/** Whether the switch is disabled */
	disabled?: boolean;
	/** Metadata associated with the switch */
	metaData?: T;
	/** Function to be called when the switch is toggled */
	onChange?: (val: boolean, metaData: T) => void;
	/** Slot for children content (custom handle) */
	children?: Snippet;
	/** Slot for the switch label */
	switchLabel?: Snippet;
};
</script>

<script lang="ts" generics="T=Data">
import type { Data, ExpandProps } from '$lib/types/index.js';
import Slotted from '$lib/utils/slotted/Slotted.svelte';

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

<style global lang="postcss">
  @import './switch.css';
</style>
