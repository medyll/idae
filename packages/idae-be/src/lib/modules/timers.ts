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
		this.beElement.eachNode((el: HTMLElement) => {
			const aug = be(el);
			aug.BeTimer = setTimeout(() => {
				callback?.({
					method: 'timeout',
					fragment: aug.BeTimer,
					be: be(el),
					root: this.beElement
				});
			}, value);
		});

		return this.beElement;
	}
	interval(value: TimerHandlerHandle['interval'], callback?: HandlerCallBackFn) {
		this.beElement.eachNode((el: HTMLElement) => {
			const aug = be(el);
			aug.BeTimer = setInterval(() => {
				callback?.({
					method: 'interval',
					fragment: aug.BeTimer,
					be: be(el),
					root: this.beElement
				});
			}, value);
		});

		return this.beElement;
	}
	clearTimeout(callback?: HandlerCallBackFn) {
		this.beElement.eachNode((el: HTMLElement) => {
			clearTimeout(be(el).BeTimer);
			callback?.({
				method: 'clearTimeout',
				fragment: be(el).BeTimer,
				be: be(el),
				root: this.beElement
			});
		});
	}
	clearInterval(callback?: HandlerCallBackFn) {
		this.beElement.eachNode((el: HTMLElement) => {
			clearInterval(be(el).BeTimer);
			callback?.({
				method: 'clearInterval',
				fragment: be(el).BeTimer,
				be: be(el),
				root: this.beElement
			});
		});
	}
}
