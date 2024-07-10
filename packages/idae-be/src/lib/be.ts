type IsWhat = 'element' | 'array' | 'qy';

class DataHandler {
	private element: Be;

	constructor(element: Be) {
		this.element = element;
	}

	get(key: string): string | null {
		if (this.element.isWhat !== 'element') return null;
		return (this.element.node as HTMLElement).dataset[key] || null;
	}

	set(keyOrObject: string | Record<string, string>, value?: string): Be {
		this.element.each((el) => {
			if (typeof keyOrObject === 'string' && value !== undefined) {
				el.dataset[keyOrObject] = value;
			} else if (typeof keyOrObject === 'object') {
				Object.entries(keyOrObject).forEach(([key, val]) => {
					el.dataset[key] = val;
				});
			}
		});
		return this.element;
	}

	get beElem(): Be {
		return this.element;
	}

	valueOf(): DOMStringMap | null {
		if (this.element.isWhat !== 'element') return null;
		return (this.element.node as HTMLElement).dataset;
	}
}
class PropHandler {
	private element: Be;

	constructor(element: Be) {
		this.element = element;
	}

	get(name: string): any {
		if (this.element.isWhat !== 'element') return null;
		return (this.element.node as HTMLElement)[name];
	}

	set(nameOrObject: string | Record<string, any>, value?: any): Be {
		this.element.each((el) => {
			if (typeof nameOrObject === 'string' && value !== undefined) {
				el[nameOrObject] = value;
			} else if (typeof nameOrObject === 'object') {
				Object.entries(nameOrObject).forEach(([name, val]) => {
					el[name] = val;
				});
			}
		});
		return this.element;
	}

	valueOf(): Record<string, any> | null {
		if (this.element.isWhat !== 'element') return null;
		const el = this.element.node as HTMLElement;
		const props = {};
		for (let prop in el) {
			if (el.hasOwnProperty(prop)) {
				props[prop] = el[prop];
			}
		}
		return props;
	}
}

class DomHandler {
	private element: Be;

	constructor(element: Be) {
		this.element = element;
	}

	update(content: string): Be {
		this.element.each((el) => {
			el.innerHTML = content;
		});
		return this.element;
	}

	get text(): string | null {
		if (this.element.isWhat !== 'element') return null;
		return (this.element.node as HTMLElement).textContent;
	}

	textUpdate(content: string): Be {
		this.element.each((el) => {
			el.textContent = content;
		});
		return this.element;
	}

	valueOf(): string | null {
		if (this.element.isWhat !== 'element') return null;
		return (this.element.node as HTMLElement).innerHTML;
	}
}

class AttrHandler {
	private element: Be;

	constructor(element: Be) {
		this.element = element;
	}

	get(name?: string): string | null {
		if (this.element.isWhat !== 'element') return null;
		const el = this.element.node as HTMLElement;
		return name ? el.getAttribute(name) : null;
	}

	set(nameOrObject: string | Record<string, string>, value?: string): Be {
		this.element.each((el) => {
			if (typeof nameOrObject === 'string' && value !== undefined) {
				el.setAttribute(nameOrObject, value);
			} else if (typeof nameOrObject === 'object') {
				Object.entries(nameOrObject).forEach(([name, val]) => {
					el.setAttribute(name, val);
				});
			}
		});
		return this.element;
	}

	valueOf(): Record<string, string> | null {
		if (this.element.isWhat !== 'element') return null;
		const el = this.element.node as HTMLElement;
		const attrs = {};
		for (let i = 0; i < el.attributes.length; i++) {
			const attr = el.attributes[i];
			attrs[attr.name] = attr.value;
		}
		return attrs;
	}
}

export class Be {
	node: HTMLElement | HTMLElement[] | string;
	isWhat: IsWhat;
	attr: AttrHandler;
	dom: DomHandler;
	prop: PropHandler;
	data: DataHandler;

	private constructor(node: HTMLElement | HTMLElement[] | string) {
		this.node = node;
		this.isWhat = typeof node === 'string' ? 'qy' : Array.isArray(node) ? 'array' : 'element';

		this.attr = new AttrHandler(this);
		this.dom = new DomHandler(this);
		this.prop = new PropHandler(this);
		this.data = new DataHandler(this);
	}

	static elem(node: HTMLElement | HTMLElement[] | string): Be {
		return new Be(node);
	}

	classAdd(className: string) {
		this.each((el) => el.classList.add(className));
		return this;
	}

	classRemove(className: string) {
		this.each((el) => el.classList.remove(className));
		return this;
	}

	classToggle(className: string) {
		this.each((el) => el.classList.toggle(className));
		return this;
	}

