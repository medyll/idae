import { Be, be } from '../be.js';
import type { HandlerCallbackProps, HandlerCallBackFn, CommonHandler } from '../types.js';
import { BeUtils } from '../utils.js';

enum timersMethods {
	timeout = 'timeout',
	interval = 'interval',
	clearTimeout = 'clearTimeout',
	clearInterval = 'clearInterval'
}
type TimerHandlerHandle = {
	timeout?: number;
	clearTimeout?: boolean;
	interval?: number;
	clearInterval?: boolean;
	callback?: (element: HandlerCallbackProps) => void;
};

export class TimersHandler implements CommonHandler<TimersHandler> {
	private beElement: Be;
	static methods = Object.values(timersMethods);

	_timer: NodeJS.Timeout | null = null;
	_interval: NodeJS.Timeout | null = null;

	constructor(element: Be) {
		this.beElement = element;
	}

	handle(actions: TimerHandlerHandle): Be {
		this.beElement.eachNode((el: HTMLElement) => {
			const { method, props } = BeUtils.resolveIndirection<TimersHandler>(TimersHandler, actions);

			switch (method) {
				case 'timeout':
					el._timer = setTimeout(() => {
						actions?.callback?.({
							method: el._timer,
							fragment: props,
							be: be(el),
							root: this.beElement
						});
					}, props);
					break;
				case 'clearTimeout':
					clearTimeout(el._timer);
					break;
				case 'clearInterval':
					clearInterval(el._interval);
					break;
				case 'interval':
					el._interval = setInterval(() => {
						actions?.callback?.({
							method: el._interval,
							fragment: props,
							be: be(el),
							root: this.beElement
						});
					}, props);
			}
		});

		return this.beElement;
	}

	timeout(value: TimerHandlerHandle['timeout'], callback?: HandlerCallBackFn) {
		return this.handle({ timeout: value, callback });
	}
	interval(value: TimerHandlerHandle['interval'], callback?: HandlerCallBackFn) {
		return this.handle({ interval: value, callback });
	}
	clearTimeout(callback?: HandlerCallBackFn) {
		return this.handle({ clearTimeout: true, callback });
	}
	clearInterval(callback?: HandlerCallBackFn) {
		return this.handle({ clearInterval: true, callback });
	}
}
