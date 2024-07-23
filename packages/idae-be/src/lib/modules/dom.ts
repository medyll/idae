import { Be, be } from '../be.js';
import type { HandlerCallbackProps, HandlerCallBackFn, CommonHandler } from '../types.js';

enum domMethods {
	update = 'update',
	append = 'append',
	prepend = 'prepend',
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

export class DomHandler implements CommonHandler<DomHandler, DomHandlerHandle> {
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
		this.beElement.eachNode((el: HTMLElement) => {
			if (content instanceof Be) {
				content.eachNode((child: HTMLElement) => {
					el.appendChild(child);
				});
			} else {
				el.appendChild(content);
			}
			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	prepend(content: Content, callback?: HandlerCallBackFn): Be {
		this.beElement.eachNode((el: HTMLElement) => {
			if (content instanceof Be) {
				content.eachNode((child: HTMLElement) => {
					el.insertBefore(child, el.firstChild);
				});
			} else {
				el.insertBefore(content, el.firstChild);
			}

			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	replace(content: Content, callback?: HandlerCallBackFn) {
		this.beElement.eachNode((el: HTMLElement) => {
			if (content instanceof Be) {
				content.eachNode((child: HTMLElement) => {
					el.replaceWith(child);
				});
			} else {
				el.replaceWith(content);
			}
			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
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
			el.insertBefore(wrapper, el);
			wrapper.appendChild(el);
			callback?.({
				fragment: tag,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	valueOf(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).innerHTML;
	}
}
