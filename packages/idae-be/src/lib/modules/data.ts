import { BeUtils } from '$lib/utils.js';
import { Be } from '../be.js';
import type { CommonHandler } from '../types.js';

enum dataMethods {
	set = 'set',
	get = 'get',
	delete = 'delete',
	getKey = 'getKey'
}

/**
 * Type definition for DataHandler actions.
 */
export type DataHandlerHandle = {
	get: (keyOrObject: string | Record<string, string>, value?: string) => Be;
	set: (keyOrObject: string | Record<string, string>, value?: string) => Be;
	delete: (keyOrObject: string | Record<string, string>, value?: string) => Be;
	getKey: (keyOrObject: string | Record<string, string>, value?: string) => Be;
};

/**
 * Handles operations on `data-*` attributes for Be elements.
 */
export class DataHandler implements CommonHandler<DataHandler> {
	private beElement: Be;
	static methods = Object.values(dataMethods);

	/**
	 * Initializes the DataHandler with a Be element.
	 * @param element - The Be element to operate on.
	 */
	constructor(element: Be) {
		this.beElement = element;
	}
	methods: string[] | keyof DataHandler = DataHandler.methods;

	/**
	 * Handles dynamic method calls for data operations.
	 * @param actions - The action to perform (e.g., set, get, delete).
	 * @returns The Be element for chaining.
	 */
	handle(actions: Partial<DataHandlerHandle>): Be {
		const { method, props } = BeUtils.resolveIndirection<DataHandler>(
			this,
			actions as unknown as keyof DataHandler
		);
		switch (method) {
			case 'set':
			case 'delete':
				this[method](props.keyOrObject, props.value);
				break;
		}

		return this.beElement;
	}

	/**
	 * Retrieves the value of a `data-*` attribute.
	 * @param key - The key of the `data-*` attribute to retrieve.
	 * @returns The value of the attribute, or `null` if not found.
	 */
	get(key: string): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.inputNode as HTMLElement).dataset[key] || null;
	}

	/**
	 * Sets one or more `data-*` attributes.
	 * @param keyOrObject - A key-value pair or an object containing multiple key-value pairs.
	 * @param value - The value to set if a single key is provided.
	 * @returns The Be element for chaining.
	 */
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

	/**
	 * Deletes one or more `data-*` attributes.
	 * @param keyOrObject - A key or an object containing multiple keys to delete.
	 * @returns The Be element for chaining.
	 */
	delete(keyOrObject: string | Record<string, string>): Be {
		this.beElement.eachNode((el) => {
			if (typeof keyOrObject === 'string') {
				// Deletes a single attribute
				delete el.dataset[keyOrObject];
			} else if (typeof keyOrObject === 'object') {
				// Deletes multiple attributes
				Object.keys(keyOrObject).forEach((key) => {
					delete el.dataset[key];
				});
			}
		});
		return this.beElement;
	}

	/**
	 * Retrieves the value of a specific `data-*` attribute.
	 * @param key - The key of the `data-*` attribute to retrieve.
	 * @returns The value of the attribute, or `null` if not found.
	 */
	getKey(key: string | string[]): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.inputNode as HTMLElement).dataset[key] || null;
	}

	/**
	 * Retrieves all `data-*` attributes as a DOMStringMap.
	 * @returns A DOMStringMap containing all `data-*` attributes, or `null` if not applicable.
	 */
	valueOf(): DOMStringMap | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.inputNode as HTMLElement).dataset;
	}
}
