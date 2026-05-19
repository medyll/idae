import { logger } from '../utils/logger.js';
import type { HookEvent, HookHandler, HookOptions, HookContext } from './types.js';

interface RegisteredHook {
	handler:    HookHandler;
	priority:   number;
	collection?: string;
	blocking:   boolean;
}

const registry = new Map<HookEvent, RegisteredHook[]>();

export function registerHook(event: HookEvent, handler: HookHandler, opts: HookOptions = {}): void {
	const list = registry.get(event) ?? [];
	list.push({
		handler,
		priority:   opts.priority ?? 100,
		collection: opts.collection,
		blocking:   opts.blocking ?? false,
	});
	list.sort((a, b) => a.priority - b.priority);
	registry.set(event, list);
}

export function clearHooks(event?: HookEvent): void {
	if (event) registry.delete(event);
	else       registry.clear();
}

export async function dispatch(event: HookEvent, ctx: HookContext): Promise<void> {
	const list = registry.get(event);
	if (!list?.length) return;
	for (const h of list) {
		if (h.collection && h.collection !== ctx.collection) continue;
		try {
			await h.handler(ctx);
		} catch (err) {
			logger.error(`Hook ${event} failed (collection=${ctx.collection}):`, err);
			if (h.blocking) throw err;
		}
	}
}
