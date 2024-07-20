import { Be, be } from './be.js';
import type { HandlerCallbackProps, HandlerCallBack } from './types.js';
import { BeUtils } from './utils.js';

export type DomHandlerHandle = {
	update?: string | HTMLElement;
	updateText?: string | HTMLElement;
	append?: string | HTMLElement;
	prepend?: string | HTMLElement;
	remove?: boolean;
	replace?: string | HTMLElement;
	clear?: boolean;
	callback?: (element: HandlerCallbackProps) => void;
};

export class DomHandler {
	// update!: (content: DomHandlerHandle['update'], callback?: DomHandlerHandleCallBack) => Be;
	// updateText!: (content: DomHandlerHandle['update'], callback?: DomHandlerHandleCallBack) => Be;

	private beElement: Be;

	static methods = ['update', 'updateText', 'append', 'prepend', 'remove', 'replace', 'clear'];

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
		this.beElement.eachNode((el) => {
			if (actions.update !== undefined) {
				const htmlInfo = BeUtils.isHTML(actions.update, { returnHTMLelement: true });
				if (htmlInfo.isHtml) {
					el.innerHTML = actions.update; /*  */
				}
			}
			if (actions.updateText !== undefined) {
				el.innerHTML = actions.update; /*  */
			}
			if (actions.append !== undefined) {
				let newElement: HTMLElement;
				if (typeof actions.append === 'string') {
					const htmlInfo = BeUtils.isHTML(actions.append, { returnHTMLelement: true });
					if (htmlInfo.isHtml) {
						newElement = htmlInfo.node;
						el.appendChild(htmlInfo.node);
					} else {
						newElement = document.createElement('span');
						newElement.textContent = actions.append;
						// el.insertAdjacentHTML('beforeend', actions.append);
					}
				} else {
					newElement = el.appendChild(actions.append);
				}
				actions?.callback?.({
					fragment: actions.append,
					element: be(newElement),
					root: this.beElement
				});
			}
			if (actions.prepend !== undefined) {
				if (typeof actions.prepend === 'string') {
					const htmlInfo = BeUtils.isHTML(actions.prepend, { returnHTMLelement: true });
					el.insertAdjacentHTML('afterbegin', actions.prepend);
				} else {
					el.insertBefore(actions.prepend, el.firstChild);
				}

				{
					returnHTMLelement: true;
				}
			}
			if (actions.remove) {
				el.remove();
			}
			if (actions.replace !== undefined) {
				if (typeof actions.replace === 'string') {
					el.outerHTML = actions.replace;
				} else {
					el.parentNode?.replaceChild(actions.replace, el);
				}
			}
			if (actions.clear) {
				el.innerHTML = '';
			}
		});

		return this.beElement;
	}

	attachRoot(that: Be) {
		DomHandler.methods.forEach((method) => {
			that[method] = this.handlerFor(method);
		});
	}

	handlerFor(command: keyof DomHandlerHandle) {
		return (content: string | HTMLElement, callback: HandlerCallBack) =>
			this.handle({ [command]: content, callback });
	}

	update(content: DomHandlerHandle['update'], callback?: HandlerCallBack) {
		this.handle({ update: content, callback });
	}
	updateText(content: DomHandlerHandle['updateText'], callback?: HandlerCallBack) {
		this.handle({ updateText: content, callback });
	}
	append(content: DomHandlerHandle['append'], callback?: HandlerCallBack) {
		this.handle({ append: content, callback });
	}
	prepend(content: DomHandlerHandle['prepend'], callback?: HandlerCallBack) {
		this.handle({ prepend: content, callback });
	}
	replace(content: DomHandlerHandle['replace'], callback?: HandlerCallBack) {
		this.handle({ replace: content, callback });
	}
	remove(content: DomHandlerHandle['update'], callback?: HandlerCallBack) {
		this.handle({ update: content, callback });
	}
	clear(content: DomHandlerHandle['update'], callback?: HandlerCallBack) {
		this.handle({ update: content, callback });
	}

	valueOf(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).innerHTML;
	}
}
