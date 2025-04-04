import { Be } from '../be.js';
import type { CombineElements, CommonHandler, HandlerCallBackFn } from '../types.js';

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
