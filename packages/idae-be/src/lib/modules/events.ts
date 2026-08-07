import { be, Be } from '../be.js';
import type { CommonHandler, HandlerCallBack, HandlerCallBackFn } from '../types.js';

enum eventsMethods {
	on = 'on',
	off = 'off',
	fire = 'fire'
}

export type EventHandlerMethods = 'on' | 'off';
export type EventHandlerMethodsProps = {
	[key in EventHandlerMethods]: (eventName?: string) => CustomEvent | EventListener | null;
};

export interface EventHandlerHandle {
	on?: { [eventName: string]: CustomEvent | EventListener } & HandlerCallBack;
	off?: { [eventName: string]: CustomEvent | EventListener } & HandlerCallBack;
	fire?: { event: string; detail?: unknown; options?: EventInit } & HandlerCallBack;
}

/**
 * Handles event operations for Be elements.
 */
export class EventsHandler implements CommonHandler<EventsHandler, EventHandlerHandle> {
	private beElement: Be;

	static methods = Object.values(eventsMethods);

	constructor(beElement: Be) {
		this.beElement = beElement;
	}
	methods = EventsHandler.methods;

	/**
	 * Handle event actions (add or remove event listeners).
	 * @param actions An object specifying the event actions to perform.
	 * @returns The Be instance for method chaining.
	 */
	handle(actions: EventHandlerHandle): Be {
		Object.entries(actions).forEach(([method, props]) => {
			const [eventName, handler] = Object.entries(props)[0];
			switch (method) {
				case 'on':
				case 'off':
					this[method](eventName, handler as EventListener, props?.options, props?.callback);
					break;
				case 'fire':
					this.fire(eventName, props?.detail, props?.options, props?.callback);
					break;
			}
		});

		return this.beElement;
	}

