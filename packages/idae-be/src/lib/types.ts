import { Be } from './be.js';

export type CombineElements<T extends string> = T extends unknown
	? T | `${T} ${CombineElements<T>}`
	: never;
export type IsWhat = 'element' | 'array' | 'qy';

export type PositionSnapOptions =
	| 'top'
	| 'right'
	| 'bottom'
	| 'left'
	| 'center'
	| `${'top' | 'bottom'} ${'left' | 'right' | 'center'}`
	| `${'left' | 'right'} ${'top' | 'bottom' | 'center'}`;

export type HandlerCallbackProps = {
	be: Be;
	fragment: unknown;
	root: Be;
	requested?: unknown;
	method?: string;
};
export type HandlerCallBackFn = (element: HandlerCallbackProps) => void;
export type HandlerCallBack = { callback?: (element: HandlerCallbackProps) => void };

export type ExpandTyping<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export interface CommonHandler<T = unknown, H = unknown, V = unknown> {
	handle: (actions: H) => Be;
	methods: string[] | keyof T;
	valueOf: () => V;
}
