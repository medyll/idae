import { Be, be } from '../be.js';
import type { HandlerCallbackProps, HandlerCallBackFn, CommonHandler } from '../types.js';

enum domMethods {
	update = 'update',
	append = 'append',
	prepend = 'prepend',
	insert = 'insert',
	afterBegin = 'afterBegin',
	afterEnd = 'afterEnd',
	beforeBegin = 'beforeBegin',
	beforeEnd = 'beforeEnd',
	remove = 'remove',
	wrap = 'wrap',
	normalize = 'normalize',
	replace = 'replace',
	clear = 'clear'
}

type Content = string | HTMLElement | Be;
export interface DomHandlerHandle {
	insert?: {
		content: string | HTMLElement | Be;
		mode: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend';
		callback?: (element: HandlerCallbackProps) => void;
	};

	update?: {
		content: Content;
		callback?: (element: HandlerCallbackProps) => void;
	};

	append?: {
		content: Content;
		callback?: (element: HandlerCallbackProps) => void;
	};
	prepend?: {
		content: Content;
		callback?: (element: HandlerCallbackProps) => void;
	};
	afterbegin?: {
		content: Content;
		callback?: (element: HandlerCallbackProps) => void;
	};
	afterend?: {
		content: Content;
		callback?: (element: HandlerCallbackProps) => void;
	};
	beforebegin?: {
		content: Content;
		callback?: (element: HandlerCallbackProps) => void;
	};
	beforeend?: {
		content: Content;
		callback?: (element: HandlerCallbackProps) => void;
	};
	remove?: true;
	replace?: {
		content: Content;
		callback?: (element: HandlerCallbackProps) => void;
	};
	wrap?: {
		tag: string;
		callback?: (element: HandlerCallbackProps) => void;
	};
	normalize?: true;
	clear?: true;
	callback?: (element: HandlerCallbackProps) => void;
}
export interface DomHandlerInterface {
	insert(
		mode: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend',
		element: HTMLElement | Be,
		callback?: HandlerCallBackFn
	): Be;
}

/**
 * Handles DOM manipulation operations for Be elements.
 */
