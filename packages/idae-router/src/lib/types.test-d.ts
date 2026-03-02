/**
 * Type-level assertions for Sprint 04 generics.
 * These are checked by TypeScript at compile time.
 * @vitest-environment node
 */
import { describe, it, expectTypeOf } from 'vitest';
import type { Route, Context, Action, CacheOptions, RouterOptions, RouterInstance } from './types';

interface User {
	id: number;
	name: string;
}

describe('Route<TData> and Context<TData> type assertions', () => {
	it('ctx.data inside Route<User> action is User | null', () => {
		// This is a compile-time assertion — TypeScript will error if the types are wrong
		const action: Action<User> = (ctx) => {
			expectTypeOf(ctx.data).toEqualTypeOf<User | null>();
			return ctx.data?.name ?? '';
		};
		expectTypeOf(action).toMatchTypeOf<Action<User>>();
	});

	it('ctx.data in default Action (no generic) is unknown | null', () => {
		const action: Action = (ctx) => {
			expectTypeOf(ctx.data).toEqualTypeOf<unknown | null>();
			return '';
		};
		expectTypeOf(action).toMatchTypeOf<Action>();
	});

	it('Route<User> constrains http to RouteHttpConfig<User>', () => {
		const route: Route<User> = {
			path: '/users/:id',
			http: { url: '/api/users/:id' }
		};
		expectTypeOf(route.http).toEqualTypeOf<import('./types').RouteHttpConfig<User> | undefined>();
	});

	it('CacheOptions has ttl, staleTime, key fields', () => {
		const opts: CacheOptions = { ttl: 60_000, staleTime: 5_000, key: 'custom' };
		expectTypeOf(opts.ttl).toEqualTypeOf<number | undefined>();
		expectTypeOf(opts.staleTime).toEqualTypeOf<number | undefined>();
		expectTypeOf(opts.key).toEqualTypeOf<string | undefined>();
	});

	it('RouterOptions.cache accepts CacheOptions or false', () => {
		const optsA: RouterOptions = { cache: false };
		const optsB: RouterOptions = { cache: { ttl: 30_000 } };
		expectTypeOf(optsA.cache).toEqualTypeOf<CacheOptions | false | undefined>();
		expectTypeOf(optsB.cache).toEqualTypeOf<CacheOptions | false | undefined>();
	});

	it('RouterInstance.prefetch, invalidate, buildUrl, getState are optional methods', () => {
		expectTypeOf<RouterInstance['prefetch']>().toEqualTypeOf<
			((path: string) => Promise<void>) | undefined
		>();
		expectTypeOf<RouterInstance['invalidate']>().toEqualTypeOf<
			((path?: string) => void) | undefined
		>();
		expectTypeOf<RouterInstance['buildUrl']>().toEqualTypeOf<
			((path: string, params?: Record<string, string>) => string) | undefined
		>();
		expectTypeOf<RouterInstance['getState']>().toEqualTypeOf<
			(() => Context | null) | undefined
		>();
	});

	it('Context.isLoading and isRevalidating are optional booleans', () => {
		expectTypeOf<Context['isLoading']>().toEqualTypeOf<boolean | undefined>();
		expectTypeOf<Context['isRevalidating']>().toEqualTypeOf<boolean | undefined>();
		expectTypeOf<Context['queryError']>().toEqualTypeOf<Error | undefined>();
	});
});
