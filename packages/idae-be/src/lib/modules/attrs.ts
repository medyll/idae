import { Be } from '../be.js';
import type { CommonHandler } from '../types.js';

enum attrMethods {
	set = 'set',
	get = 'get',
	delete = 'delete'
}

export type AttrHandlerHandle = {
	set: AttrHandler['set'];
	delete: AttrHandler['handle'];
};

export class AttrHandler implements CommonHandler<AttrHandler, AttrHandler> {
	private beElement: Be;

	static methods = Object.values(attrMethods);

	constructor(element: Be) {
		this.beElement = element;
	}

	handle(actions: Partial<AttrHandlerHandle>): Be {
		this.beElement.eachNode((el) => {
			if (actions.delete) {
			}
			if (actions.set) {
			}
		});
		return this.beElement;
	}

	get(name?: string): string | null {
		if (typeof this.beElement.node === 'string')
			return document.querySelector(this.beElement.node || '')?.getAttribute(name || '') || null;
		if (this.beElement.isWhat !== 'element') return null;
		const el = this.beElement.node as HTMLElement;

		return name ? el.getAttribute(name) : null;
	}

	set(nameOrObject: string | Record<string, string>, value?: string): Be {
		this.beElement.eachNode((el) => {
			if (typeof nameOrObject === 'string' && value !== undefined) {
				el.setAttribute(nameOrObject, value);
			} else if (typeof nameOrObject === 'object') {
				Object.entries(nameOrObject).forEach(([name, val]) => {
					el.setAttribute(name, val);
				});
			}
		});
		return this.beElement;
	}

	delete(nameOrObject: string | Record<string, string>): Be {
		this.beElement.eachNode((el) => {
			if (typeof nameOrObject === 'string') {
				el.removeAttribute(nameOrObject);
			} else if (typeof nameOrObject === 'object') {
				Object.entries(nameOrObject).forEach(([name, val]) => {
					el.removeAttribute(name);
				});
			}
		});
		return this.beElement;
	}

	valueOf(): Record<string, string> | null {
		if (this.beElement.isWhat !== 'element') return null;
		const el = this.beElement.node as HTMLElement;
		const attrs = {};
		for (let i = 0; i < el.attributes.length; i++) {
			const attr = el.attributes[i];
			attrs[attr.name] = attr.value;
		}
		return attrs;
	}
}
