import { Be, be } from '../be.js';
import type { HandlerCallbackProps, HandlerCallBackFn, CommonHandler } from '../types.js';
import { BeUtils } from '../utils.js';

enum textMethods {
	update = 'update',
	append = 'append',
	prepend = 'prepend',
	remove = 'remove',
	wrap = 'wrap',
	normalize = 'normalize',
	replace = 'replace',
	clear = 'clear'
}

export type TextHandlerHandle = {
	update?: string | HTMLElement;
	append?: string | HTMLElement;
	prepend?: string | HTMLElement;
	remove?: boolean;
	replace?: string | HTMLElement;
	wrap?: string | HTMLElement;
	normalize?: boolean;
	clear?: boolean;
	callback?: (element: HandlerCallbackProps) => void;
};

export class TextHandler implements CommonHandler<TextHandler> {
	private beElement: Be;

	static methods = Object.values(textMethods);

	constructor(element: Be) {
		this.beElement = element;
	}
	methods: string[] | keyof TextHandler = TextHandler.methods;

	get text(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.inputNode as HTMLElement).textContent;
	}

	handle(actions: TextHandlerHandle): Be {
		Object.entries(actions).forEach(([method, props]) => {
			if (method in this) {
				(this[method as keyof TextHandler] as (props: unknown) => void)(props);
			}
		});
		return this.beElement;
	}

	/**
	 * Updates the text content of the element(s).
	 * @param content - The new text content to set.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test">Original</div>
	 * const beInstance = be('#test');
	 * beInstance.updateText('Updated'); // Updates the text content to "Updated"
	 */
	update(content: TextHandlerHandle['update'], callback?: HandlerCallBackFn) {
		this.beElement.eachNode((el: HTMLElement) => {
			if (typeof content === 'string') {
				el.innerText = content;
			}
			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	/**
	 * Appends text content to the element(s).
	 * @param content - The text content to append.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test">Original</div>
	 * const beInstance = be('#test');
	 * beInstance.appendText(' Appended'); // Appends " Appended" to the text content
	 */
	append(content: TextHandlerHandle['append'], callback?: HandlerCallBackFn) {
		this.beElement.eachNode((el: HTMLElement) => {
			if (typeof content === 'string') {
				el.insertAdjacentText('beforeend', content);
			}
			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	/**
	 * Prepends text content to the element(s).
	 * @param content - The text content to prepend.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test">Original</div>
	 * const beInstance = be('#test');
	 * beInstance.prependText('Prepended '); // Prepends "Prepended " to the text content
	 */
	prepend(content: TextHandlerHandle['prepend'], callback?: HandlerCallBackFn) {
		this.beElement.eachNode((el: HTMLElement) => {
			if (typeof content === 'string') {
				el.insertAdjacentText('afterbegin', content);
			}
			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	/**
	 * Replaces the text content of the element(s).
	 * @param content - The new text content to replace with.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test">Original</div>
	 * const beInstance = be('#test');
	 * beInstance.replaceText('Replaced'); // Replaces the text content with "Replaced"
	 */
	replace(content: TextHandlerHandle['replace'], callback?: HandlerCallBackFn) {
		this.beElement.eachNode((el: HTMLElement) => {
			if (typeof content === 'string') {
				el.textContent = content;
			}
			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	/**
	 * Removes the element(s) from the DOM.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test">To be removed</div>
	 * const beInstance = be('#test');
	 * beInstance.removeText(); // Removes the element
	 */
	remove(callback?: HandlerCallBackFn) {
		this.beElement.eachNode((el: HTMLElement) => {
			el.remove();
			callback?.({
				fragment: undefined,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	/**
	 * Clears the text content of the element(s).
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test">Content</div>
	 * const beInstance = be('#test');
	 * beInstance.clearText(); // Clears the text content
	 */
	clear(callback?: HandlerCallBackFn) {
		this.beElement.eachNode((el: HTMLElement) => {
			el.innerHTML = '';
			callback?.({
				fragment: undefined,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	/**
	 * Normalizes the text content of the element(s).
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test">Text <span>Fragment</span> Text</div>
	 * const beInstance = be('#test');
	 * beInstance.normalizeText(); // Normalizes the text content
	 */
	normalize(callback?: HandlerCallBackFn) {
		this.beElement.eachNode((el: HTMLElement) => {
			el.normalize();
			callback?.({
				fragment: undefined,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	/**
	 * Wraps the element(s) with a new element.
	 * @param content - The wrapper element as a string or HTMLElement.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test">Content</div>
	 * const beInstance = be('#test');
	 * beInstance.wrapText('<div class="wrapper"></div>'); // Wraps the element with a <div>
	 */
	wrap(content: TextHandlerHandle['wrap'], callback?: HandlerCallBackFn) {
		this.beElement.eachNode((el: HTMLElement) => {
			if (typeof content === 'string') {
				const wrapper = document.createElement('div');
				wrapper.innerHTML = content.trim();
				const parent = wrapper.firstElementChild as HTMLElement;
				if (parent) {
					el.parentNode?.insertBefore(parent, el);
					parent.appendChild(el);
				}
			}
			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	valueOf(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.inputNode as HTMLElement).innerText;
	}
}
