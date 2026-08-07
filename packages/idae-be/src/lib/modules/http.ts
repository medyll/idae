import { Be } from '../be.js';
import type { CommonHandler, HandlerCallBackFn } from '../types.js';
import { DomHandler } from './dom.js';

enum httpMethods {
	update = 'update',
	insert = 'insert'
}

export interface HttpRequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	data?: Record<string, unknown>;
	headers?: Record<string, string>;
	/** Query-string parameters (serialized onto the URL, mainly for GET). */
	params?: Record<string, string>;
	/** Abort the request after this many milliseconds. */
	timeout?: number;
	/**
	 * Invoked instead of the content callback when the response is not ok
	 * (`!response.ok`) or the fetch throws. `response` is null on network
	 * failure / timeout; `error` is set when the fetch threw.
	 */
	onFailure?: (response: Response | null, error?: unknown) => void;
}

export interface HttpHandlerHandle {
	update?: {
		url: string;
		options?: HttpRequestOptions;
		callback?: HandlerCallBackFn;
	};
	insert?: {
		url: string;
		mode?: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend';
		options?: Pick<HttpRequestOptions, 'params' | 'timeout' | 'onFailure'>;
		callback?: HandlerCallBackFn;
	};
}

/**
 * Handles HTTP operations for Be elements.
 */
export class HttpHandler implements CommonHandler<HttpHandler, HttpHandlerHandle> {
	private beElement: Be;

	static methods = Object.values(httpMethods);

	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	methods: string[] = HttpHandler.methods;

	/**
	 * Handles HTTP actions like loading content or inserting it into the DOM.
	 * @param actions - The actions to perform.
	 * @returns The Be instance for method chaining.
	 */
	handle(actions: HttpHandlerHandle): Be {
		Object.entries(actions).forEach(([method, props]) => {
			switch (method) {
				case 'update':
					this.update(props.url, props.options, props.callback);
					break;
				case 'insert':
					this.insert(props.url, props.mode, props.options, props.callback);
					break;
			}
		});

		return this.beElement;
	}

	/**
	 * Loads content from a URL and updates the element's content.
	 * Can be called with two or three arguments:
	 * - `update(url: string, callback?: HandlerCallBackFn)`
	 * - `update(url: string, options?: { method?: string; data?: object; headers?: object }, callback?: HandlerCallBackFn)`
	 *
	 * @param url - The URL to fetch content from.
	 * @param optionsOrCallback - Optional configuration for the HTTP request or a callback function.
	 * @param callback - Optional callback function if options are provided.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // Call with two arguments
	 * be('#test').updateHttp('/content.html', ({ be }) => console.log(be.html));
	 *
	 * // Call with three arguments
	 * be('#test').updateHttp('/content.html', { method: 'POST', data: { key: 'value' } }, ({ be }) => console.log(be.html));
	 */
	async update(
		url: string,
		optionsOrCallback?: HttpRequestOptions | HandlerCallBackFn,
		callback?: HandlerCallBackFn
	) {
		let options: HttpRequestOptions | undefined;

		// Detect if the second argument is an options object or a callback function
		if (typeof optionsOrCallback === 'function') {
			callback = optionsOrCallback;
		} else {
			options = optionsOrCallback;
		}

		let response: Response;
		try {
			response = await this.request(
				url,
				{
					method: options?.method || 'GET',
					body: options?.data ? JSON.stringify(options.data) : undefined,
					headers: {
						'Content-Type': 'application/json',
						...options?.headers
					}
				},
				options
			);
		} catch (error) {
			if (options?.onFailure) {
				options.onFailure(null, error);
				return this.beElement;
			}
			throw error;
		}

		if (!response.ok) {
			if (options?.onFailure) {
				options.onFailure(response);
				return this.beElement;
			}
			throw new Error(`updateHttp: request failed with status ${response.status}`);
		}

		const content = await response.text();

		this.beElement.eachNode((el) => {
			const beElem = Be.elem(el);
			beElem.update(content);

			callback?.({
				fragment: content,
				be: beElem,
				root: this.beElement
			});
		});

		return this.beElement;
	}

	/**
	 * Loads content from a URL and inserts it into the element at a specified position.
	 * Can be called with two or three arguments:
	 * - `insert(url: string, callback?: HandlerCallBackFn)`
	 * - `insert(url: string, mode?: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend', callback?: HandlerCallBackFn)`
	 *
	 * @param url - The URL to fetch content from.
	 * @param modeOrCallback - Optional position to insert the content or a callback function.
	 * @param callback - Optional callback function if mode is provided.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // Call with two arguments
	 * be('#test').insertHttp('/content.html', ({ be }) => console.log(be.html));
	 *
	 * // Call with three arguments
	 * be('#test').insertHttp('/content.html', 'afterbegin', ({ be }) => console.log(be.html));
	 */
	async insert(
		url: string,
		modeOrCallback?: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend' | HandlerCallBackFn,
		optionsOrCallback?: Pick<HttpRequestOptions, 'params' | 'timeout' | 'onFailure'> | HandlerCallBackFn,
		callback?: HandlerCallBackFn
	) {
		let mode: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend' | undefined;
		let options: Pick<HttpRequestOptions, 'params' | 'timeout' | 'onFailure'> | undefined;

		// Detect if the second argument is a mode or a callback function
		if (typeof modeOrCallback === 'function') {
			callback = modeOrCallback;
		} else {
			mode = modeOrCallback;
		}

		// Detect if the third argument is options or a callback function
		if (typeof optionsOrCallback === 'function') {
			callback = optionsOrCallback;
		} else {
			options = optionsOrCallback;
		}

		let response: Response;
		try {
			response = await this.request(url, {}, options);
		} catch (error) {
			if (options?.onFailure) {
				options.onFailure(null, error);
				return this.beElement;
			}
			throw error;
		}

		if (!response.ok) {
			if (options?.onFailure) {
				options.onFailure(response);
				return this.beElement;
			}
			throw new Error(`insertHttp: request failed with status ${response.status}`);
		}

		const content = await response.text();

		this.beElement.eachNode((el) => {
			const beElem = Be.elem(el);
			const domHandler = new DomHandler(beElem);
			domHandler.insert(mode || 'beforeend', content);

			callback?.({
				fragment: content,
				be: beElem,
				root: this.beElement
			});
		});

		return this.beElement;
	}

	/**
	 * Performs the fetch with query params serialization and optional timeout.
	 * @param url - The URL to fetch.
	 * @param init - The fetch init options.
	 * @param options - Optional params/timeout from HttpRequestOptions.
	 * @returns The fetch Response.
	 */
	private request(
		url: string,
		init: RequestInit,
		options?: Pick<HttpRequestOptions, 'params' | 'timeout'>
	): Promise<Response> {
		let finalUrl = url;
		if (options?.params) {
			const qs = new URLSearchParams(options.params).toString();
			if (qs) finalUrl += (finalUrl.includes('?') ? '&' : '?') + qs;
		}

		if (!options?.timeout) {
			return fetch(finalUrl, init);
		}

		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), options.timeout);
		return fetch(finalUrl, { ...init, signal: controller.signal }).finally(() =>
			clearTimeout(timer)
		);
	}
}