	/**
	 * Adds an event listener to the element(s).
	 *
	 * Two forms are supported:
	 * - Direct: `on(eventName, handler, options?, callback?)` — binds on the matched element(s).
	 * - Delegated: `on(eventName, selector, handler, options?, callback?)` — binds one
	 *   listener per matched element, but only invokes `handler` when the event's actual
	 *   target matches a descendant of the bound element that fits `selector`. `handler`
	 *   is invoked with `this` set to the matched descendant (not the bound root).
	 *
	 * @param eventName - The name of the event to listen for.
	 * @param selectorOrHandler - A descendant selector (delegated form) or the event handler.
	 * @param handlerOrOptions - The event handler (delegated form) or listener options.
	 * @param optionsOrCallback - Listener options or the callback function.
	 * @param callback - Optional callback function to execute after adding the event listener.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.on('click', () => console.log('Clicked!')); // Adds a click event listener
	 *
	 * // Delegated: fires only when a '.item' descendant is clicked
	 * beInstance.on('click', '.item', function (e) { console.log(this); });
	 */
	on(
		eventName: string,
		selectorOrHandler: string | EventListener,
		handlerOrOptions?: EventListener | boolean | AddEventListenerOptions,
		optionsOrCallback?: boolean | AddEventListenerOptions | HandlerCallBackFn,
		callback?: HandlerCallBackFn
	) {
		if (typeof selectorOrHandler === 'string') {
			const selector = selectorOrHandler;
			const handler = handlerOrOptions as EventListener;
			let options: boolean | AddEventListenerOptions | undefined;
			if (typeof optionsOrCallback === 'function') {
				callback = optionsOrCallback;
			} else {
				options = optionsOrCallback;
			}

			this.beElement.eachNode((el) => {
				const wrapper: EventListener = (event) => {
					const target = event.target as Element | null;
					const matched = target?.closest?.(selector);
					if (matched && matched !== el && el.contains(matched)) {
						handler.call(matched, event);
					}
				};
				this.trackDelegated(el, eventName, selector, handler, wrapper);
				el.addEventListener(eventName, wrapper, options);
				callback?.({
					fragment: undefined,
					be: be(el),
					root: this.beElement
				});
			});
			return this.beElement;
		}

		const handler = selectorOrHandler;
		let options: boolean | AddEventListenerOptions | undefined;
		if (typeof handlerOrOptions === 'function') {
			// on(eventName, handler, callback)
			callback = handlerOrOptions as unknown as HandlerCallBackFn;
		} else {
			options = handlerOrOptions as boolean | AddEventListenerOptions | undefined;
			if (typeof optionsOrCallback === 'function') {
				callback = optionsOrCallback;
			}
		}

		this.beElement.eachNode((el) => {
			el.addEventListener(eventName, handler, options);
			callback?.({
				fragment: undefined,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	/**
	 * Removes an event listener from the element(s).
	 *
	 * Two forms are supported:
	 * - Direct: `off(eventName, handler, options?, callback?)`
	 * - Delegated: `off(eventName, selector, handler, options?, callback?)` — removes a
	 *   delegated listener previously registered with the same `(eventName, selector, handler)`
	 *   triple.
	 */
	off(
		eventName: string,
		selectorOrHandler: string | EventListener,
		handlerOrOptions?: EventListener | boolean | AddEventListenerOptions,
		optionsOrCallback?: boolean | AddEventListenerOptions | HandlerCallBackFn,
		callback?: HandlerCallBackFn
	) {
		if (typeof selectorOrHandler === 'string') {
			const selector = selectorOrHandler;
			const handler = handlerOrOptions as EventListener;
			let options: boolean | AddEventListenerOptions | undefined;
			if (typeof optionsOrCallback === 'function') {
				callback = optionsOrCallback;
			} else {
				options = optionsOrCallback;
			}

			this.beElement.eachNode((el) => {
				const wrapper = this.delegatedFor(el, eventName, selector, handler);
				if (wrapper) {
					el.removeEventListener(eventName, wrapper, options);
					this.untrackDelegated(el, eventName, selector, handler);
				}
				callback?.({
					fragment: undefined,
					be: be(el),
					root: this.beElement
				});
			});
			return this.beElement;
		}

		const handler = selectorOrHandler;
		let options: boolean | AddEventListenerOptions | undefined;
		if (typeof handlerOrOptions === 'function') {
			callback = handlerOrOptions as unknown as HandlerCallBackFn;
		} else {
			options = handlerOrOptions as boolean | AddEventListenerOptions | undefined;
			if (typeof optionsOrCallback === 'function') {
				callback = optionsOrCallback;
			}
		}

		this.beElement.eachNode((el) => {
			el.removeEventListener(eventName, handler, options);
			callback?.({
				fragment: undefined,
				be: be(el),
				root: this.beElement
			});
		});

		return this.beElement;
	}

	/**
	 * Delegated listeners registry: the actual DOM listener is a wrapper closure,
	 * so we keep a (handler -> wrapper) map per element/event/selector triple
	 * to be able to remove it later.
	 */
	private static delegated = new WeakMap<Element, Map<string, Map<EventListener, EventListener>>>();

	private static delegatedKey(eventName: string, selector: string): string {
		return `${eventName}::${selector}`;
	}

	private trackDelegated(
		el: Element,
		eventName: string,
		selector: string,
		handler: EventListener,
		wrapper: EventListener
	): void {
		let perEl = EventsHandler.delegated.get(el);
		if (!perEl) {
			perEl = new Map();
			EventsHandler.delegated.set(el, perEl);
		}
		const key = EventsHandler.delegatedKey(eventName, selector);
		let perKey = perEl.get(key);
		if (!perKey) {
			perKey = new Map();
			perEl.set(key, perKey);
		}
		perKey.set(handler, wrapper);
	}

	private delegatedFor(
		el: Element,
		eventName: string,
		selector: string,
		handler: EventListener
	): EventListener | undefined {
		return EventsHandler.delegated
			.get(el)
			?.get(EventsHandler.delegatedKey(eventName, selector))
			?.get(handler);
	}

	private untrackDelegated(
		el: Element,
		eventName: string,
		selector: string,
		handler: EventListener
	): void {
		const perEl = EventsHandler.delegated.get(el);
		const key = EventsHandler.delegatedKey(eventName, selector);
		const perKey = perEl?.get(key);
		perKey?.delete(handler);
		if (perKey && perKey.size === 0) perEl?.delete(key);
		if (perEl && perEl.size === 0) EventsHandler.delegated.delete(el);
	}

	/**
	 * Dispatches a custom event on the element(s).
	 * @param eventName - The name of the custom event to dispatch.
	 * @param detail - Optional data to include in the event.
	 * @param options - Optional event initialization options.
	 * @param callback - Optional callback function to execute after dispatching the event.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.fire('customEvent', { key: 'value' }); // Dispatches a custom event with data
	 */
	fire(eventName: string, detail: unknown, options?: EventInit, callback?: HandlerCallBackFn) {
		this.beElement.eachNode((el) => {
			el.dispatchEvent(new CustomEvent(eventName, { ...options, detail }));
			callback?.({
				fragment: undefined,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	valueOf() {
		return this.beElement;
	}
}