	find(qy: string) {
		switch (this.isWhat) {
			case 'element':
				return (this.node as HTMLElement).querySelector(qy);
			case 'array':
				return (this.node as HTMLElement[])
					.map((node) => node.querySelector(qy))
					.filter((el) => el !== null);
			case 'qy': {
				const foundElement = document.querySelector(this.node as string);
				return foundElement ? foundElement.querySelector(qy) : null;
			}
			default:
				return null;
		}
	}

	findAll(qy: string) {
		switch (this.isWhat) {
			case 'element':
				return Array.from((this.node as HTMLElement).querySelectorAll(qy));
			case 'array':
				return (this.node as HTMLElement[]).flatMap((node) =>
					Array.from(node.querySelectorAll(qy))
				);
			case 'qy':
				return Array.from(document.querySelectorAll(this.node as string)).flatMap((node) =>
					Array.from(node.querySelectorAll(qy))
				);
			default:
				return [];
		}
	}

	get html() {
		return this.isWhat === 'element' ? (this.node as HTMLElement).innerHTML : null;
	}

	htmlSet(content: string) {
		this.each((el) => (el.innerHTML = content));
		return this;
	}

	get text() {
		return this.isWhat === 'element' ? (this.node as HTMLElement).textContent : null;
	}

	textSet(content: string) {
		this.each((el) => (el.textContent = content));
		return this;
	}

	up(qy?: string) {
		switch (this.isWhat) {
			case 'element':
				return this.findWhile(this.node as HTMLElement, 'parent', qy);
			case 'array':
				return (this.node as HTMLElement[]).map((node) => this.findWhile(node, 'parent', qy));
			case 'qy':
				return Array.from(document.querySelectorAll(this.node as string)).map((node) =>
					this.findWhile(node, 'parent', qy)
				);
		}
	}

	next(qy?: string) {
		switch (this.isWhat) {
			case 'element':
				return this.findWhile(this.node as HTMLElement, 'next', qy);
			case 'array':
				return (this.node as HTMLElement[]).map((node) => this.findWhile(node, 'next', qy));
			case 'qy':
				return Array.from(document.querySelectorAll(this.node as string)).map((node) =>
					this.findWhile(node, 'next', qy)
				);
		}
	}

	previous(qy?: string) {
		switch (this.isWhat) {
			case 'element':
				return this.findWhile(this.node as HTMLElement, 'previous', qy);
			case 'array':
				return (this.node as HTMLElement[]).map((node) => this.findWhile(node, 'previous', qy));
			case 'qy':
				return Array.from(document.querySelectorAll(this.node as string)).map((node) =>
					this.findWhile(node, 'previous', qy)
				);
		}
	}

	styleSet(styles: Record<string, any>) {
		this.each((el) => Object.assign(el.style, styles));
		return this;
	}

	on(eventName: string, handler: EventListener) {
		this.each((el) => el.addEventListener(eventName, handler));
		return this;
	}

	off(eventName: string, handler: EventListener) {
		this.each((el) => el.removeEventListener(eventName, handler));
		return this;
	}

	append(content: string | HTMLElement) {
		this.each((el) => {
			if (typeof content === 'string') {
				el.insertAdjacentHTML('beforeend', content);
			} else {
				el.appendChild(content);
			}
		});
		return this;
	}

	remove() {
		this.each((el) => el.remove());
		return this;
	}

	fetch<T extends object>(options: {
		url: string;
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE';
		data?: T;
		headers?: Record<string, string>;
	}) {
		return fetch(options.url, {
			method: options.method || 'GET',
			body: options.data ? JSON.stringify(options.data) : undefined,
			headers: options.headers || {}
		}).then((response) => response.json());
	}

	each(callback: (el: HTMLElement) => void): void {
		switch (this.isWhat) {
			case 'element':
				callback(this.node as HTMLElement);
				break;
			case 'array':
				(this.node as HTMLElement[]).forEach(callback);
				break;
			case 'qy':
				document.querySelectorAll(this.node as string).forEach((el) => callback(el as HTMLElement));
				break;
		}
	}

	private findWhile(
		element: Element,
		direction: 'parent' | 'next' | 'previous',
		selector?: string
	): Element | null {
		if (direction === 'parent') {
			return selector ? element.closest(selector) : element.parentElement;
		}

		const siblingProperty = direction === 'next' ? 'nextElementSibling' : 'previousElementSibling';
		let sibling = element[siblingProperty] as Element | null;

		while (sibling) {
			if (!selector || sibling.matches(selector)) {
				return sibling;
			}
			sibling = sibling[siblingProperty] as Element | null;
		}

		return null;
	}
}

export function be(selector: string | HTMLElement | HTMLElement[]): Be {
	return Be.elem(selector);
}
