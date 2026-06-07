import { describe, it, expect, vi } from 'vitest';
import { SseStream } from '$lib/server/sse.js';

function mockResponse() {
	return {
		setHeader: vi.fn(),
		flushHeaders: vi.fn(),
		write: vi.fn(),
		end: vi.fn()
	} as any;
}

describe('SseStream', () => {
	it('sets SSE headers on construction', () => {
		const res = mockResponse();
		new SseStream(res);

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
		expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
		expect(res.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive');
		expect(res.flushHeaders).toHaveBeenCalled();
	});

	it('send() writes a data frame as JSON', () => {
		const res = mockResponse();
		const sse = new SseStream(res);

		sse.send({ chunk: 'hello' });

		expect(res.write).toHaveBeenCalledWith('data: {"chunk":"hello"}\n\n');
	});

	it('done() writes a done frame and ends the response', () => {
		const res = mockResponse();
		const sse = new SseStream(res);

		sse.done({ tokens: 42 });

		expect(res.write).toHaveBeenCalledWith('data: {"done":true,"tokens":42}\n\n');
		expect(res.end).toHaveBeenCalled();
	});

	it('error() writes an error frame and ends the response', () => {
		const res = mockResponse();
		const sse = new SseStream(res);

		sse.error('boom');

		expect(res.write).toHaveBeenCalledWith('data: {"error":"boom"}\n\n');
		expect(res.end).toHaveBeenCalled();
	});

	it('tolerates missing flushHeaders on the response', () => {
		const res = mockResponse();
		delete res.flushHeaders;

		expect(() => new SseStream(res)).not.toThrow();
	});
});
