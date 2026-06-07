import { describe, it, expect } from 'vitest';
import { parseStream } from '$lib/client/IdaeApiStreamParser.js';

function streamFromChunks(chunks: string[]): ReadableStream<Uint8Array> {
	const encoder = new TextEncoder();
	let i = 0;
	return new ReadableStream<Uint8Array>({
		pull(controller) {
			if (i < chunks.length) {
				controller.enqueue(encoder.encode(chunks[i++]));
			} else {
				controller.close();
			}
		}
	});
}

async function collect<T>(gen: AsyncGenerator<T>): Promise<T[]> {
	const out: T[] = [];
	for await (const v of gen) out.push(v);
	return out;
}

describe('parseStream', () => {
	describe('sse format', () => {
		it('parses single complete frame', async () => {
			const stream = streamFromChunks(['data: {"chunk":"hello"}\n\n']);
			const result = await collect(parseStream(stream, 'sse'));
			expect(result).toEqual([{ chunk: 'hello' }]);
		});

		it('parses multiple frames in one read', async () => {
			const stream = streamFromChunks([
				'data: {"chunk":"a"}\n\ndata: {"chunk":"b"}\n\n'
			]);
			const result = await collect(parseStream(stream, 'sse'));
			expect(result).toEqual([{ chunk: 'a' }, { chunk: 'b' }]);
		});

		it('reassembles a frame split across multiple reads', async () => {
			const stream = streamFromChunks([
				'data: {"chu',
				'nk":"hello"}',
				'\n\n'
			]);
			const result = await collect(parseStream(stream, 'sse'));
			expect(result).toEqual([{ chunk: 'hello' }]);
		});

		it('stops on [DONE] sentinel', async () => {
			const stream = streamFromChunks([
				'data: {"chunk":"a"}\n\ndata: [DONE]\n\ndata: {"chunk":"b"}\n\n'
			]);
			const result = await collect(parseStream(stream, 'sse'));
			expect(result).toEqual([{ chunk: 'a' }]);
		});

		it('skips blank frames', async () => {
			const stream = streamFromChunks(['\n\ndata: {"chunk":"a"}\n\n\n\n']);
			const result = await collect(parseStream(stream, 'sse'));
			expect(result).toEqual([{ chunk: 'a' }]);
		});
	});

	describe('ndjson format', () => {
		it('parses one JSON object per line', async () => {
			const stream = streamFromChunks(['{"chunk":"a"}\n{"chunk":"b"}\n']);
			const result = await collect(parseStream(stream, 'ndjson'));
			expect(result).toEqual([{ chunk: 'a' }, { chunk: 'b' }]);
		});

		it('reassembles a line split across reads', async () => {
			const stream = streamFromChunks(['{"chu', 'nk":"a"}\n']);
			const result = await collect(parseStream(stream, 'ndjson'));
			expect(result).toEqual([{ chunk: 'a' }]);
		});

		it('skips empty lines', async () => {
			const stream = streamFromChunks(['\n{"chunk":"a"}\n\n']);
			const result = await collect(parseStream(stream, 'ndjson'));
			expect(result).toEqual([{ chunk: 'a' }]);
		});
	});

	describe('text format', () => {
		it('yields raw decoded chunks', async () => {
			const stream = streamFromChunks(['hello ', 'world']);
			const result = await collect(parseStream<string>(stream, 'text'));
			expect(result).toEqual(['hello ', 'world']);
		});
	});

	describe('abort handling', () => {
		it('stops yielding once signal is aborted', async () => {
			const ctrl = new AbortController();
			const stream = streamFromChunks([
				'data: {"chunk":"a"}\n\n',
				'data: {"chunk":"b"}\n\n'
			]);
			const result: unknown[] = [];
			for await (const v of parseStream(stream, 'sse', ctrl.signal)) {
				result.push(v);
				ctrl.abort();
			}
			expect(result).toEqual([{ chunk: 'a' }]);
		});
	});
});
