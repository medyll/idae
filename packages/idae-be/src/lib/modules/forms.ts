import { Be } from '../be.js';
import type { CommonHandler, HandlerCallBackFn } from '../types.js';

enum formMethods {
	serialize = 'serialize',
	getElements = 'getElements',
	getValue = 'getValue'
}

export interface FormSerializeOptions {
	/** Return a plain object instead of a URL-encoded query string. */
	asJSON?: boolean;
}

export interface FormHandlerHandle {
	serialize?: { options?: FormSerializeOptions; callback?: HandlerCallBackFn };
	getElements?: { callback?: HandlerCallBackFn };
	getValue?: { callback?: HandlerCallBackFn };
}

export type FormFieldValue = string | string[] | boolean;

/**
 * Handles form operations for Be elements: serialization, element access and
 * per-field value extraction.
 */
export class FormHandler implements CommonHandler<FormHandler, FormHandlerHandle> {
	private beElement: Be;

	static methods = Object.values(formMethods);

	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	methods: string[] = FormHandler.methods;

	/**
	 * Handles form actions.
	 * @param actions - The actions to perform.
	 * @returns The Be instance (root) for method chaining.
	 */
	handle(actions: FormHandlerHandle): Be {
		Object.entries(actions).forEach(([method, props]) => {
			switch (method) {
				case 'serialize':
					this.serialize(props.options, props.callback);
					break;
				case 'getElements':
					this.getElements(props.callback);
					break;
				case 'getValue':
					this.getValue(props.callback);
					break;
			}
		});

		return this.beElement;
	}

	/**
	 * Serializes the form's fields. Disabled and nameless fields are skipped;
	 * only checked checkboxes/radios are included; `<select multiple>` produces
	 * repeated entries (query string) or an array of values (asJSON).
	 * @param options - Optional `{ asJSON }` flag.
	 * @param callback - Optional callback receiving the serialized value as `fragment`.
	 * @returns A URL-encoded string by default, a plain object when `asJSON`.
	 * @example
	 * be('#myForm').serializeForm(); // "name=john&tags=a&tags=b"
	 * be('#myForm').serializeForm({ asJSON: true }); // { name: 'john', tags: ['a', 'b'] }
	 */
	serialize(
		options?: FormSerializeOptions,
		callback?: HandlerCallBackFn
	): string | Record<string, unknown> {
		const fields = this.collectFields();

		let result: string | Record<string, unknown>;
		if (options?.asJSON) {
			const obj: Record<string, unknown> = {};
			for (const [name, value] of fields) {
				if (name in obj) {
					const current = obj[name];
					obj[name] = Array.isArray(current) ? [...current, value] : [current, value];
				} else {
					obj[name] = value;
				}
			}
			result = obj;
		} else {
			const params = new URLSearchParams();
			for (const [name, value] of fields) {
				params.append(name, value);
			}
			result = params.toString();
		}

		callback?.({
			fragment: result,
			be: this.beElement,
			root: this.beElement
		});

		return result;
	}

	/**
	 * Returns the form's elements (`Array.from(form.elements)`).
	 * @param callback - Optional callback receiving the elements array as `fragment`.
	 * @returns The form elements.
	 */
	getElements(callback?: HandlerCallBackFn): HTMLElement[] {
		const ret: HTMLElement[] = [];
		this.beElement.eachNode((el) => {
			if (el instanceof HTMLFormElement) {
				ret.push(...(Array.from(el.elements) as HTMLElement[]));
			}
		});

		callback?.({
			fragment: ret,
			be: this.beElement,
			root: this.beElement
		});

		return ret;
	}

	/**
	 * Returns the value of a single field the Be instance wraps. The extraction
	 * rule differs by input type: checkbox/radio → checked state,
	 * `<select multiple>` → array of selected values, everything else → `.value`.
	 * @param callback - Optional callback receiving the value as `fragment`.
	 * @returns The field value, or undefined when no field is wrapped.
	 * @example
	 * be('#agree').fieldValue(); // true (checked checkbox)
	 * be('#tags').fieldValue(); // ['a', 'b'] (multi-select)
	 */
	getValue(callback?: HandlerCallBackFn): FormFieldValue | undefined {
		let value: FormFieldValue | undefined;

		this.beElement.eachNode((el) => {
			if (value !== undefined) return;

			if (el instanceof HTMLSelectElement && el.multiple) {
				value = Array.from(el.selectedOptions).map((option) => option.value);
			} else if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
				value = el.checked;
			} else if (
				el instanceof HTMLInputElement ||
				el instanceof HTMLSelectElement ||
				el instanceof HTMLTextAreaElement
			) {
				value = el.value;
			}
		}, true);

		callback?.({
			fragment: value,
			be: this.beElement,
			root: this.beElement
		});

		return value;
	}

	/**
	 * Collects [name, value] pairs from every wrapped form, applying the
	 * standard submission rules (skip disabled/nameless, only checked
	 * checkboxes/radios, every selected option of multi-selects).
	 */
	private collectFields(): [string, string][] {
		const pairs: [string, string][] = [];

		this.beElement.eachNode((el) => {
			const fields =
				el instanceof HTMLFormElement
					? (Array.from(el.elements) as HTMLElement[])
					: FormHandler.isField(el)
						? [el]
						: [];

			for (const field of fields) {
				if (!FormHandler.isField(field)) continue;
				const name = field.name;
				if (!name || field.disabled) continue;

				if (field instanceof HTMLInputElement && (field.type === 'checkbox' || field.type === 'radio')) {
					if (field.checked) pairs.push([name, field.value]);
				} else if (field instanceof HTMLSelectElement && field.multiple) {
					for (const option of Array.from(field.selectedOptions)) {
						pairs.push([name, option.value]);
					}
				} else if (field instanceof HTMLInputElement && (field.type === 'submit' || field.type === 'button' || field.type === 'reset' || field.type === 'file')) {
					// not serialized
				} else {
					pairs.push([name, field.value]);
				}
			}
		});

		return pairs;
	}

	private static isField(
		el: HTMLElement
	): el is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
		return (
			el instanceof HTMLInputElement ||
			el instanceof HTMLSelectElement ||
			el instanceof HTMLTextAreaElement
		);
	}

	valueOf(): Be {
		return this.beElement;
	}
}
