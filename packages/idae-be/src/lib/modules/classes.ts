import { BeUtils } from '$lib/utils.js';
import { Be } from '../be.js';
import type { CombineElements, CommonHandler } from '../types.js';

enum classesMethods {
	add = 'add',
	remove = 'remove',
	toggle = 'toggle',
	replace = 'replace'
}

export type ClassHandlerHandler = {
	add?: CombineElements<string> | string[];
	remove?: CombineElements<string> | string[];
	toggle?: CombineElements<string> | string[];
	replace?: `${string} ${string}` | [string, string][];
};

/**
 * Handles class operations for Be elements.
 */
export class ClassesHandler implements CommonHandler<ClassesHandler> {
	private beElement: Be;

	static methods = Object.values(classesMethods);

	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	handle(actions: ClassHandlerHandler): Be {
		const { method, props } = BeUtils.resolveIndirection<ClassesHandler>(ClassesHandler, actions);
		switch (method) {
			default:
				this[method](props);
				break;
		}

		this.beElement.eachNode((el) => {
			if (actions.replace) {
				let replacements: [string, string][];
				if (typeof actions.replace === 'string') {
					replacements = actions.replace
						.split(';')
						.map((pair) => pair.trim().split(' ') as [string, string]);
				} else if (Array.isArray(actions.replace) && actions.replace.every(Array.isArray)) {
					replacements = actions.replace as [string, string][];
				} else {
					replacements = [actions.replace.split(' ') as [string, string]];
				}
				replacements.forEach(([oldClass, newClass]) => {
					if (oldClass && newClass) {
						el.classList.replace(oldClass, newClass);
					}
				});
			}
		});
		return this.beElement;
	}

	add(className: string | string[]): Be {
		const classesToAdd = Array.isArray(className) ? className : className.split(' ');

		this.beElement.eachNode((el) =>
			el.classList.add(...classesToAdd.filter((c) => c.trim() !== ''))
		);
		return this.beElement;
	}

	/**
	 * Toggle a class on the element(s).
	 * @param className The class to toggle.
	 * @returns The Be instance for method chaining.
	 */
	toggle(className: string | string[]): Be {
		const classesToToggle = Array.isArray(className) ? className : className.split(' ');
		classesToToggle.forEach((className) => {
			this.beElement.eachNode((el) => el.classList.toggle(className));
		});

		return this.beElement;
	}

	/**
	 * Replace a class on the element(s).
	 * @returns The Be instance for method chaining.
	 */
	replace(sourceClassName: string, targetClassName: string): Be {
		this.beElement.eachNode((el) => el.classList.replace(sourceClassName, targetClassName));
		return this.beElement;
	}

	/**
	 * Remove a class from the element(s).
	 * @param className The class to remove.
	 * @returns The Be instance for method chaining.
	 */
	remove(className: string | string[]): Be {
		const classesToRemove = Array.isArray(className) ? className : className.split(' ');

		this.beElement.eachNode((el) =>
			el.classList.remove(...classesToRemove.filter((c) => c.trim() !== ''))
		);
		return this.beElement;
	}
}
