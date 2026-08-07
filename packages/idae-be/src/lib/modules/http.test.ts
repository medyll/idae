import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { be } from '../be.js';

describe('HttpHandler', () => {
	beforeEach(() => {
		// Mock the DOM
		document.body.innerHTML = '<div id="test"></div>';

		// Mock fetch
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			text: vi.fn().mockResolvedValue('<p>Loaded content</p>')
		}) as unknown as typeof fetch;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should update content with two arguments using updateHttp', async () => {
		await be('#test').updateHttp('/content.html', ({ be }) => {
			expect(be.html).toBe('<p>Loaded content</p>');
		});

		expect(fetch).toHaveBeenCalledWith('/content.html', {
			method: 'GET',
			body: undefined,
			headers: { 'Content-Type': 'application/json' }
		});
	});

	it('should update content with three arguments using updateHttp', async () => {
		await be('#test').updateHttp(
			'/content.html',
			{ method: 'POST', data: { key: 'value' }, headers: { Authorization: 'Bearer token' } },
			({ be }) => {
				expect(be.html).toBe('<p>Loaded content</p>');
			}
		);

		expect(fetch).toHaveBeenCalledWith('/content.html', {
			method: 'POST',
			body: JSON.stringify({ key: 'value' }),
			headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' }
		});
	});

	it('should insert content with two arguments using insertHttp', async () => {
		await be('#test').insertHttp('/content.html', ({ be }) => {
			expect(be.html).toContain('<p>Loaded content</p>');
		});

		expect(fetch).toHaveBeenCalledWith('/content.html', {});
	});

	it('should insert content with three arguments using insertHttp', async () => {
		await be('#test').insertHttp('/content.html', 'afterbegin', ({ be }) => {
			expect(be.html).toContain('<p>Loaded content</p>');
		});

		expect(fetch).toHaveBeenCalledWith('/content.html', {});
	});

	it('should insert content at the default position (beforeend) using insertHttp', async () => {
		await be('#test').insertHttp('/content.html', ({ be }) => {
			expect(be.html).toContain('<p>Loaded content</p>');
		});

		expect(fetch).toHaveBeenCalledWith('/content.html', {});
	});

	it('should call onFailure and skip content injection on non-ok response', async () => {
		const errorResponse = {
			ok: false,
			status: 500,
			text: vi.fn().mockResolvedValue('<p>Error body</p>')
		};
		global.fetch = vi.fn().mockResolvedValue(errorResponse) as unknown as typeof fetch;

		const onFailure = vi.fn();
		const callback = vi.fn();

		await be('#test').updateHttp('/content.html', { onFailure }, callback);

		expect(onFailure).toHaveBeenCalledWith(errorResponse);
		expect(callback).not.toHaveBeenCalled();
		expect(document.getElementById('test')?.innerHTML).toBe('');
	});

	it('should call onFailure with null response when fetch throws', async () => {
		const networkError = new Error('network down');
		global.fetch = vi.fn().mockRejectedValue(networkError) as unknown as typeof fetch;

		const onFailure = vi.fn();
		const callback = vi.fn();

		await be('#test').updateHttp('/content.html', { onFailure }, callback);

		expect(onFailure).toHaveBeenCalledWith(null, networkError);
		expect(callback).not.toHaveBeenCalled();
	});

	it('should rethrow when fetch fails and no onFailure is provided', async () => {
		global.fetch = vi.fn().mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

		await expect(be('#test').updateHttp('/content.html')).rejects.toThrow('network down');
	});

	it('should serialize params onto the URL', async () => {
		await be('#test').updateHttp('/content.html', { params: { a: '1', b: 'two words' } });

		expect(fetch).toHaveBeenCalledWith(
			'/content.html?a=1&b=two+words',
			expect.objectContaining({ method: 'GET' })
		);
	});

	it('should abort the request after the timeout', async () => {
		vi.useFakeTimers();
		try {
			global.fetch = vi.fn().mockImplementation(
				(_url: string, init?: RequestInit) =>
					new Promise((_resolve, reject) => {
						init?.signal?.addEventListener('abort', () =>
							reject(new DOMException('Aborted', 'AbortError'))
						);
					})
			) as unknown as typeof fetch;

			const onFailure = vi.fn();
			const promise = be('#test').updateHttp('/content.html', { timeout: 100, onFailure });

			await vi.advanceTimersByTimeAsync(150);
			await promise;

			expect(onFailure).toHaveBeenCalledWith(null, expect.any(DOMException));
		} finally {
			vi.useRealTimers();
		}
	});

	it('should call onFailure for insertHttp on non-ok response', async () => {
		const errorResponse = { ok: false, status: 404, text: vi.fn().mockResolvedValue('nope') };
		global.fetch = vi.fn().mockResolvedValue(errorResponse) as unknown as typeof fetch;

		const onFailure = vi.fn();
		const callback = vi.fn();

		await be('#test').insertHttp('/missing.html', 'beforeend', { onFailure }, callback);

		expect(onFailure).toHaveBeenCalledWith(errorResponse);
		expect(callback).not.toHaveBeenCalled();
		expect(document.getElementById('test')?.innerHTML).toBe('');
	});
});
