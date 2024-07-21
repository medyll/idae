import { Be } from './be.js';
import type { CommonHandler } from './types.js';

enum PropsMethods {
	set = 'set',
	get = 'get',
	delete = 'delete',
	getKey = 'getKey'
}

export class PropsHandler implements CommonHandler<PropsHandler> {
	private element: Be;

	static methods = Object.values(PropsMethods);

	constructor(element: Be) {
		this.element = element;
	}

	get(name: string): any {
		if (this.element.isWhat !== 'element') return null;
		return (this.element.node as HTMLElement)[name];
	}

	set(nameOrObject: string | Record<string, any>, value?: any): Be {
		this.element.eachNode((el) => {
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

	delete(name: string): Be {}

	getKey(key: string): string | null {
		return null;
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
