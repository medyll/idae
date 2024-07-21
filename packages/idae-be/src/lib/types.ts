import { Be } from './be.js';

export type CombineElements<T extends string> = T extends any
	? T | `${T} ${CombineElements<T>}`
	: never;
export type IsWhat = 'element' | 'array' | 'qy';

export type PositionSnapOptions =
	| 'top'
	| 'right'
	| 'bottom'
	| 'left'
	| `${'top' | 'right' | 'bottom' | 'left'} center`
	| 'center';

export type HandlerCallbackProps = {
	be: Be;
	fragment: any;
	root: Be;
	requested?: any;
	method?: any;
};
export type HandlerCallBack = (element: HandlerCallbackProps) => void;

export type ExpandTyping<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export interface CommonHandler<T> {
	handle: (actions: any) => Be;
	methods: string[] | keyof T;
	valueOf: () => T;
}
