import { Be } from './be.js';

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
	on?: { [eventName: string]: CustomEvent | EventListener };
	off?: { [eventName: string]: CustomEvent | EventListener };
	fire?: { [eventName: string]: CustomEvent | EventListener };
}

/**
 * Handles event operations for Be elements.
 */
export class EventsHandler {
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
		if (actions.on) {
			Object.entries(actions.on).forEach(([eventName, handler]) => {
				this.on(eventName, handler);
			});
		}
		if (actions.off) {
			Object.entries(actions.off).forEach(([eventName, handler]) => {
				this.off(eventName, handler);
			});
		}
		return this.beElement;
	}

	on(eventName: string, handler: EventListener) {
		this.beElement.eachNode((el) => el.addEventListener(eventName, handler));
		return this.beElement;
	}

	off(eventName: string, handler: EventListener) {
		this.beElement.eachNode((el) => el.removeEventListener(eventName, handler));
		return this.beElement;
	}

	fire(eventName: string, data: unknown) {
		this.beElement.eachNode((el) => el.dispatchEvent(new CustomEvent(eventName, { detail: data })));
		return this.beElement;
	}
}
