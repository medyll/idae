export type HookEvent =
	| 'pre:list'   | 'post:list'
	| 'pre:read'   | 'post:read'
	| 'pre:create' | 'post:create'
	| 'pre:update' | 'post:update'
	| 'pre:delete' | 'post:delete'
	| 'pre:restore'| 'post:restore'
	| 'error:create' | 'error:update' | 'error:delete';

export interface HookContext<T = unknown> {
	event:      HookEvent;
	collection: string;
	recordId?:  string;
	data?:      T;
	prev?:      T;
	user?:      { userId?: string; login?: string };
	req?:       { ipAddress?: string; userAgent?: string };
	error?:     unknown;
	details?:   Record<string, unknown>;
}

export type HookHandler = (ctx: HookContext) => void | Promise<void>;

export interface HookOptions {
	priority?:   number;
	collection?: string;
	blocking?:   boolean;
}
