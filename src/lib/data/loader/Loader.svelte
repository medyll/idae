<script lang="ts">
	import { fade } from 'svelte/transition';
	import Icon from '$lib/base/icon/Icon.svelte';

	let className = '';
	export { className as class };
	export let element: HTMLDivElement | null = null;
	export let style: string = '';

	export let status: 'loading' | 'success' | 'error' | 'empty' | undefined;
	export let showSuccess: boolean = true;
	/** @deprecated */
	export let isLoading: boolean = false;
	/** @deprecated */
	export let isError: boolean = false;
	/** @deprecated */
	export let isEmpty: boolean = false;

	/** icon sources */
	export let loadingIcon: string = 'mdi:loading';
	export let errorIcon: string = 'mdi:alert-circle-outline';
	export let emptyIcon: string = 'mdi:database-search-outline';
	export let successIcon: string = 'clarity:success-standard-line';

	/** message to display */
	export let message: string | undefined = undefined;
	/** used if props.message   is omitted */
	export let messages: any = {
		loading: 'Loading',
		error: 'An error occurred',
		empty: 'Empty results',
		success: 'Success'
	};

	const msgType = isLoading ? 'loading' : isError ? 'error' : isEmpty ? 'empty' : '';

	$: finalMessage = message ?? messages?.[status] ?? messages?.[msgType];

	let timer: any;
	$: if (status === 'success') {
		if (!showSuccess) status = undefined;
		else {
			clearTimeout(timer);
			timer = setTimeout(() => {
				status = undefined;
			}, 1250);
		}
	} else {
		clearTimeout(timer);
	}
</script>

{#key status}
	{#if status || isLoading || isError || isEmpty}
		<div bind:this={element} transition:fade|global class="loader {className}" {style}>
			<div class="loader-box">
				{#if status === 'loading' || isLoading}
					<slot name="loaderLoading">
						<Icon
							style="color:var(--sld-color-primary)"
							icon={loadingIcon}
							fontSize="medium"
							rotate
						/>
					</slot>
				{/if}
				{#if status === 'error' || isError}
					<slot name="loaderError">
						<Icon style="color:orange;" icon={errorIcon} fontSize="medium" />
					</slot>
				{/if}
				{#if showSuccess && status === 'success'}
					<slot name="loaderSuccess">
						<Icon style="color:green;" icon={successIcon} fontSize="medium" />
					</slot>
				{/if}
				{#if status === 'empty' || isEmpty}
					<slot name="loaderEmpty">
						<Icon icon={emptyIcon} fontSize="medium" />
					</slot>
				{/if}

				{#if Boolean(finalMessage)}
					<slot name="loaderMessage">
						<div class="loader-message">{finalMessage}</div>
					</slot>
				{/if}
			</div>
		</div>
	{/if}
{/key}

<style lang="scss">
	@import './loader.scss';
</style>
