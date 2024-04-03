<svelte:options accessors={true} runes={true} />

<script lang="ts">
	import type { CommonProps } from '$lib/types/index.js';

	type SliderProps = CommonProps & {
		/** element root HTMLDivElement props */
		element?: HTMLDivElement | null;
		/** Obtains a bound DOM reference to the slider's input element. */
		elementInput?: HTMLInputElement | null;
		/** Obtains a bound DOM reference to the slider's outer container element. */
		elementContainer?: HTMLDivElement;
		/** Obtains a bound DOM reference to the slider's outer rail element. */
		elementRail?: HTMLDivElement;
		/** Obtains a bound DOM reference to the slider's track (fill) element. */
		elementGutter?: HTMLDivElement;
		/** Slider's value. */
		value: number;
		/** Minimum value. */
		min: number;
		/** Maximum value . */
		max: number;
		/** Steps size. */
		step: number;
		/** Determines if the slider's value tooltip will be shown. */
		tooltip: boolean;
		/** Slider's orientation. */
		orientation: 'vertical' | 'horizontal';
		/** Reverse th slider order . */
		reverse: boolean;
		/** Controls Slider  status. */
		disabled: boolean;
	};

	let {
		class: className = '',
		style = '',
		element,
		elementInput,
		elementContainer,
		elementRail,
		elementGutter,
		value = 0,
		min = 0,
		max = 100,
		step = 1,
		tooltip = true,
		orientation = 'horizontal',
		reverse = false,
		disabled = false
	}: SliderProps = $props();

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
			if (holding) dragging = true;
		},
		cancel() {
			holding = false;
			dragging = false;
		}
	};

	const key = {
		start(event) {
			if (event.cancelable) event.preventDefault();
			holding = true;
		},
		mouseDown(event: MouseEvent) {
			if (event.cancelable) event.preventDefault();
			holding = true;
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

	// $: dispatch('change', value);
	const percentage = $derived(getPercentage(value));
	$effect(() => {
		if (value <= min) value = min;
		else if (value >= max) value = max;

		if (dragging) {
			getSliderVal(event);
			dragging = false;
		}
	});

	function getPercentage(val: number) {
		return ((val - min) / (max - min)) * 100;
	}

	function getSliderVal(event: Event) {
		const { clientX, clientY } = event.touches ? event.touches[0] : event;
		const { left, top, width, height } = elementRail?.getBoundingClientRect();
		const offset = orientation === 'horizontal' ? clientX - left : top + height - clientY;
		const size = orientation === 'horizontal' ? width : height;
		const newValue = min + (max - min) * (offset / size);
		//
		value = Math.round(newValue / step) * step;
	}
</script>

<svelte:window
	on:mousemove={move.handle}
	on:mouseup={move.cancel}
	on:touchmove={move.handle}
	on:touchend={move.cancel}
	on:touchcancel={move.cancel}
/>

<div
	class="slider pad-1 border w-large"
	onmousedown={key.mouseDown}
	ontouchstart={key.start}
	onkeydown={key.keyDown}
>
	<div class="gouge pad-1">
		<div
			class="sliderPin"
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value}
			role="slider"
		/>
	</div>

	<input hidden type="range" bind:this={elementInput} {disabled} {value} {min} {max} {step} />
</div>

<style lang="scss">
	@import './slider.scss';
</style>
