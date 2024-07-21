import { Be } from './be.js';

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

export class DataHandler {
	private beElement: Be;
	static methods = Object.values(dataMethods);

	constructor(element: Be) {
		this.beElement = element;
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
		console.log('not implemented');
		return this.beElement;
	}

	getKey(key: string): string | null {
		// if space in string
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).dataset[key] || null;
	}

	handle(actions: Partial<DataHandlerHandle>): Be {
		this.beElement.eachNode((el) => {
			if (actions.set) {
			}
			if (actions.delete) {
			}
		});
		return this.beElement;
	}

	valueOf(): DOMStringMap | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).dataset;
	}
}
