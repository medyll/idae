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
						el.insertAdjacentHTML('afterbegin', props);
					} else {
						throw new Error('Invalid props for prepend: must be a string.');
					}
					break;
				case 'append':
					if (typeof props === 'string') {
						el.insertAdjacentHTML('beforeend', props);
					} else {
						throw new Error('Invalid props for append: must be a string.');
					}
					break;
				case 'replace':
					if (typeof props === 'string') {
						el.outerHTML = props;
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

	update(content: TextHandlerHandle['update'], callback?: HandlerCallBackFn) {
		return this.handle({ update: content, callback });
	}
	append(content: TextHandlerHandle['append'], callback?: HandlerCallBackFn) {
		return this.handle({ append: content, callback });
	}
	prepend(content: TextHandlerHandle['prepend'], callback?: HandlerCallBackFn) {
		return this.handle({ prepend: content, callback });
	}
	replace(content: TextHandlerHandle['replace'], callback?: HandlerCallBackFn) {
		return this.handle({ replace: content, callback });
	}
	remove(callback?: HandlerCallBackFn) {
		return this.handle({ remove: undefined, callback });
	}
	clear(callback?: HandlerCallBackFn) {
		return this.handle({ clear: undefined, callback });
	}
	normalize(callback?: HandlerCallBackFn) {
		return this.handle({ normalize: undefined, callback });
	}
	wrap(content: TextHandlerHandle['wrap'], callback?: HandlerCallBackFn) {
		return this.handle({ wrap: content, callback });
	}
	valueOf(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.inputNode as HTMLElement).innerText;
	}
}
