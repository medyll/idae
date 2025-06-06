import { Be } from './be.js';

type CombineElementsHelper<T extends string, Depth extends number[]> = Depth['length'] extends 10
	? never
	: T | `${T} ${CombineElementsHelper<T, [...Depth, 1]>}`;
export type CombineElements<T extends string> = CombineElementsHelper<T, []>;
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
