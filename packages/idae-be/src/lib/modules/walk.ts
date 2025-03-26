import { Be } from '../be.js';
import type { CommonHandler, HandlerCallBackFn, HandlerCallbackProps } from '../types.js';

/**
 * Enum representing the available walker methods.
 */
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
	findAll = 'findAll',
	without = 'without'
}

export type WalkerMethods = keyof typeof walkerMethods;

/**
 * Interface defining the structure for walk handler actions.
 */
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
	without?: {
		selector: string;
		callback?: (element: HandlerCallbackProps) => void;
	};
}

/**
 * Interface defining the methods available in the WalkHandler.
 */
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
	find(qy: string, callback?: HandlerCallBackFn): Be | null;
	findAll(qy: string, callback?: HandlerCallBackFn): Be | null;
	without(qy: string, callback?: HandlerCallBackFn): Be;
}

/**
 * Handles DOM traversal operations for Be elements.
 */
export class WalkHandler
	implements WalkHandlerInterface, CommonHandler<WalkHandler, WalkHandlerHandle>
{
	static methods = Object.values(walkerMethods);

	private beElement: Be;

	/**
	 * Creates an instance of WalkHandler.
	 * @param beElement - The Be element to operate on.
	 */
	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	/**
	 * Handles multiple walk operations.
	 * @param actions - The actions to perform.
	 * @returns The Be instance for method chaining.
	 */
	handle(actions: WalkHandlerHandle) {
		console.log('not implemented', actions);
		return this.beElement;
	}

	/**
	 * Traverses up the DOM tree.
	 * @param qy - Optional selector or callback function.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 */
	up(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		if (typeof qy === 'function') {
			callback = qy;
			qy = undefined;
		}
		return this.methodize('up')(qy, callback);
	}

	/**
	 * Traverses to the next sibling element.
	 * @param qy - Optional selector or callback function.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 */
	next(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		if (typeof qy === 'function') {
			callback = qy;
			qy = undefined;
		}
		return this.methodize('next')(qy, callback);
	}

	/**
	 * Traverses to the previous sibling element.
	 * @param qy - Optional selector or callback function.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 */
	previous(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		if (typeof qy === 'function') {
			callback = qy;
			qy = undefined;
		}
		return this.methodize('previous')(qy, callback);
	}

	/**
	 * Filters out elements that match the given selector.
	 * @param qy - The selector to match elements against for removal.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 */
	without(qy: string, callback?: HandlerCallBackFn): Be {
		const ret: HTMLElement[] = [];

		this.beElement.eachNode((el: HTMLElement) => {
			if (!el.matches(qy)) {
				ret.push(el);
			}
		});

		const resultBe = Be.elem(ret);

		callback?.({
			root: this.beElement,
			be: resultBe,
			fragment: 'result',
			requested: resultBe
		});

		return this.beElement;
	}

	/**
	 * Gets all sibling elements.
	 * @param qy - Optional selector or callback function.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 */
	siblings(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		if (typeof qy === 'function') {
			callback = qy;
			qy = undefined;
		}

		const ret: HTMLElement[] = [];
		this.beElement.eachNode((el: HTMLElement) => {
			if (el.parentNode) {
				const siblings = Array.from(el.parentNode.children).filter((child) => child !== el);
				ret.push(...siblings.filter((sibling) => !qy || sibling.matches(qy)));
			}
		});

		callback?.({
			root: this.beElement,
			be: Be.elem(ret),
			fragment: 'result',
			requested: Be.elem(ret)
		});

		return this.beElement;
	}

	/**
	 * Gets all child elements.
	 * @param qy - Optional selector or callback function.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 */
	children(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		if (typeof qy === 'function') {
			callback = qy;
			qy = undefined;
		}
		return this.methodize('children')(qy, callback);
	}

	/**
	 * Finds the closest ancestor that matches the selector.
	 * @param qy - Optional selector or callback function.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 */
	closest(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		if (typeof qy === 'function') {
			callback = qy;
			qy = undefined;
		}
		return this.methodize('closest')(qy, callback);
	}

	/**
	 * Gets the last child element.
	 * @param qy - Optional selector or callback function.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 */
	lastChild(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		if (typeof qy === 'function') {
			callback = qy;
			qy = undefined;
		}
		return this.methodize('lastChild')(qy, callback);
	}

	/**
	 * Gets the first child element.
	 * @param qy - Optional selector or callback function.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 */
	firstChild(qy?: string | HandlerCallBackFn, callback?: HandlerCallBackFn) {
		if (typeof qy === 'function') {
			callback = qy;
			qy = undefined;
		}
		return this.methodize('firstChild')(qy, callback);
	}

	/**
	 * Finds the first descendant that matches the selector.
	 * @param qy - The selector to match against.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 */
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

	/**
	 * Finds all descendants that match the selector.
	 * @param qy - The selector to match against.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 */
	findAll(qy: string, callback?: HandlerCallBackFn): Be | null {
		const ret: HTMLElement[] = [];
		this.beElement.eachNode((el: HTMLElement) => {
			ret.push(...Array.from(el.querySelectorAll(qy)));
		});
		callback?.({
			root: this.beElement,
			be: Be.elem(ret),
			fragment: 'result',
			requested: Be.elem(ret)
		});

		return this.beElement;
	}

	/**
	 * Helper method to create a function for each walk method.
	 * @param method - The walk method to create a function for.
	 * @returns A function that performs the specified walk method.
	 */
	private methodize(method: WalkerMethods) {
		return (qy?: string, callback?: HandlerCallBackFn) => {
			try {
				const ret: HTMLElement[] = [];
				this.beElement.eachNode((el: HTMLElement) => {
					const results = this.selectWhile(el as HTMLElement, method, qy);
					ret.push(...results);
				});
				callback?.({
					root: this.beElement,
					be: Be.elem(ret),
					fragment: 'result',
					requested: Be.elem(ret)
				});
			} catch (e) {
				console.log(e);
			}

			return this.beElement;
		};
	}

	/**
	 * Helper method to select elements based on the specified method and selector.
	 * @param element - The starting element.
	 * @param direction - The direction to traverse.
	 * @param selector - Optional selector to filter elements.
	 * @returns The selected HTMLElement or null if not found.
	 */
	private selectWhile(
		element: Element,
		direction: WalkerMethods,
		selector: string | undefined
	): HTMLElement | HTMLElement[] | null {
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

		if (property === 'children') {
			const children = Array.from(element.children) as HTMLElement[];

			return selector ? children.filter((child) => child.matches(selector)) : children;
		}

		if (property === 'closest') {
			return element.closest(selector ?? '*');
		}

		let sibling = element[property] as HTMLElement | null;

		while (sibling) {
			if (!selector || sibling.matches(selector)) {
				return sibling;
			}
			sibling = sibling[property] as HTMLElement | null;
		}

		return null;
	}
}
