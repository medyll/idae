import { Be, be } from '../be.js';
import type { HandlerCallbackProps, HandlerCallBackFn, CommonHandler } from '../types.js';

enum domMethods {
	update = 'update',
	updateText = 'updateText',
	append = 'append',
	prepend = 'prepend',
	remove = 'remove',
	wrap = 'wrap',
	normalize = 'normalize',
	replace = 'replace',
	clear = 'clear'
}
export interface DomHandlerHandle {
	update?: {
		content: string | HTMLElement;
		callback?: (element: HandlerCallbackProps) => void;
	};
	updateText?: string | HTMLElement;
	append?: {
		content: string | HTMLElement;
		callback?: (element: HandlerCallbackProps) => void;
	};
	prepend?: {
		content: string | HTMLElement;
		callback?: (element: HandlerCallbackProps) => void;
	};
	remove?: true;
	replace?: {
		content: string | HTMLElement;
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

/* 
		let act = {
			update: 'test',
			append: { content: '', callback: '' },
			prepend: { content: '', callback: '' },
			replace: { content: '', callback: '' },
			remove: true,
			clear: true,
			fire: {'dom:node': ''},
			normalize: true,
			wrap: { tag: 'div', callback: '' }
		};
 */
export class DomHandler implements CommonHandler<DomHandler> {
	private beElement: Be;

	static methods = Object.values(domMethods);

	constructor(element: Be) {
		this.beElement = element;
	}

	get text(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).textContent;
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
			// const { method, props } = BeUtils.resolveIndirection<DomHandler>(DomHandler, actions);
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

	update(content: string | HTMLElement, callback?: HandlerCallBackFn): Be {
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
	updateText(content: string | HTMLElement, callback?: HandlerCallBackFn) {
		this.handle({ updateText: content, callback });
	}
	append(content: string | HTMLElement, callback?: HandlerCallBackFn): Be {
		this.beElement.eachNode((el: HTMLElement) => {
			el.appendChild(content);
			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	prepend(content: string | HTMLElement, callback?: HandlerCallBackFn): Be {
		this.beElement.eachNode((el: HTMLElement) => {
			el.insertBefore(content, el.firstChild);
			callback?.({
				fragment: content,
				be: be(el),
				root: this.beElement
			});
		});
		return this.beElement;
	}

	replace(content: string | HTMLElement, callback?: HandlerCallBackFn) {
		this.handle({ replace: content, callback });
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
				fragment: tag,
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
