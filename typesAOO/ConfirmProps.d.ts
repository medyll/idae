import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
export type ConfirmProps = CommonProps & {
    element: HTMLDivElement | null;
    /** element initial HTMLDivElement props */
    initialRef?: HTMLElement | null;
    /** element confirm HTMLDivElement props */
    contentRef?: HTMLElement | null;
    /** text displayed on initial button */
    tooltipInitial?: string | null;
    /** text displayed on initial button */
    primaryInitial: string;
    /** icon displayed on the initial button */
    iconInitial?: string;
    /** color of the icon displayed on the initial button */
    iconColorInitial?: string;
    /** text displayed on confirm button */
    primary?: string;
    /** icon displayed on the confirm button */
    icon?: string;
    /** color of the icon displayed on the confirm button
     * @type string
     */
    iconColor?: string;
    /** action initiated on confirmation */
    action: () => void;
    /** icon to display for back action */
    iconCancel?: string;
    initial?: Snippet;
    slots: {
        initial: Snippet;
    };
} & Partial<HTMLDivElement>;