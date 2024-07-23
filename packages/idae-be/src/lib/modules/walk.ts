/**
 * Handles positioning operations for Be elements.
 */

import { Be } from '../be.js';
import type { CommonHandler, HandlerCallBackFn, HandlerCallbackProps } from '../types.js';

export enum walkerMethods {
	up = 'up',
	next = 'next',
	previous = 'previous',
	siblings = 'siblings',
	children = 'children',
	closest = 'closest',
	lastChild = 'lastChild',
	firstChild = 'firstChild',
	find = 'find',
	findAll = 'findAll'
}

export type WalkerMethods = keyof typeof walkerMethods;

export interface WalkHandlerHandle {
	up?: {
		selector: string;
		callback?: (element: HandlerCallbackProps) => void;
	};
	next?: {
		selector: string;
		callback?: (element: HandlerCallbackProps) => void;
	};
	previous?: {
		selector: string;
		callback?: (element: HandlerCallbackProps) => void;
	};
	siblings?: {
		selector: string;
		callback?: (element: HandlerCallbackProps) => void;
	};
	children?: {
		selector: string;
		callback?: (element: HandlerCallbackProps) => void;
	};
	closest?: {
		selector: string;
		callback?: (element: HandlerCallbackProps) => void;
	};
	lastChild?: {
		selector: string;
		callback?: (element: HandlerCallbackProps) => void;
	};
	firstChild?: {
		selector: string;
		callback?: (element: HandlerCallbackProps) => void;
	};
	find?: {
		selector: string;
		callback?: (element: HandlerCallbackProps) => void;
	};
	findAll?: {
		selector: string;
		callback?: (element: HandlerCallbackProps) => void;
	};
}

export interface WalkHandlerInterface {
	up(qy: string, callback?: HandlerCallBackFn): Be;
	up(callback?: HandlerCallBackFn): Be;
	next(qy: string, callback?: HandlerCallBackFn): Be;
	next(callback?: HandlerCallBackFn): Be;
	previous(qy: string, callback?: HandlerCallBackFn): Be;
	previous(callback?: HandlerCallBackFn): Be;
	siblings(qy: string, callback?: HandlerCallBackFn): Be;
	siblings(callback?: HandlerCallBackFn): Be;
	children(qy: string, callback?: HandlerCallBackFn): Be;
	children(callback?: HandlerCallBackFn): Be;
	closest(qy: string, callback?: HandlerCallBackFn): Be;
	closest(callback?: HandlerCallBackFn): Be;
	lastChild(qy: string, callback?: HandlerCallBackFn): Be;
	lastChild(callback?: HandlerCallBackFn): Be;
	firstChild(qy: string, callback?: HandlerCallBackFn): Be;
	firstChild(callback?: HandlerCallBackFn): Be;
}

export class WalkHandler
	implements WalkHandlerInterface, CommonHandler<WalkHandler, WalkHandlerHandle>
{
	static methods = Object.values(walkerMethods);

	private beElement: Be;

	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	handle(actions: WalkHandlerHandle) {
		console.log('not implemented', actions);
		return this.beElement;
	}

	up(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		if (typeof qy === 'function') {
			callback = qy;
			qy = undefined;
		}
		return this.methodize('up')(qy, callback);
	}

	next(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		return this.methodize('next')(qy, callback);
	}
	previous(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		return this.methodize('previous')(qy, callback);
	}
	siblings(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		return this.methodize('siblings')(qy, callback);
	}
	children(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		return this.methodize('children')(qy, callback);
	}
	closest(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		return this.methodize('children')(qy, callback);
	}
	lastChild(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		return this.methodize('children')(qy, callback);
	}
	firstChild(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		return this.methodize('children')(qy, callback);
	}

	find(qy: string, callback?: HandlerCallBackFn): Be | null {
		const ret: HTMLElement[] = [];
		this.beElement.eachNode((el: HTMLElement) => {
			ret.push(el.querySelector(qy) as HTMLElement);
		});
		callback?.({
			root: this.beElement,
			be: Be.elem(ret),
			fragment: 'result',
			requested: Be.elem(ret)
		});

		return this.beElement;
	}

	findAll(qy: string, callback?: HandlerCallBackFn): Be | null {
		const ret: HTMLElement[] = [];
		this.beElement.eachNode((el: HTMLElement) => {
			ret.push(el.querySelectorAll(qy) as HTMLElement[]);
		});
		callback?.({
			root: this.beElement,
			be: Be.elem(ret),
			fragment: 'result',
			requested: Be.elem(ret)
		});

		return this.beElement;
	}

	private methodize(method: WalkerMethods) {
		return (qy?: string, callback?: HandlerCallBackFn) => {
			try {
				const ret: HTMLElement[] = [];
				this.beElement.eachNode((el: HTMLElement) => {
					ret.push(this.selectWhile(el as HTMLElement, method, qy));
				});
				callback?.({
					root: this.beElement,
					be: Be.elem(ret),
					fragment: 'result',
					requested: Be.elem(ret)
				});
			} catch (e) {
				console.log(e);
				console.log(method);
			}

			return this.beElement;
		};
	}

	private selectWhile(
		element: Element,
		direction: WalkerMethods,
		selector: string | undefined
	): HTMLElement | null {
		const dict: Record<string, keyof Element> = {
			up: 'parentNode',
			parent: 'parentNode',
			next: 'nextElementSibling',
			previous: 'previousElementSibling',
			siblings: 'nextElementSibling',
			children: 'children',
			firstChild: 'firstElementChild',
			lastChild: 'lastElementChild',
			closest: 'closest'
		};

		const property = dict[direction] ?? direction;
		let sibling = element[property] as HTMLElement | null;

		if (property === 'closest') {
			return element.closest(selector ?? '*');
		}

		while (sibling) {
			if (!selector || sibling?.matches(selector)) {
				return sibling;
			}
			sibling = sibling[property] as HTMLElement | null;
		}

		return null;
	}
}
