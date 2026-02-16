export type ActionResult =
	| string
	| Node
	| DocumentFragment
	| void
	| (() => void)
	| Promise<string | Node | DocumentFragment | void | (() => void)>;

export interface Context {
	path: string;
	params: Record<string, string>;
	query: Record<string, string | string[]>;
	state?: unknown;
	metadata?: Record<string, unknown>;
}

export type Action = (ctx: Context) => ActionResult;

export interface Route {
	path: string;
	action: Action;
	metadata?: Record<string, unknown>;
}

export type BeforeNext = (nextArg?: false | string | void) => void;
export type BeforeHook = (
	to: Context,
	from: Context | null,
	next: BeforeNext
) => void | Promise<void>;
export type AfterHook = (to: Context, from: Context | null) => void | Promise<void>;
export type OnLeaveHook = (from: Context) => void | Promise<void>;

export interface RouterOptions {
	mode?: 'history' | 'hash';
	base?: string;
	outlet?: string | Element;
	routes?: Route[];
	linkInterception?: boolean;
	notFound?: Action;
}

export interface RouterInstance {
	push(path: string, state?: unknown): void;
	replace(path: string, state?: unknown): void;
	refresh(): void;
	navigate(path: string, state?: unknown, replace?: boolean): void;
	before(fn: BeforeHook): void;
	after(fn: AfterHook): void;
	onLeave(fn: OnLeaveHook): void;
}
