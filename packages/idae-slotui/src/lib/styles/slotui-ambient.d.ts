import type { ElementProps } from '../types/index.ts';

declare module 'svelte/elements' {
	export interface SvelteHTMLElements {
		full: HTMLButtonAttributes;
	}

	export interface HTMLAttributes<T> {
		width?: ElementProps['width'];
		tall?: ElementProps['tall'];
		gutter?: ElementProps['gutter'];
		variant?: ElementProps['variant'];
		ratio?: string | `true` | `false`;
		square?: string | boolean | `true` | `false`;
		rotation?: string | number;
	}
}

export {};
