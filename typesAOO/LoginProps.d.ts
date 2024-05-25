import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { TransitionConfig } from 'svelte/transition';
export type LoginProps = CommonProps & {
    /** Whether to show the login form or not */
    showLogin: boolean;
    /** Transition configuration for the login form */
    transition: TransitionConfig;
    /** Fields for the login form */
    fields: {
        email: string;
        password: string;
    };
    /** Whether the form is loading or not */
    loading: boolean;
    /** Whether the form is submitting or not */
    submitting: boolean;
    /** Function to call when the form is submitted */
    onSubmit: (args: any) => Promise<any>;
    /** Children slot for the default content */
    children?: Snippet;
    /** Slot for the login avatar root */
    loginAvatarRoot?: Snippet;
    /** Slot for the login avatar */
    loginAvatar?: Snippet;
    /** Slot for the login form */
    loginForm?: Snippet;
};