export class DomHandler
	implements DomHandlerInterface, CommonHandler<DomHandler, DomHandlerHandle>
{
	private beElement: Be;

	static methods = Object.values(domMethods);

	constructor(element: Be) {
		this.beElement = element;
	}
	methods: string[] | keyof DomHandler = DomHandler.methods;

	/**
	 * Handles various DOM operations on the element(s).
	 * @param actions An object specifying the DOM actions to perform.
	 * @param actions.update - HTML content to update the element(s) with.
	 * @param actions.append - Content to append to the element(s).
	 * @param actions.prepend - Content to prepend to the element(s).
	 * @param actions.remove - If true, removes the element(s) from the DOM.
	 * @param actions.replace - Content to replace the element(s) with.
	 * @param actions.clear - If true, clears the content of the element(s).
	 * @returns The Be instance for method chaining.
	 */
	handle(actions: DomHandlerHandle): Be {
		Object.entries(actions).forEach(([method, props]) => {
			switch (method) {
				case 'update':
					this.update(props.content, props.callback);
					break;
				case 'append':
					this.append(props.content, props.callback);
					break;
				case 'prepend':
					this.prepend(props.content, props.callback);
					break;
				case 'replace':
					this.replace(props.content, props.callback);
					break;
				case 'remove':
					this.remove(props.callback);
					break;
				case 'clear':
					this.clear(props.callback);
					break;
				case 'normalize':
					this.normalize(props.callback);
					break;
				case 'wrap':
					this.wrap(props.tag, props.callback);
					break;
			}
		});

		return this.beElement;
	}

	/**
	 * Updates the content of the element(s).
	 * @param content - The new content to set.
	 * @param callback - Optional callback function.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.update('<p>Updated content</p>'); // Updates the content of the element
	 */
	update(content: string, callback?: HandlerCallBackFn): Be {
		this.beElement.eachNode((el: HTMLElement) => {
			if (el) {
				el.innerHTML = content;
				callback?.({
					fragment: content,
					be: be(el),
					root: this.beElement
				});
			}
		});

		return this.beElement;
	}

	/**
	 * Appends content to the element(s).
	 * @param content - The content to append (string, HTMLElement, or Be instance).
	 * @param callback - Optional callback function to execute after appending.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.append('<span>Appended</span>'); // Appends content to the element
	 */
	append(content: Content, callback?: HandlerCallBackFn): Be {
		const ret: HTMLElement[] = [];
		this.beElement.eachNode((el: HTMLElement) => {
			const normalizedContent = this.normalizeContent(content);
			if (normalizedContent instanceof DocumentFragment) {
				el.appendChild(normalizedContent);
			} else {
				ret.push(normalizedContent);
				el.appendChild(normalizedContent);
			}
		});
		callback?.({
			fragment: content,
			be: be(ret),
			root: this.beElement
		});
		return this.beElement;
	}

	/**
	 * Prepends content to the element(s).
	 * @param content - The content to prepend (string, HTMLElement, or Be instance).
	 * @param callback - Optional callback function to execute after prepending.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.prepend('<span>Prepended</span>'); // Prepends content to the element
	 */
	prepend(content: Content, callback?: HandlerCallBackFn): Be {
		const ret: HTMLElement[] = [];
		this.beElement.eachNode((el: HTMLElement) => {
			const normalizedContent = this.normalizeContent(content);
			if (normalizedContent instanceof DocumentFragment) {
				el.insertBefore(normalizedContent, el.firstChild);
			} else {
				ret.push(normalizedContent);
				el.insertBefore(normalizedContent, el.firstChild);
			}
		});
		callback?.({
			fragment: content,
			be: be(ret),
			root: this.beElement
		});
		return this.beElement;
	}

	/**
	 * Inserts content into the element(s) at a specified position.
	 * @param mode - The position to insert the content ('afterbegin', 'afterend', 'beforebegin', 'beforeend').
	 * @param element - The content to insert (string, HTMLElement, or Be instance).
	 * @param callback - Optional callback function to execute after insertion.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.insert('afterbegin', '<span>Inserted</span>'); // Inserts content at the beginning
	 */
	insert(
		mode: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend',
		element: HTMLElement | Be | string,
		callback?: HandlerCallBackFn
	): Be {
		switch (mode) {
			case 'afterbegin':
				return this.afterBegin(element, callback);
			case 'afterend':
				return this.afterEnd(element, callback);
			case 'beforebegin':
				return this.beforeBegin(element, callback);
			case 'beforeend':
				return this.beforeEnd(element, callback);
			default:
				throw new Error(`Invalid mode: ${mode}`);
		}
	}

	/**
	 * Inserts content at the beginning of the element(s).
	 * @param content - The content to insert (string, HTMLElement, or Be instance).
	 * @param callback - Optional callback function to execute after insertion.
	 * @returns The Be instance for method chaining.
	 */
	afterBegin(content: Content, callback?: HandlerCallBackFn): Be {
		this.beElement.eachNode((el: HTMLElement) => {
			this.adjacentElement(el, content, 'afterbegin');
			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	/**
	 * Inserts content after the element(s).
	 * @param content - The content to insert (string, HTMLElement, or Be instance).
	 * @param callback - Optional callback function to execute after insertion.
	 * @returns The Be instance for method chaining.
	 */
	afterEnd(content: Content, callback?: HandlerCallBackFn): Be {
		this.beElement.eachNode((el: HTMLElement) => {
			// Insérer après l'élément cible
			el.parentNode?.insertBefore(this.normalizeContent(content), el.nextSibling);
			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	/**
	 * Inserts content before the element(s).
	 * @param content - The content to insert (string, HTMLElement, or Be instance).
	 * @param callback - Optional callback function to execute after insertion.
	 * @returns The Be instance for method chaining.
	 */
	beforeBegin(content: Content, callback?: HandlerCallBackFn): Be {
		this.beElement.eachNode((el: HTMLElement) => {
			// Insérer avant l'élément cible
			el.parentNode?.insertBefore(this.normalizeContent(content), el);
			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	/**
	 * Inserts content at the end of the element(s).
	 * @param content - The content to insert (string, HTMLElement, or Be instance).
	 * @param callback - Optional callback function to execute after insertion.
	 * @returns The Be instance for method chaining.
	 */
	beforeEnd(content: Content, callback?: HandlerCallBackFn): Be {
		this.beElement.eachNode((el: HTMLElement) => {
			// Insérer à la fin de l'élément cible
			el.appendChild(this.normalizeContent(content));
			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	/**
	 * Replaces the element(s) with new content.
	 * @param content - The content to replace the element(s) with (string, HTMLElement, or Be instance).
	 * @param callback - Optional callback function to execute after replacement.
	 * @returns The Be instance for method chaining.
	 */
	replace(content: Content, callback?: HandlerCallBackFn): Be {
		const ret: HTMLElement[] = [];
		this.beElement.eachNode((el: HTMLElement) => {
			const normalizedContent = this.normalizeContent(content);
			if (normalizedContent instanceof DocumentFragment) {
				el.replaceWith(...normalizedContent.childNodes);
			} else {
				ret.push(normalizedContent);
				el.replaceWith(normalizedContent);
			}
		});
		callback?.({
			fragment: content,
			be: be(ret),
			root: this.beElement
		});
		return this.beElement;
	}

	/**
	 * Removes the element(s) from the DOM.
	 * @param callback - Optional callback function to execute after removal.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"><span>To be removed</span></div>
	 * const beInstance = be('#test span');
	 * beInstance.remove(); // Removes the span element
	 */
	remove(callback?: HandlerCallBackFn): Be {
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
	 * Clears the content of the element(s).
	 * @param callback - Optional callback function to execute after clearing.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"><span>Content</span></div>
	 * const beInstance = be('#test');
	 * beInstance.clear(); // Clears the content of the div
	 */
	clear(callback?: HandlerCallBackFn): Be {
		this.beElement.eachNode((el: HTMLElement) => {
			const fragment = el.innerHTML;
			el.innerHTML = '';
			callback?.({
				fragment,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	/**
	 * Normalizes the content of the element(s).
	 * @param callback - Optional callback function to execute after normalization.
	 * @returns The Be instance for method chaining.
	 */
	normalize(callback?: HandlerCallBackFn): Be {
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
	 * @param tag - The tag name of the wrapper element (default is 'div').
	 * @param callback - Optional callback function to execute after wrapping.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.wrap('section'); // Wraps the div with a <section> element
	 */
	wrap(tag: string = 'div', callback?: HandlerCallBackFn): Be {
		// wrap in tag
		this.beElement.eachNode((el: HTMLElement) => {
			const wrapper = document.createElement(tag);

			el.insertAdjacentElement('beforebegin', wrapper); // "afterbegin" | "afterend" | "beforebegin" | "beforeend"
			wrapper.appendChild(el);
			callback?.({
				fragment: tag,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	private adjacentElement(
		element: HTMLElement,
		content: HTMLElement | Be | string,
		mode: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend'
	) {
		const normalizedContent = this.normalizeContent(content);

		if (typeof content === 'string') {
			// Si le contenu est une chaîne HTML, utilisez insertAdjacentHTML
			element.insertAdjacentHTML(mode, content);
		} else if (normalizedContent instanceof HTMLElement) {
			// Si le contenu est un élément DOM, utilisez insertAdjacentElement
			if (mode === 'afterend') {
				element.parentNode?.insertBefore(normalizedContent, element.nextSibling);
			} else if (mode === 'beforebegin') {
				element.parentNode?.insertBefore(normalizedContent, element);
			} else {
				element.insertAdjacentElement(mode, normalizedContent);
			}
		} else if (normalizedContent instanceof DocumentFragment) {
			// Si le contenu est un fragment, insérez chaque nœud
			Array.from(normalizedContent.childNodes).forEach((node) => {
				if (mode === 'afterbegin' || mode === 'beforeend') {
					element.appendChild(node);
				} else if (mode === 'afterend') {
					element.parentNode?.insertBefore(node, element.nextSibling);
				} else if (mode === 'beforebegin') {
					element.parentNode?.insertBefore(node, element);
				}
			});
		}
	}

	private normalizeContent(content: string | HTMLElement | Be): HTMLElement | DocumentFragment {
		if (typeof content === 'string') {
			// Si le contenu est une chaîne HTML, créez un fragment DOM
			const template = document.createElement('template');
			template.innerHTML = content.trim();
			return template.content;
		} else if (content instanceof Be) {
			// Si le contenu est une instance de Be, utilisez son premier nœud
			if (Array.isArray(content.node)) {
				const fragment = document.createDocumentFragment();
				content.node.forEach((node) => {
					if (node instanceof HTMLElement) {
						fragment.appendChild(node);
					}
				});
				return fragment;
			} else if (content.node instanceof HTMLElement) {
				return content.node;
			}
			throw new Error('Invalid Be instance: no valid node found.');
		} else {
			// Sinon, le contenu est déjà un HTMLElement
			return content;
		}
	}

	private insertContent(el: HTMLElement, content: Content, mode: 'afterEnd' | 'beforeEnd') {
		const normalizedContent = this.normalizeContent(content);

		if (mode === 'afterEnd') {
			el.parentNode?.insertBefore(normalizedContent, el.nextSibling);
		} else if (mode === 'beforeEnd') {
			el.appendChild(normalizedContent);
		}
	}

	valueOf(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.inputNode as HTMLElement).innerHTML;
	}
}
