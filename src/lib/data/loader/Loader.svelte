<script lang="ts">
	import { fade } from 'svelte/transition';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { LoaderProps } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		status,
		showSuccess = true,
		loadingIcon = 'mdi:loading',
		errorIcon = 'mdi:alert-circle-outline',
		emptyIcon = 'mdi:database-search-outline',
		successIcon = 'clarity:success-standard-line',
		isLoading = false,
		isError = false,
		isEmpty = false,
		message,
		messages = {
			loading: 'Loading',
			error: 'An error occurred',
			empty: 'Empty results',
			success: 'Success'
		},
		loaderLoading,
		loaderError,
		loaderEmpty,
		loaderMessage,
		loaderSuccess,
		children,
		...rest
	}: LoaderProps = $props();

	const msgType = $derived(() =>
		isLoading ? 'loading' : isError ? 'error' : isEmpty ? 'empty' : ''
	);

	let finalMessage = $derived(() => message ?? messages?.[status] ?? messages?.[msgType]);

	let timer: any;
	$effect(() => {
		if (status === 'success') {
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
	});
</script>

{#key status}
	{#if status || isLoading || isError || isEmpty}
		<div bind:this={element} transition:fade|global class="loader {className}" {style} {...rest}>
			<div class="loader-box">
				{#if status === 'loading' || isLoading}
					<Slotted child={loaderLoading}>
						<slot name="loaderLoading">
							<Icon
								style="color:var(--sld-color-primary)"
								icon={loadingIcon}
								fontSize="medium"
								rotate
							/>
						</slot>
					</Slotted>
				{/if}
				{#if status === 'error' || isError}
					<Slotted child={loaderError}>
						<slot name="loaderError">
							<Icon style="color:orange;" icon={errorIcon} fontSize="medium" />
						</slot>
					</Slotted>
				{/if}
				{#if showSuccess && status === 'success'}
					<Slotted child={loaderSuccess}>
						<slot name="loaderSuccess">
							<Icon style="color:green;" icon={successIcon} fontSize="medium" />
						</slot>
					</Slotted>
				{/if}
				{#if status === 'empty' || isEmpty}
					<Slotted child={loaderEmpty}>
						<slot name="loaderEmpty">
							<Icon icon={emptyIcon} fontSize="medium" />
						</slot>
					</Slotted>
				{/if}

				{#if Boolean(finalMessage)}
					<Slotted child={loaderMessage}>
						<slot name="loaderMessage">
							<div class="loader-message">{finalMessage}</div>
						</slot>
					</Slotted>
				{/if}
			</div>
		</div>
	{/if}
{/key}

<style lang="scss">
	@import './loader.scss';
</style>
