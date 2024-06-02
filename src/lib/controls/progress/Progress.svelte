<script lang="ts">
	type ProgressProps = {
		/** className off the root component */
		class?: string;

		/** css style off the root component */
		style?: string;

		/** element root HTMLDivElement props */
		element?: HTMLDivElement | null;

		/** base value for the progress */
		percentBase?: number;

		/** current value of the progress */
		value: number;

		/** can be vertical or horizontal */
		direction: 'vertical' | 'horizontal';
	};

	let {
		class: className = '',
		style = '',
		element = null,
		percentBase = 100,
		value = 0,
		direction = 'horizontal'
	} = $props() as ProgressProps;

	const title = `${value} / ${percentBase}`;

	let attr = direction === 'vertical' ? 'height' : 'width';
	let attrTickness = direction === 'vertical' ? 'width' : 'height';
	const precWidth = $derived((value / percentBase) * 100);
</script>

<div bind:this={element} class="progress {className} w-large" {style} {title}>
	<div class="progress-gouge" style="{attr}:{precWidth}%;{attrTickness}:0.5rem"></div>
</div>

<style lang="scss">
	@import './progress.scss';
</style>
