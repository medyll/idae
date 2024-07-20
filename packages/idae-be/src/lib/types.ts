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

export type HandlerCallbackProps = { element: Be; fragment: any; root: Be };
export type HandlerCallBack = (element: HandlerCallbackProps) => void;
