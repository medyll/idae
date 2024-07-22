import { BeUtils } from '$lib/utils.js';
import { Be } from '../be.js';
import type { CommonHandler } from '../types.js';

enum dataMethods {
	set = 'set',
	get = 'get',
	delete = 'delete',
	getKey = 'getKey'
}

export type DataHandlerHandle = {
	set: (keyOrObject: string | Record<string, string>, value?: string) => Be;
	delete: (keyOrObject: string | Record<string, string>, value?: string) => Be;
};

export class DataHandler implements CommonHandler<DataHandler> {
	private beElement: Be;
	static methods = Object.values(dataMethods);

	constructor(element: Be) {
		this.beElement = element;
	}

	handle(actions: Partial<DataHandlerHandle>): Be {
		const { method, props } = BeUtils.resolveIndirection<DataHandler>(DataHandler, actions);
		switch (method) {
			case 'set':
			case 'delete':
				this[method](props.keyOrObject, props.value);
				break;
		}

		return this.beElement;
	}

	get(key: string): string | null {
		// if space in string
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).dataset[key] || null;
	}

	set(keyOrObject: string | Record<string, string>, value?: string): Be {
		this.beElement.eachNode((el) => {
			if (typeof keyOrObject === 'string' && value !== undefined) {
				el.dataset[keyOrObject] = value;
			} else if (typeof keyOrObject === 'object') {
				Object.entries(keyOrObject).forEach(([key, val]) => {
					el.dataset[key] = val;
				});
			}
		});
		return this.beElement;
	}

	delete(keyOrObject: string | Record<string, string>, value?: string): Be {
		this.beElement.eachNode((el) => {
			if (typeof keyOrObject === 'string' && value !== undefined) {
				el.dataset[keyOrObject] = value;
			} else if (typeof keyOrObject === 'object') {
				Object.entries(keyOrObject).forEach(([key, val]) => {
					delete el.dataset[key];
				});
			}
		});
		return this.beElement;
	}

	getKey(key: string | string[]): string | null {
		// if spaces in string
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).dataset[key] || null;
	}

	valueOf(): DOMStringMap | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).dataset;
	}
}
