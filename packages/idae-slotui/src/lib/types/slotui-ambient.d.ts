import { type ElementProps, type ContainerQueriesUnitsAttributes } from './index.ts';

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
		/** media queries */
		'hide-more-than'?: string;
		/** for container of containerQueries */
		container?: `inline` | `size` | `normal`;
		'hide-max-width'?: ContainerQueriesUnitsAttributes;
		'hide-max-height'?: ContainerQueriesUnitsAttributes;
		'hide-min-width'?: ContainerQueriesUnitsAttributes;
		'hide-min-height'?: ContainerQueriesUnitsAttributes;
	}
}

export {};
