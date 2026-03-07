// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { interpolateParams, resolveUrl, fetchRouteData } from './fetcher.js';

// Ensure window.location.origin is 'http://localhost' in jsdom
Object.defineProperty(window, 'location', {
	value: { ...window.location, origin: 'http://localhost' },
	writable: true
});

// ──────────────────────────────────────────────────────────────────────────────
// interpolateParams
// ──────────────────────────────────────────────────────────────────────────────
describe('interpolateParams', () => {
	it('replaces a single :param token', () => {
		expect(interpolateParams('/api/users/:id', { id: '42' })).toBe('/api/users/42');
	});

	it('replaces multiple :param tokens', () => {
		expect(interpolateParams('/api/:a/:b', { a: 'x', b: 'y' })).toBe('/api/x/y');
	});

	it('leaves token as-is when no matching param', () => {
		expect(interpolateParams('/api/users/:id', {})).toBe('/api/users/:id');
	});

	it('leaves non-token segments unchanged', () => {
		expect(interpolateParams('/api/static', { id: '1' })).toBe('/api/static');
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// resolveUrl
// ──────────────────────────────────────────────────────────────────────────────
describe('resolveUrl', () => {
	describe('internal type', () => {
		it('prepends window.location.origin and interpolates params', () => {
			expect(resolveUrl({ url: '/api/users/:id' }, 'internal', { id: '5' })).toBe(
				'http://localhost/api/users/5'
			);
		});

		it('adds leading slash if url does not start with /', () => {
			expect(resolveUrl({ url: 'api/items' }, 'internal', {})).toBe(
				'http://localhost/api/items'
			);
		});

		it('does not double-slash when url already has /', () => {
			const result = resolveUrl({ url: '/api/items' }, 'internal', {});
			expect(result).toBe('http://localhost/api/items');
			expect(result).not.toContain('localhost//');
		});
	});

	describe('external type', () => {
		it('prepends https:// to a bare host+path', () => {
			expect(resolveUrl({ url: 'api.example.com/users/:id' }, 'external', { id: '5' })).toBe(
				'https://api.example.com/users/5'
			);
		});

		it('strips http:// and prepends https://', () => {
			expect(resolveUrl({ url: 'http://evil.com/data' }, 'external', {})).toBe(
				'https://evil.com/data'
			);
		});

		it('does not double-prefix if url already has https://', () => {
			expect(resolveUrl({ url: 'https://already.com/data' }, 'external', {})).toBe(
				'https://already.com/data'
			);
		});
	});
});

// ──────────────────────────────────────────────────────────────────────────────
// fetchRouteData
// ──────────────────────────────────────────────────────────────────────────────
describe('fetchRouteData', () => {
	beforeEach(() => {
		vi.stubGlobal('fetch', vi.fn());
	});
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns { data, error: undefined } on ok response', async () => {
		const mockFetch = vi.mocked(fetch);
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({ id: 1 })
		} as Response);

		const result = await fetchRouteData({ http: { url: '/api/items/1' } }, {});
		expect(result.data).toEqual({ id: 1 });
		expect(result.error).toBeUndefined();
	});

	it('returns { data: null, error } on non-ok status', async () => {
		const mockFetch = vi.mocked(fetch);
		mockFetch.mockResolvedValue({ ok: false, status: 404 } as Response);

		const result = await fetchRouteData({ http: { url: '/api/items/1' } }, {});
		expect(result.data).toBeNull();
		expect(result.error?.message).toBe('HTTP 404');
	});

	it('returns { data: null, error } on network rejection', async () => {
		const mockFetch = vi.mocked(fetch);
		mockFetch.mockRejectedValue(new Error('NetworkError'));

		const result = await fetchRouteData({ http: { url: '/api/items/1' } }, {});
		expect(result.data).toBeNull();
		expect(result.error?.message).toBe('NetworkError');
	});

	it('returns { data: undefined, error: undefined } when neither http nor http_source', async () => {
		const result = await fetchRouteData({}, {});
		expect(result.data).toBeUndefined();
		expect(result.error).toBeUndefined();
		expect(fetch).not.toHaveBeenCalled();
	});

	it('uses http and warns when both http and http_source are defined', async () => {
		const mockFetch = vi.mocked(fetch);
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({ source: 'internal' })
		} as Response);

		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = await fetchRouteData(
			{
				http: { url: '/api/internal' },
				http_source: { url: 'api.example.com/external' }
			},
			{}
		);

		expect(warnSpy).toHaveBeenCalledOnce();
		expect(warnSpy.mock.calls[0][0]).toContain('http');
		expect(result.data).toEqual({ source: 'internal' });

		// Verify the URL used is internal (starts with origin), not external
		expect(mockFetch.mock.calls[0][0]).toContain('http://localhost');

		warnSpy.mockRestore();
	});

	it('handles http_source route and uses https:// URL', async () => {
		const mockFetch = vi.mocked(fetch);
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({ post: 1 })
		} as Response);

		const result = await fetchRouteData(
			{ http_source: { url: 'jsonplaceholder.typicode.com/posts/1' } },
			{}
		);

		expect(result.data).toEqual({ post: 1 });
		expect(mockFetch.mock.calls[0][0]).toMatch(/^https:\/\//);
	});
});
