import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IdaeApiClientConfig } from '$lib/client/IdaeApiClientConfig.js';
import { IdaeApiClientRequest } from '$lib/client/IdaeApiClientRequest.js';

global.fetch = vi.fn();

function sseStreamFrom(text: string): ReadableStream<Uint8Array> {
	const encoder = new TextEncoder();
	return new ReadableStream<Uint8Array>({
		start(controller) {
			controller.enqueue(encoder.encode(text));
			controller.close();
		}
	});
}

async function collect<T>(gen: AsyncGenerator<T>): Promise<T[]> {
	const out: T[] = [];
	for await (const v of gen) out.push(v);
	return out;
}

describe('IdaeApiClientRequest.doStream', () => {
	let request: IdaeApiClientRequest;

	beforeEach(() => {
		vi.clearAllMocks();
		IdaeApiClientConfig.setOptions({
			host: 'localhost',
			port: 3000,
			method: 'http',
			defaultDb: 'app'
		});
		request = new IdaeApiClientRequest(IdaeApiClientConfig);
	});

	it('yields parsed SSE chunks from response.body', async () => {
		(global.fetch as any).mockResolvedValueOnce({
			ok: true,
			body: sseStreamFrom('data: {"chunk":"hello"}\n\ndata: {"chunk":"world"}\n\n')
		});

		const result = await collect(
			request.doStream<{ chunk: string }>({ slug: 'ai/chat/1/send', body: { foo: 'bar' } })
		);

		expect(result).toEqual([{ chunk: 'hello' }, { chunk: 'world' }]);
	});

	it('sends method/body/headers like doRequest', async () => {
		(global.fetch as any).mockResolvedValueOnce({
			ok: true,
			body: sseStreamFrom('data: {"chunk":"x"}\n\n')
		});

		await collect(request.doStream({ method: 'POST', slug: 'ai/chat/1/send', body: { a: 1 } }));

		const [url, init] = (global.fetch as any).mock.calls[0];
		expect(url).toContain('ai/chat/1/send');
		expect(init.method).toBe('POST');
		expect(init.body).toBe(JSON.stringify({ a: 1 }));
		expect(init.headers['Accept']).toBe('text/event-stream');
	});

	it('throws on non-ok response', async () => {
		(global.fetch as any).mockResolvedValueOnce({ ok: false, status: 500 });

		await expect(collect(request.doStream({ slug: 'ai/chat/1/send' }))).rejects.toThrow(
			/status: 500/
		);
	});

	it('throws when response has no body', async () => {
		(global.fetch as any).mockResolvedValueOnce({ ok: true, body: null });

		await expect(collect(request.doStream({ slug: 'ai/chat/1/send' }))).rejects.toThrow(
			/No response body/
		);
	});

	it('supports ndjson format', async () => {
		(global.fetch as any).mockResolvedValueOnce({
			ok: true,
			body: sseStreamFrom('{"chunk":"a"}\n{"chunk":"b"}\n')
		});

		const result = await collect(
			request.doStream<{ chunk: string }>({ slug: 'ai/chat/1/send', format: 'ndjson' })
		);

		expect(result).toEqual([{ chunk: 'a' }, { chunk: 'b' }]);
	});

	it('forwards abort signal to fetch', async () => {
		const ctrl = new AbortController();
		(global.fetch as any).mockResolvedValueOnce({
			ok: true,
			body: sseStreamFrom('data: {"chunk":"a"}\n\n')
		});

		await collect(request.doStream({ slug: 'ai/chat/1/send', signal: ctrl.signal }));

		const [, init] = (global.fetch as any).mock.calls[0];
		expect(init.signal).toBe(ctrl.signal);
	});
});
