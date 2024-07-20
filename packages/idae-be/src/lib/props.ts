import { Be } from './be.js';
import { BeUtils } from './utils.js';

export class PropsHandler {
	private element: Be;

	static methods = ['get', 'set'];

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
