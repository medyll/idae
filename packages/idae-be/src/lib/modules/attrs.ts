import { Be } from '../be.js';
import type { CommonHandler } from '../types.js';

enum attrMethods {
	set = 'set',
	get = 'get',
	delete = 'delete'
}

export type AttrHandlerHandle = {
	set: AttrHandler['set'];
	get: AttrHandler['get'];
	delete: AttrHandler['delete'];
};

/**
 * Handles attribute operations for Be elements.
 */
export class AttrHandler implements CommonHandler<AttrHandler, AttrHandler> {
	private beElement: Be;

	static methods = Object.values(attrMethods);

	/**
	 * Initializes the AttrHandler with a Be element.
	 * @param element - The Be element to operate on.
	 */
	constructor(element: Be) {
		this.beElement = element;
	}

	/**
	 * Handles dynamic method calls for attribute operations.
	 * @param actions - The actions to perform (e.g., set, get, delete).
	 * @returns The Be element for chaining.
	 */
	handle(actions: Partial<AttrHandlerHandle>): Be {
		Object.entries(actions).forEach(([method, props]) => {
			switch (method) {
				case 'set':
					this.set(props);
					break;
				case 'delete':
					this.delete(props);
					break;
			}
		});
		return this.beElement;
	}

	/**
	 * Retrieves the value of an attribute.
	 * @param name - The name of the attribute to retrieve.
	 * @returns The value of the attribute, or `null` if not found.
	 * @example
	 * // HTML: <div id="test" data-role="admin"></div>
	 * const beInstance = be('#test');
	 * const role = beInstance.getAttr('data-role');
	 * console.log(role); // Output: "admin"
	 */
	get(name?: string): string | null {
		if (typeof this.beElement.inputNode === 'string')
			return (
				document.querySelector(this.beElement.inputNode || '')?.getAttribute(name || '') || null
			);
		if (this.beElement.isWhat !== 'element') return null;
		const el = this.beElement.inputNode as HTMLElement;

		return name ? el.getAttribute(name) : null;
	}

	/**
	 * Sets one or more attributes on the element(s).
	 * @param nameOrObject - A key-value pair or an object containing multiple key-value pairs.
	 * @param value - The value to set if a single key is provided.
	 * @returns The Be element for chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.setAttr('data-role', 'admin'); // Sets a single attribute
	 * beInstance.setAttr({ class: 'highlight', title: 'Hello' }); // Sets multiple attributes
	 */
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

	/**
	 * Deletes one or more attributes from the element(s).
	 * @param nameOrObject - A key or an object containing multiple keys to delete.
	 * @returns The Be element for chaining.
	 * @example
	 * // HTML: <div id="test" data-role="admin" class="highlight"></div>
	 * const beInstance = be('#test');
	 * beInstance.deleteAttr('data-role'); // Deletes a single attribute
	 * beInstance.deleteAttr({ class: '' }); // Deletes multiple attributes
	 */
	delete(nameOrObject: string | Record<string, string>): Be {
		this.beElement.eachNode((el) => {
			if (typeof nameOrObject === 'string') {
				el.removeAttribute(nameOrObject);
			} else if (typeof nameOrObject === 'object') {
				Object.entries(nameOrObject).forEach(([name]) => {
					el.removeAttribute(name);
				});
			}
		});
		return this.beElement;
	}

	/**
	 * Retrieves all attributes as a key-value pair object.
	 * @returns An object containing all attributes, or `null` if not applicable.
	 * @example
	 * // HTML: <div id="test" data-role="admin" class="highlight"></div>
	 * const beInstance = be('#test');
	 * const attributes = beInstance.attrs.valueOf();
	 * console.log(attributes); // Output: { id: "test", "data-role": "admin", class: "highlight" }
	 */
	valueOf(): Record<string, string> | null {
		if (this.beElement.isWhat !== 'element') return null;
		const el = this.beElement.inputNode as HTMLElement;
		const attrs: Record<string, string> = {};
		for (let i = 0; i < el.attributes.length; i++) {
			const attr = el.attributes[i];
			attrs[attr.name] = attr.value;
		}
		return attrs;
	}
}
