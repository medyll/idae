import { Be, be } from './be.js';
import type { HandlerCallbackProps, HandlerCallBack } from './types.js';
import { BeUtils } from './utils.js';

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
export type DomHandlerHandle = {
	update?: string | HTMLElement;
	updateText?: string | HTMLElement;
	append?: string | HTMLElement;
	prepend?: string | HTMLElement;
	remove?: boolean;
	replace?: string | HTMLElement;
	wrap?: string;
	normalize?: boolean;
	clear?: boolean;
	callback?: (element: HandlerCallbackProps) => void;
};

export class DomHandler {
	// update!: (content: DomHandlerHandle['update'], callback?: DomHandlerHandleCallBack) => Be;
	// updateText!: (content: DomHandlerHandle['update'], callback?: DomHandlerHandleCallBack) => Be;

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
		this.beElement.eachNode((el: HTMLElement) => {
			const { method, props } = BeUtils.resolveIndirection<DomHandler>(DomHandler, actions);
			const htmlInfo = BeUtils.isHTML(props, { returnHTMLelement: true });

			switch (method) {
				case 'update':
					el.innerHTML = props;
					break;
				case 'updateText':
					el.innerText = props;
					break;
				case 'append':
					el.appendChild(htmlInfo.node);
					break;
				case 'prepend':
					el.insertBefore(htmlInfo.node, el.firstChild);
					break;
				case 'replace':
					el.parentNode?.replaceChild(htmlInfo.node, el);
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
					el.normalize();
					break;
			}

			actions?.callback?.({
				fragment: actions.append,
				be: be(el),
				root: this.beElement
			});

			/* if (actions.prepend !== undefined) {
				if (typeof actions.prepend === 'string') {
					const htmlInfo = BeUtils.isHTML(actions.prepend, { returnHTMLelement: true });
					el.insertAdjacentHTML('afterbegin', actions.prepend);
				} else {
					el.insertBefore(actions.prepend, el.firstChild);
				} 
			} */
			/* if (actions.replace !== undefined) {
				if (typeof actions.replace === 'string') {
					el.outerHTML = actions.replace;
				} else {
					el.parentNode?.replaceChild(actions.replace, el);
				}
			} */
		});

		return this.beElement;
	}

	update(content: DomHandlerHandle['update'], callback?: HandlerCallBack) {
		this.handle({ update: content, callback });
	}
	updateText(content: DomHandlerHandle['updateText'], callback?: HandlerCallBack) {
		this.handle({ updateText: content, callback });
	}
	append(content: DomHandlerHandle['append'], callback?: HandlerCallBack) {
		return this.handle({ append: content, callback });
	}
	prepend(content: DomHandlerHandle['prepend'], callback?: HandlerCallBack) {
		this.handle({ prepend: content, callback });
	}
	replace(content: DomHandlerHandle['replace'], callback?: HandlerCallBack) {
		this.handle({ replace: content, callback });
	}
	remove(content: DomHandlerHandle['remove'], callback?: HandlerCallBack) {
		this.handle({ remove: content, callback });
	}
	clear(content: DomHandlerHandle['clear'], callback?: HandlerCallBack) {
		this.handle({ clear: content, callback });
	}
	normalize(content: DomHandlerHandle['normalize'], callback?: HandlerCallBack) {
		this.handle({ normalize: content, callback });
	}
	wrap(content: DomHandlerHandle['wrap'], callback?: HandlerCallBack) {
		this.handle({ wrap: content, callback });
	}
	valueOf(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).innerHTML;
	}
}
