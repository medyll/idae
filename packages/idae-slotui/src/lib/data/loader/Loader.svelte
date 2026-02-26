<script module lang="ts">
import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
/**
 * Props for the Loader component.
 * Displays loading, error, empty, or success states with icons and messages.
 */
export type LoaderProps = CommonProps & {
	/** Status of the loader */
	status: 'loading' | 'success' | 'error' | 'empty' | undefined;
	/** Whether to show success status or not */
	showSuccess?: boolean;
	/** Icon for the loading status */
	loadingIcon?: string;
	/** Icon for the error status */
	errorIcon?: string;
	/** Icon for the empty status */
	emptyIcon?: string;
	/** Icon for the success status */
	successIcon?: string;
	/** Message to display */
	message?: string;
	/** Default messages for different statuses */
	messages: Record<'loading' | 'success' | 'error' | 'empty', string>;
	/** @deprecated */
	isLoading?: boolean;
	/** @deprecated */
	isError?: boolean;
	/** @deprecated */
	isEmpty?: boolean;
	/** Children snippet for the default content */
	children?: Snippet;
	loaderLoading?: Snippet;
	loaderError?: Snippet;
	loaderEmpty?: Snippet;
	loaderMessage?: Snippet;
	loaderSuccess?: Snippet;
};
</script>

<script lang="ts">
import { fade } from 'svelte/transition';
import Icon from '$lib/base/icon/Icon.svelte';
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
	children
} = $props<LoaderProps>();

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
						<Icon
							style="color:var(--sld-color-primary)"
							icon={loadingIcon}
							iconSize="medium"
							rotate
						/>
					</Slotted>
				{/if}
				{#if status === 'error' || isError}
					<Slotted child={loaderError}>
						<Icon style="color:orange;" icon={errorIcon} iconSize="medium" />
					</Slotted>
				{/if}
				{#if showSuccess && status === 'success'}
					<Slotted child={loaderSuccess}>
						<Icon style="color:green;" icon={successIcon} iconSize="medium" />
					</Slotted>
				{/if}
				{#if status === 'empty' || isEmpty}
					<Slotted child={loaderEmpty}>
						<Icon icon={emptyIcon} iconSize="medium" />
					</Slotted>
				{/if}

				{#if Boolean(finalMessage)}
					<Slotted child={loaderMessage}>
						<div class="loader-message">{finalMessage}</div>
					</Slotted>
				{/if}
			</div>
		</div>
	{/if}
{/key}

<style global lang="postcss">
	@reference "tailwindcss";
	@import './loader.css';
</style>
