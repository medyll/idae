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

	get text(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).textContent;
	}

	handle(actions: TextHandlerHandle): Be {
		this.beElement.eachNode((el: HTMLElement) => {
			const { method, props } = BeUtils.resolveIndirection<TextHandler>(TextHandler, actions);

			switch (method) {
				case 'update':
					el.innerText = props;
					break;
				case 'prepend': // append to text content
					el.insertAdjacentHTML('beforebegin', props);
					break;
				case 'append':
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

	update(content: TextHandlerHandle['update'], callback?: HandlerCallBackFn) {
		this.handle({ update: content, callback });
	}
	updateText(content: TextHandlerHandle['updateText'], callback?: HandlerCallBackFn) {
		this.handle({ updateText: content, callback });
	}
	append(content: TextHandlerHandle['append'], callback?: HandlerCallBackFn) {
		return this.handle({ append: content, callback });
	}
	prepend(content: TextHandlerHandle['prepend'], callback?: HandlerCallBackFn) {
		this.handle({ prepend: content, callback });
	}
	replace(content: TextHandlerHandle['replace'], callback?: HandlerCallBackFn) {
		this.handle({ replace: content, callback });
	}
	remove(content: TextHandlerHandle['remove'], callback?: HandlerCallBackFn) {
		this.handle({ remove: content, callback });
	}
	clear(content: TextHandlerHandle['clear'], callback?: HandlerCallBackFn) {
		this.handle({ clear: content, callback });
	}
	normalize(content: TextHandlerHandle['normalize'], callback?: HandlerCallBackFn) {
		this.handle({ normalize: content, callback });
	}
	wrap(content: TextHandlerHandle['wrap'], callback?: HandlerCallBackFn) {
		this.handle({ wrap: content, callback });
	}
	valueOf(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).innerText;
	}
}
