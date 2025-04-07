import { describe, it, expect, beforeEach, vi } from 'vitest';
import { be } from '../be.js';

describe('HttpHandler', () => {
	beforeEach(() => {
		// Mock the DOM
		document.body.innerHTML = '<div id="test"></div>';

		// Mock fetch
		global.fetch = vi.fn().mockResolvedValue({
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

		expect(fetch).toHaveBeenCalledWith('/content.html');
	});

	it('should insert content with three arguments using insertHttp', async () => {
		await be('#test').insertHttp('/content.html', 'afterbegin', ({ be }) => {
			expect(be.html).toContain('<p>Loaded content</p>');
		});

		expect(fetch).toHaveBeenCalledWith('/content.html');
	});

	it('should insert content at the default position (beforeend) using insertHttp', async () => {
		await be('#test').insertHttp('/content.html', ({ be }) => {
			expect(be.html).toContain('<p>Loaded content</p>');
		});

		expect(fetch).toHaveBeenCalledWith('/content.html');
	});
});
