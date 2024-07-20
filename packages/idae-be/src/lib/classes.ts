import { Be } from './be.js';
import type { CombineElements } from './types.js';
import { BeUtils } from './utils.js';

export type ClassHandlerHandler = {
	add?: CombineElements<string> | string[];
	remove?: CombineElements<string> | string[];
	toggle?: CombineElements<string> | string[];
	replace?: `${string} ${string}` | [string, string][];
};

/**
 * Handles class operations for Be elements.
 */
export class ClassesHandler {
	private beElement: Be;

	static methods = ['add', 'remove', 'toggle', 'replace'];

	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	/**
	 * Manipulate classes on the element(s).
	 * @param actions An object specifying the classes to add, remove, toggle, or replace.
	 * @param actions.add - Classes to add. Can be a space-separated string or an array of strings.
	 * @param actions.remove - Classes to remove. Can be a space-separated string or an array of strings.
	 * @param actions.toggle - Classes to toggle. Can be a space-separated string or an array of strings.
	 * @param actions.replace - Classes to replace. Can be a string in the format "oldClass newClass" or an array of [oldClass, newClass] pairs.
	 * @returns The Be instance for method chaining.
	 */
	handle(actions: ClassHandlerHandler): Be {
		this.beElement.eachNode((el) => {
			if (actions.add) {
				const classesToAdd = Array.isArray(actions.add) ? actions.add : actions.add.split(' ');
				el.classList.add(...classesToAdd.filter((c) => c.trim() !== ''));
			}
			if (actions.remove) {
				const classesToRemove = Array.isArray(actions.remove)
					? actions.remove
					: actions.remove.split(' ');
				el.classList.remove(...classesToRemove.filter((c) => c.trim() !== ''));
			}
			if (actions.toggle) {
				const classesToToggle = Array.isArray(actions.toggle)
					? actions.toggle
					: actions.toggle.split(' ');
				classesToToggle.forEach((className) => {
					el.classList.toggle(className);
				});
			}
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

	add(className: string): Be {
		this.beElement.eachNode((el) => el.classList.add(className));
		return this.beElement;
	}

	/**
	 * Toggle a class on the element(s).
	 * @param className The class to toggle.
	 * @returns The Be instance for method chaining.
	 */
	toggle(className: string): Be {
		this.beElement.eachNode((el) => el.classList.toggle(className));
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
	remove(className: string): Be {
		this.beElement.eachNode((el) => el.classList.remove(className));
		return this.beElement;
	}
}
