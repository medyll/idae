import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

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
	message?: string | undefined;

	/** Default messages for different statuses */
	/** used if props.message   is omitted */
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
