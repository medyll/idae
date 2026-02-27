import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
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
	message?: string;

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

/* 	let parameters: any = {
		status: {
			type: 'string',
			values: ['loading', 'success', 'error', 'empty', undefined]
		}
	};

	let componentArgs = {
		status: defaultsArgsFromProps('status', parameters)
	} as LoaderProps; */

export const loaderDemoValues: DemoerStoryProps<LoaderProps> = {
	status: {
		type: 'string',
		values: [undefined, 'idle', 'loading', 'success', 'error', 'empty'],
		default: undefined
	},
	showSuccess: {
		type: 'boolean',
		default: false
	},
	loadingIcon: {
		type: 'icon',
		default: 'loading'
	},
	errorIcon: {
		type: 'icon',
		default: 'error'
	},
	emptyIcon: {
		type: 'icon',
		default: 'empty'
	},
	successIcon: {
		type: 'icon',
		default: 'success'
	},
	message: {
		type: 'string',
		default: 'Message'
	},
	messages: {
		type: 'object',
		default: {
			loading: 'Loading...',
			success: 'Success',
			error: 'Error',
			empty: 'Empty'
		},
		private: true
	}
};

export const { parameters, componentArgs } = demoerArgs(loaderDemoValues);

export const loaderEmptyDemoValues = {};
export const loaderErrorDemoValues = {};
export const loaderLoadingDemoValues = {};
export const loaderMessageDemoValues = {};
export const loaderSuccessDemoValues = {};

// Export the main demo values for loader (consumer expectation)
export { loaderDemoValues };
