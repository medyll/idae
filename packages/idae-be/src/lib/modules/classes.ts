import { Be } from '../be.js';
import type { CombineElements, CommonHandler, HandlerCallBackFn } from '../types.js';

enum classesMethods {
	add = 'add',
	remove = 'remove',
	toggle = 'toggle',
	replace = 'replace'
}

export type ClassHandlerHandler = {
	add?: string | string[];
	remove?: CombineElements<string> | string[];
	toggle?: CombineElements<string> | string[];
	replace?: `${string} ${string}` | [string, string][];
};

export type ClassHandlerHandlerHandle = {
	add?: CombineElements<string> | string[];
	callback?: HandlerCallBackFn;
} & {
	remove?: CombineElements<string> | string[];
	callback?: HandlerCallBackFn;
} & {
	toggle?: CombineElements<string> | string[];
	callback?: HandlerCallBackFn;
} & {
	replace?: `${string} ${string}` | [string, string][];
	callback?: HandlerCallBackFn;
};

/**
 * Handles class operations for Be elements.
 */
export class ClassesHandler implements CommonHandler<ClassesHandler, ClassHandlerHandlerHandle> {
	private beElement: Be;

	static methods = Object.values(classesMethods);

	constructor(beElement: Be) {
		this.beElement = beElement;
	}
	methods: string[] | keyof ClassesHandler = ClassesHandler.methods;

	valueOf(): string {
		return `[ClassesHandler: methods=${this.methods}]`;
	}

	handle(actions: ClassHandlerHandlerHandle): Be {
		if (!actions) return this.beElement;

		Object.entries(actions).forEach(([method, props]) => {
			switch (method) {
				default:
					(this[method as keyof ClassesHandler] as (props: unknown) => void)(props);
					break;
			}
		});
		return this.beElement;
	}

	/**
	 * Adds one or more classes to the element(s).
	 * @param className - The class or classes to add.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.addClass('highlight'); // Adds a single class
	 * beInstance.addClass(['highlight', 'active']); // Adds multiple classes
	 */
	add(className: string | string[]): Be {
		const classesToAdd = Array.isArray(className) ? className : className.split(' ');

		this.beElement.eachNode((el) =>
			el.classList.add(...classesToAdd.filter((c) => c.trim() !== ''))
		);
		return this.beElement;
	}

	/**
	 * Toggles a class on the element(s).
	 * @param className - The class or classes to toggle.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test" class="highlight"></div>
	 * const beInstance = be('#test');
	 * beInstance.toggleClass('highlight'); // Removes the "highlight" class
	 * beInstance.toggleClass('active'); // Adds the "active" class
	 */
	toggle(className: string | string[]): Be {
		const classesToToggle = Array.isArray(className) ? className : className.split(' ');
		classesToToggle.forEach((className) => {
			this.beElement.eachNode((el) => el.classList.toggle(className));
		});

		return this.beElement;
	}

	/**
	 * Replaces a class on the element(s) with another class.
	 * @param sourceClassName - The class to replace.
	 * @param targetClassName - The class to replace it with.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test" class="old-class"></div>
	 * const beInstance = be('#test');
	 * beInstance.replaceClass('old-class', 'new-class'); // Replaces "old-class" with "new-class"
	 */
	replace(sourceClassName: string, targetClassName: string): Be {
		this.beElement.eachNode((el) => el.classList.replace(sourceClassName, targetClassName));
		return this.beElement;
	}

	/**
	 * Removes one or more classes from the element(s).
	 * @param className - The class or classes to remove.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test" class="highlight active"></div>
	 * const beInstance = be('#test');
	 * beInstance.removeClass('highlight'); // Removes the "highlight" class
	 * beInstance.removeClass(['highlight', 'active']); // Removes multiple classes
	 */
	remove(className: string | string[]): Be {
		const classesToRemove = Array.isArray(className) ? className : className.split(' ');

		this.beElement.eachNode((el) =>
			el.classList.remove(...classesToRemove.filter((c) => c.trim() !== ''))
		);
		return this.beElement;
	}
}
