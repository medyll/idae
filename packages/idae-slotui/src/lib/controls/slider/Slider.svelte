<script module lang="ts">
import type { ExpandProps } from '$lib/types/index.js';
/**
 * Props for the Slider component.
 * Represents a slider input with orientation, dense mode, and slot support.
 */
export type SliderProps = {
	/** Class name for the slider root */
	class?: string;
	/** Inline style for the slider root */
	style?: string;
	/** Dense mode for compact display */
	dense?: string;
	/** Reference to the root element */
	element?: HTMLDivElement | null;
	/** Reference to the input element */
	elementInput?: HTMLInputElement | null;
	/** Reference to the rail element */
	elementRail?: HTMLDivElement;
	/** Reference to the gutter element */
	elementGutter?: HTMLDivElement;
	/** Slider value */
	value: number;
	/** Minimum value */
	min?: number;
	/** Maximum value */
	max?: number;
	/** Step size */
	step?: number;
	/** Show value tooltip */
	tooltip?: boolean;
	/** Orientation: 'horizontal' or 'vertical' */
	orientation?: string;
	/** Reverse the slider order */
	reverse?: boolean;
	/** Disabled state */
	disabled?: boolean;
	/** Change event handler */
	onchange?: (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => void;
};
</script>

<script lang="ts">

let {
	class: className = '',
	style = '',
	dense = 'default',
	element,
	elementInput,
	elementRail,
	value = $bindable(0),
	min = 0,
	max = 100,
	step = 1,
	orientation = 'horizontal',
	reverse = false,
	disabled = false,
	onchange
}: ExpandProps<SliderProps> = $props();

let dragging = $state(false);
let holding = $state(false);

const steps = {
	increase() {
		value += step;
		if (value > max) value = max;
	},
	decrease() {
		value -= step;
		if (value < min) value = min;
	}
};

const move = {
	handle() {
		if (holding) {
			dragging = true;
		}
	},
	cancel() {
		holding = false;
		dragging = false;
	}
};

const key = {
	start(event: Event) {
		if (event.cancelable) event.preventDefault();
		holding = true;
	},
	mouseDown(event: MouseEvent) {
		if (event.cancelable) event.preventDefault();
		holding = true;
	},
	click(event: MouseEvent) {
		if (event.cancelable) event.preventDefault();
		getSliderVal(event);
		holding = false;
	},
	keyDown(event: KeyboardEvent) {
		const { key } = event;
		const up = !reverse ? steps.increase : steps.decrease;
		const down = !reverse ? steps.decrease : steps.increase;
		if (key === 'ArrowDown' || key === 'ArrowUp') event.preventDefault();
		if (!disabled) {
			if (key === 'ArrowLeft' || (key === 'ArrowDown' && !disabled)) {
				up();
			} else if (key === 'ArrowRight' || (key === 'ArrowUp' && !disabled)) {
				down();
			}
		}
	}
};

let percentage = $derived(getPercentage(value));
$effect(() => {
	if (value <= min) value = min;
	else if (value >= max) value = max;
});

$effect(() => {
	if (dragging) {
		getSliderVal(event);
		dragging = false;
	}
});

function getPercentage(val: number) {
	return ((val - min) / (max - min)) * 100;
}

function getSliderVal(event: Event) {
	// @ts-ignore
	const { clientX, clientY } = (event.touches ? event.touches?.[0] : event) as TouchEvent;
	// @ts-ignore
	const { left, top, width, height } = elementRail?.getBoundingClientRect();
	const offset = orientation === 'horizontal' ? clientX - left : top + height - clientY;
	const size = orientation === 'horizontal' ? width : height;
	const newValue = min + (max - min) * (offset / size);
	//
	value = Math.round(newValue / step) * step;
}
</script>

<svelte:window
	onmousemove={move.handle}
	onmouseup={move.cancel}
	ontouchmove={move.handle}
	ontouchend={move.cancel}
	ontouchcancel={move.cancel}
/>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="slider {className} dense-{dense}"
	onmousedown={key.mouseDown}
	ontouchstart={key.start}
	onkeydown={key.keyDown}
	onclick={key.click}
	tabindex="0"
	{style}
	bind:this={element}
>
	<div class="slider-gouge" bind:this={elementRail}>
		<div class="slider-gouge-selected" style="width:{percentage}%;"></div>
	</div>

	<div
		class="slider-thumb"
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		role="slider"
		style="left: {percentage}%;transform: translateX(-50%);"
	></div>

	<input
		{onchange}
		hidden
		type="range"
		bind:this={elementInput}
		{disabled}
		{value}
		{min}
		{max}
		{step}
	/>
</div>

<style lang="scss">
	@use './slider.scss';
</style>
