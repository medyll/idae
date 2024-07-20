import { Be } from './be.js';
import { BeUtils } from './utils.js';

export type DataHandlerHandle = {
	set: (keyOrObject: string | Record<string, string>, value?: string) => Be;
	delete: (keyOrObject: string | Record<string, string>, value?: string) => Be;
};

export class DataHandler {
	private beElement: Be;
	static methods = ['get', 'set', 'delete'];

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

	get beElem(): Be {
		return this.beElement;
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
