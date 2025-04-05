import { Be, be } from '../be.js';
import type { HandlerCallBackFn, CommonHandler, HandlerCallBack } from '../types.js';

enum timersMethods {
	timeout = 'timeout',
	interval = 'interval',
	clearTimeout = 'clearTimeout',
	clearInterval = 'clearInterval'
}

type cd = Record<'timeout' | 'interval', number> & HandlerCallBack;
type cds = Record<'clearTimeout' | 'clearInterval', HandlerCallBackFn>;

export type TimerHandlerHandle = cd & cds;

export class TimersHandler implements CommonHandler<TimersHandler> {
	private beElement: Be;
	static methods = Object.values(timersMethods);

	#timer: NodeJS.Timeout | null = null;
	#interval: NodeJS.Timeout | null = null;

	constructor(element: Be) {
		this.beElement = element;
	}
	methods: string[] | keyof TimersHandler = TimersHandler.methods;

	valueOf(): unknown {
		return {
			methods: this.methods,
			timer: this.#timer,
			interval: this.#interval
		};
	}

	handle(actions: TimerHandlerHandle): Be {
		if (!actions) return this.beElement;
		Object.entries(actions).forEach(([method, props]) => {
			switch (method) {
				case 'timeout':
				case 'interval':
					this[method](props as number, actions.callback);
					break;
				case 'clearTimeout':
				case 'clearInterval':
					this[method](actions.callback);
					break;
			}
		});

		return this.beElement;
	}

	/**
	 * Sets a timeout for the element(s).
	 * @param value - The timeout duration in milliseconds.
	 * @param callback - The callback function to execute after the timeout.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.timeout(1000, () => console.log('Timeout executed')); // Sets a 1-second timeout
	 */
	timeout(value: TimerHandlerHandle['timeout'], callback?: HandlerCallBackFn): Be {
		this.beElement.timerOut = setTimeout(() => {
			callback?.({
				method: 'timeout',
				fragment: this.beElement.timerOut,
				be: this.beElement,
				root: this.beElement
			});
		}, value);
		/* this.beElement.eachNode((el: HTMLElement) => {
			const aug = be(el);
			aug.BeTimer = setTimeout(() => {
				callback?.({
					method: 'timeout',
					fragment: aug.BeTimer,
					be: be(el),
					root: this.beElement
				});
			}, value);
		}); */

		return this.beElement;
	}

	/**
	 * Sets an interval for the element(s).
	 * @param value - The interval duration in milliseconds.
	 * @param callback - The callback function to execute at each interval.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.interval(500, () => console.log('Interval executed')); // Sets a 500ms interval
	 */
	interval(value: TimerHandlerHandle['interval'], callback?: HandlerCallBackFn): Be {
		this.beElement.timerInterval = setInterval(() => {
			callback?.({
				method: 'interval',
				fragment: this.beElement.timerInterval,
				be: this.beElement,
				root: this.beElement
			});
		}, value);
		/* this.beElement.eachNode((el: HTMLElement) => {
			const aug = be(el);
			aug.BeInterval = setInterval(() => {
				callback?.({
					method: 'interval',
					fragment: aug.BeInterval,
					be: be(el),
					root: this.beElement
				});
			}, value);
		}); */

		return this.beElement;
	}

	/**
	 * Clears the timeout for the element(s).
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.timeout(1000, () => console.log('Timeout executed'));
	 * beInstance.clearTimeout(); // Clears the timeout
	 */
	clearTimeout(callback?: HandlerCallBackFn): Be {
		if (this.beElement.timerOut) clearTimeout(this.beElement.timerOut);
		this.beElement.timerOut = null;
		/* this.beElement.eachNode((el: HTMLElement) => {
			const aug = be(el);
			if (aug.BeTimer !== null) {
				clearTimeout(aug.BeTimer);
				aug.BeTimer = null;
			}
		}); */
		callback?.({
			method: 'clearTimeout',
			fragment: null,
			be: this.beElement,
			root: this.beElement
		});
		return this.beElement;
	}

	/**
	 * Clears the interval for the element(s).
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.interval(500, () => console.log('Interval executed'));
	 * beInstance.clearInterval(); // Clears the interval
	 */
	clearInterval(callback?: HandlerCallBackFn): Be {
		if (this.beElement.timerInterval) clearInterval(this.beElement.timerInterval);
		this.beElement.timerInterval = null;
		/* this.beElement.eachNode((el: HTMLElement) => {
			const aug = be(el);
			if (aug.BeInterval !== null) {
				clearInterval(aug.BeInterval);
				aug.BeInterval = null;
			}
		}); */
		callback?.({
			method: 'clearInterval',
			fragment: null,
			be: this.beElement,
			root: this.beElement
		});
		return this.beElement;
	}
}
