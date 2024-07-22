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
export class EventsHandler implements CommonHandler<EventsHandler> {
	private beElement: Be;

	static methods = Object.values(eventsMethods);

	constructor(beElement: Be) {
		this.beElement = beElement;
	}

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

	on(
		eventName: string,
		handler: EventListener,
		options?: boolean | AddEventListenerOptions,
		callback?: HandlerCallBackFn
	) {
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

	off(
		eventName: string,
		handler: EventListener,
		options?: boolean | AddEventListenerOptions,
		callback?: HandlerCallBackFn
	) {
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
}
