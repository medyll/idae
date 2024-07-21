/**
 * Handles positioning operations for Be elements.
 */

import { Be } from './be.js';
import type { DomHandlerHandle } from './dom.js';
import type { HandlerCallBack } from './types.js';

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
	[key in WalkerMethods]: (qy?: string, callback?: HandlerCallBack) => Be;
};

export interface IdaeWalkHandlerInterface {
	up: WalkerMethodsProps['up'];
	next: WalkerMethodsProps['next'];
	previous: WalkerMethodsProps['previous'];
	siblings: WalkerMethodsProps['siblings'];
	children: WalkerMethodsProps['children'];
	closest: WalkerMethodsProps['closest'];
	lastChild: WalkerMethodsProps['lastChild'];
	firstChild: WalkerMethodsProps['firstChild'];
	find: WalkerMethodsProps['find'];
	findAll: WalkerMethodsProps['findAll'];
}

export class WalkHandler implements IdaeWalkHandlerInterface {
	static methods: WalkerMethods[] = [
		'up',
		'next',
		'previous',
		'siblings',
		'children',
		'closest',
		'firstChild',
		'lastChild',
		'find',
		'findAll'
	];

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
		console.log('not implemented');
		return;
	}

	find(qy: string, callback?: HandlerCallBack): Be | null {
		switch (this.isWhat) {
			case 'element':
				return (this.node as HTMLElement).querySelector(qy);
			case 'array':
				return (this.node as HTMLElement[])
					.map((node) => node.querySelector(qy))
					.filter((el) => el !== null);
			case 'qy': {
				const foundElement = document.querySelector(this.node as string);
				return foundElement ? foundElement.querySelector(qy) : null;
			}
			default:
				return null;
		}
	}

	findAll(qy: string): Be | null {
		switch (this.isWhat) {
			case 'element':
				return Array.from((this.node as HTMLElement).querySelectorAll(qy));
			case 'array':
				return (this.node as HTMLElement[]).flatMap((node) =>
					Array.from(node.querySelectorAll(qy))
				);
			case 'qy':
				return Array.from(document.querySelectorAll(this.node as string)).flatMap((node) =>
					Array.from(node.querySelectorAll(qy))
				);
			default:
				return [];
		}
	}

	private methodize(method: WalkerMethods) {
		return (qy?: string, callback?: HandlerCallBack) => {
			try {
				let result: HTMLElement | HTMLElement[] | null = null;
				switch (this.beElement.isWhat) {
					case 'element':
						result = this.findWhile(this.beElement.node as HTMLElement, method, qy);
						break;
					case 'array':
						result = (this.beElement.node as HTMLElement[]).map((node) =>
							this.findWhile(node, method, qy)
						);
						break;
					case 'qy':
						result = Array.from(document.querySelectorAll(this.beElement.node as string)).map(
							(node) => this.findWhile(node, method, qy)
						);
						break;
				}

				callback?.({
					root: this.beElement,
					be: Be.elem(result),
					fragment: 'result',
					requested: Be.elem(result)
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
