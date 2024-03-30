<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';

	let className = '';
	export { className as class };
	export let element: HTMLDivElement | null = null;
	export let style: string = '';
	/**    maximum rate     */
	export let ratingBase: number = 4;
	/** current score */
	export let scored: number = 0;

	/** default icon to be used when not using slots */
	export let defaultIcon: string | undefined = undefined;
	/** scored icon to be used when not using slots */
	export let scoredIcon: string | undefined = undefined;
	/** can be vertical or horizontal */
	export let direction: 'vertical' | 'horizontal' = 'horizontal';

	const title = `${scored} / ${ratingBase}`;
</script>

<div
	bind:this={element}
	class="rating {className}"
	style="--direction:{direction === 'horizontal' ? 'row' : 'column'};{style}"
	{title}
>
	{#each [...Array(ratingBase)] as rate, idx}
		{#if idx + 1 <= scored}
			<slot name="ratingScoredIcon">
				<Icon icon={scoredIcon} />
			</slot>
		{:else}
			<slot>
				<Icon icon={defaultIcon} />
			</slot>
		{/if}
	{/each}
</div>

<style lang="scss">
	@import './rating.scss';
</style>
