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
	//"afterbegin" | "afterend" | "beforebegin" | "beforeend"
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

export class DomHandler
	implements DomHandlerInterface, CommonHandler<DomHandler, DomHandlerHandle>
{
	private beElement: Be;

	static methods = Object.values(domMethods);

	constructor(element: Be) {
		this.beElement = element;
	}

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

	append(content: Content, callback?: HandlerCallBackFn): Be {
		const ret: HTMLElement[] = [];
		this.beElement.eachNode((el: HTMLElement) => {
			if (content instanceof Be) {
				content.eachNode((child: HTMLElement) => {
					ret.push(child);
					el.appendChild(child);
				});
			} else {
				ret.push(content);
				el.appendChild(content);
			}
		});
		callback?.({
			fragment: content,
			be: be(ret),
			root: this.beElement
		});
		return this.beElement;
	}

	prepend(content: Content, callback?: HandlerCallBackFn): Be {
		const ret: HTMLElement[] = [];
		this.beElement.eachNode((el: HTMLElement) => {
			if (content instanceof Be) {
				content.eachNode((child: HTMLElement) => {
					ret.push(child);
					el.insertBefore(child, el.firstChild);
				});
			} else {
				ret.push(content);
				el.insertBefore(content, el.firstChild);
			}
		});
		callback?.({
			fragment: content,
			be: be(ret),
			root: this.beElement
		});
		return this.beElement;
	}

	insert(
		mode: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend',
		element: HTMLElement | Be,
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
		}
	}
	afterBegin(content: HTMLElement, callback?: HandlerCallBackFn) {
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

	afterEnd(content: Content, callback?: HandlerCallBackFn) {
		this.append(content, callback);
		return this.beElement;
	}

	beforeBegin(content: Content, callback?: HandlerCallBackFn) {
		this.prepend(content, callback);
		return this.beElement;
	}

	beforeEnd(content: Content, callback?: HandlerCallBackFn) {
		this.append(content, callback);
		return this.beElement;
	}

	replace(content: Content, callback?: HandlerCallBackFn) {
		const ret: HTMLElement[] = [];
		this.beElement.eachNode((el: HTMLElement) => {
			if (content instanceof Be) {
				content.eachNode((child: HTMLElement) => {
					ret.push(child);
					el.replaceWith(child);
				});
			} else {
				ret.push(content);
				el.replaceWith(content);
			}
		});

		callback?.({
			fragment: content,
			be: be(ret),
			root: this.beElement
		});
		return this.beElement;
	}

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

	clear(callback?: HandlerCallBackFn) {
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
	wrap(tag: string = 'div', callback?: HandlerCallBackFn) {
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
		content: HTMLElement,
		mode: 'afterbegin' | 'afterend' | 'beforebegin' | 'beforeend'
	) {
		element.insertAdjacentElement(mode, content);
		return this.beElement;
	}

	valueOf(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.inputNode as HTMLElement).innerHTML;
	}
}
