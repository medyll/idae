/**
 * Handles positioning operations for Be elements.
 */

import { Be } from './be.js';
import type { DomHandlerHandle } from './dom.js';
import type { HandlerCallBack } from './types.js';
import { BeUtils } from './utils.js';

export type WalkerMethods =
	| 'up'
	| 'next'
	| 'previous'
	| 'siblings'
	| 'children'
	| 'closest'
	| 'lastChild'
	| 'firstChild'
	| 'find'
	| 'findAll';

export type WalkerMethodsProps = {
	[key in WalkerMethods]: (qy?: string) => Be;
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
	up!: WalkerMethodsProps['up'];
	next!: WalkerMethodsProps['next'];
	previous!: WalkerMethodsProps['previous'];
	siblings!: WalkerMethodsProps['siblings'];
	children!: WalkerMethodsProps['children'];
	closest!: WalkerMethodsProps['closest'];
	lastChild!: WalkerMethodsProps['lastChild'];
	firstChild!: WalkerMethodsProps['firstChild'];

	static methods: WalkerMethods[] = [
		'up',
		'next',
		'previous',
		'siblings',
		'children',
		'closest',
		'lastChild',
		'firstChild',
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
			this[method] = this.methodize(method);
		});
	}

	attach(thatBe: Be, instance: WalkHandler, suffix: string = '') {
		BeUtils.attach<WalkHandler>(thatBe, instance, suffix);
	}

	handle(actions: DomHandlerHandle) {
		console.log('not implemented');
		return;
	}

	find(qy: string): Be | null {
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
			return Be.elem(result);
		};
	}

	private findWhile(
		element: Element,
		direction: WalkerMethods,
		selector?: string
	): HTMLElement | null {
		const dict: Record<string, keyof Element> = {
			up: 'parentNode',
			parent: 'parentNode',
			next: 'nextElementSibling',
			previous: 'previousElementSibling',
			siblings: 'nextElementSibling',
			children: 'children'
		};

		const property = dict[direction] ?? direction;
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
