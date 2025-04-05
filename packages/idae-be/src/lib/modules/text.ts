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
		this.beElement.eachNode((el: HTMLElement) => {
			const { method, props } = BeUtils.resolveIndirection<TextHandler>(
				new TextHandler(this.beElement),
				actions as unknown as keyof TextHandler
			);

			switch (method) {
				case 'update':
					if (typeof props === 'string') {
						el.innerText = props;
					}
					break;
				case 'prepend':
					if (typeof props === 'string') {
						el.insertAdjacentText('afterbegin', props);
					} else {
						throw new Error('Invalid props for prepend: must be a string.');
					}
					break;
				case 'append':
					if (typeof props === 'string') {
						el.insertAdjacentText('beforeend', props);
					} else {
						throw new Error('Invalid props for append: must be a string.');
					}
					break;
				case 'replace':
					if (typeof props === 'string') {
						el.textContent = props;
					} else {
						throw new Error('Invalid props for replace: must be a string.');
					}
					break;
				case 'remove':
					el.remove();
					break;
				case 'clear':
					el.innerHTML = '';
					break;
				case 'normalize':
					el.normalize();
					break;
				case 'wrap':
					if (typeof props === 'string') {
						const wrapper = document.createElement('div');
						wrapper.innerHTML = props.trim();
						const parent = wrapper.firstElementChild as HTMLElement;
						if (parent) {
							el.parentNode?.insertBefore(parent, el);
							parent.appendChild(el);
						}
					}
					break;
			}

			actions?.callback?.({
				fragment: props,
				be: be(el),
				root: this.beElement
			});
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
		return this.handle({ update: content, callback });
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
		return this.handle({ append: content, callback });
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
		return this.handle({ prepend: content, callback });
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
		return this.handle({ replace: content, callback });
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
		return this.handle({ remove: undefined, callback });
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
		return this.handle({ clear: undefined, callback });
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
		return this.handle({ normalize: undefined, callback });
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
		return this.handle({ wrap: content, callback });
	}

	valueOf(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.inputNode as HTMLElement).innerText;
	}
}
