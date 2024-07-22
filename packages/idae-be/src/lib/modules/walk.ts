/**
 * Handles positioning operations for Be elements.
 */

import { Be } from '../be.js';
import type { DomHandlerHandle } from './dom.js';
import type { CommonHandler, HandlerCallBackFn } from '../types.js';

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

export type WalkerMethodsProps = {
	[key in WalkerMethods]: (qy?: string, callback?: HandlerCallBackFn) => Be;
};

export class WalkHandler implements CommonHandler<WalkHandler> {
	up!: WalkerMethodsProps['up'];
	next!: WalkerMethodsProps['next'];
	previous!: WalkerMethodsProps['previous'];
	siblings!: WalkerMethodsProps['siblings'];
	children!: WalkerMethodsProps['children'];
	closest!: WalkerMethodsProps['closest'];
	lastChild!: WalkerMethodsProps['lastChild'];
	firstChild!: WalkerMethodsProps['firstChild'];

	static methods = Object.values(walkerMethods);

	private beElement: Be;

	constructor(beElement: Be) {
		this.beElement = beElement;
		this.attachRoot();
	}

	attachRoot() {
		WalkHandler.methods.forEach((method) => {
			if (['find', 'findAll'].includes(method)) return;
			this[method] = this.methodize(method);
		});
	}

	handle(actions: DomHandlerHandle) {
		console.log('not implemented', actions);
		return;
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
					ret.push(this.findWhile(el as HTMLElement, method, qy));
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

	private findWhile(
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
