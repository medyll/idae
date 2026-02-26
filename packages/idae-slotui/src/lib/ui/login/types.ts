import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { TransitionConfig } from 'svelte/transition';

export type LoginProps = CommonProps & {
	/** Whether to show the login form or not */
	showLogin: boolean;

	/** Transition configuration for the login form */
	transition: TransitionConfig;

	/** Fields for the login form */
	fields: { email: string; password: string };

	/** Whether the form is loading or not */
	loading: boolean;

	/** Whether the form is submitting or not */
	submitting: boolean;

	/** Function to call when the form is submitted */
	onSubmit: (args: any) => Promise<any>;

	/** Children snippet for the default content */
	children?: Snippet;

	/** Slot for the login avatar root */
	loginAvatarRoot?: Snippet;

	/** Slot for the login avatar */
	loginAvatar?: Snippet;

	/** Slot for the login form */
	loginForm?: Snippet;

	slotRetrievePassword?: Snippet;
};

export const loginDemoValues: DemoerStoryProps<LoginProps> = {
	showLogin: {
		type: 'boolean',
		values: [true, false],
		default: false
	},
	fields: {
		type: 'object',
		default: { email: '', password: '' }
	},
	loading: {
		type: 'boolean',
		values: [true, false],
		default: false
	},
	submitting: {
		type: 'boolean',
		values: [true, false],
		default: false
	},
	onSubmit: {
		type: 'function',
		default: () => Promise.resolve(),
		private: true
	}
};

export let { parameters, componentArgs } = demoerArgs(loginDemoValues);

// Export the main demo values and add slot placeholders
export { loginDemoValues };
export const loginAvatarDemoValues: DemoerStoryProps<any> = {};
export const loginAvatarRootDemoValues: DemoerStoryProps<any> = {};
export const loginFormDemoValues: DemoerStoryProps<any> = {};
export const slotRetrievePasswordDemoValues: DemoerStoryProps<any> = {};
