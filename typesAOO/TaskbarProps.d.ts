import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
export type TaskbarProps = CommonProps & {
    /** className off the root component */
    class?: string;
    /** element root HTMLDivElement props */
    element: HTMLDivElement;
    /** slots for the taskbar */
    taskBarLeft?: Snippet;
    taskBarRight?: Snippet;
};