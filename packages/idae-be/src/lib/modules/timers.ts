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

type TimerHandlerHandle = cd & cds;

export class TimersHandler implements CommonHandler<TimersHandler> {
	private beElement: Be;
	static methods = Object.values(timersMethods);

	_timer: NodeJS.Timeout | null = null;
	_interval: NodeJS.Timeout | null = null;

	constructor(element: Be) {
		this.beElement = element;
	}
	methods: string[] | keyof TimersHandler = TimersHandler.methods;

	valueOf(): unknown {
		return {
			methods: this.methods,
			timer: this._timer,
			interval: this._interval
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

	timeout(value: TimerHandlerHandle['timeout'], callback?: HandlerCallBackFn): Be {
		this.beElement.BeTimer = setTimeout(() => {
			callback?.({
				method: 'timeout',
				fragment: this.beElement.BeTimer,
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
	interval(value: TimerHandlerHandle['interval'], callback?: HandlerCallBackFn): Be {
		this.beElement.BeInterval = setInterval(() => {
			callback?.({
				method: 'interval',
				fragment: this.beElement.BeInterval,
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
	clearTimeout(callback?: HandlerCallBackFn): Be {
		clearTimeout(this.beElement?.BeTimer);
		this.beElement.BeTimer = null;
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
	clearInterval(callback?: HandlerCallBackFn): Be {
		clearInterval(this.beElement?.BeInterval);
		this.beElement.BeInterval = null;
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
