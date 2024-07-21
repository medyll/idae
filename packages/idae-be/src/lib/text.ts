import { Be, be } from './be.js';
import type { HandlerCallbackProps, HandlerCallBack } from './types.js';
import { BeUtils } from './utils.js';

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

export class TextHandler {
	// update!: (content: TextHandlerHandle['update'], callback?: DomHandlerHandleCallBack) => Be;
	// updateText!: (content: TextHandlerHandle['update'], callback?: DomHandlerHandleCallBack) => Be;

	private beElement: Be;

	static methods = [
		'update',
		'append',
		'prepend',
		'remove',
		'wrap',
		'normalize',
		'replace',
		'clear'
	];

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
	handle(actions: TextHandlerHandle): Be {
		this.beElement.eachNode((el: HTMLElement) => {
			const { method, props } = BeUtils.resolveIndirection<TextHandler>(TextHandler, actions);

			switch (method) {
				case 'update':
					el.innerText = props;
					break;
				case 'append': // append to text content
					el.insertAdjacentHTML('beforebegin', props);
					break;
				case 'prepend':
					el.insertAdjacentHTML('afterbegin', props);
					break;
				case 'replace':
					el.outerHTML = props;
					break;
				case 'remove':
					el.remove();
					break;
				case 'clear':
					el.outerHTML = '';
					break;
				case 'normalize':
					el.normalize();
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

	update(content: TextHandlerHandle['update'], callback?: HandlerCallBack) {
		this.handle({ update: content, callback });
	}
	updateText(content: TextHandlerHandle['updateText'], callback?: HandlerCallBack) {
		this.handle({ updateText: content, callback });
	}
	append(content: TextHandlerHandle['append'], callback?: HandlerCallBack) {
		return this.handle({ append: content, callback });
	}
	prepend(content: TextHandlerHandle['prepend'], callback?: HandlerCallBack) {
		this.handle({ prepend: content, callback });
	}
	replace(content: TextHandlerHandle['replace'], callback?: HandlerCallBack) {
		this.handle({ replace: content, callback });
	}
	remove(content: TextHandlerHandle['remove'], callback?: HandlerCallBack) {
		this.handle({ remove: content, callback });
	}
	clear(content: TextHandlerHandle['clear'], callback?: HandlerCallBack) {
		this.handle({ clear: content, callback });
	}
	normalize(content: TextHandlerHandle['normalize'], callback?: HandlerCallBack) {
		this.handle({ normalize: content, callback });
	}
	wrap(content: TextHandlerHandle['wrap'], callback?: HandlerCallBack) {
		this.handle({ wrap: content, callback });
	}
	valueOf(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).innerText;
	}
}
