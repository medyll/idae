import { Be } from '../be.js';
import type { CommonHandler } from '../types.js';

enum beStyleMethods {
	set = 'set',
	get = 'get',
	unset = 'unset'
}

export interface BeStylesHandler {
	set?: Record<string, string> | string;
	get?: string;
	unset?: string;
}

export type BeStylesHandlerMethods = keyof typeof beStyleMethods;

export class StylesHandler implements CommonHandler<StylesHandler, Partial<BeStylesHandler>> {
	private beElement: Be;

	constructor(beElement: Be) {
		this.beElement = beElement;
	}
	methods: string[] = Object.keys(beStyleMethods);

	valueOf(): string {
		return `[StylesHandler: ${this.methods.join(', ')}]`;
	}

	static methods = Object.values(beStyleMethods);

	handle(actions: Partial<BeStylesHandler>) {
		const { method, args } = this.resolveIndirection(actions);

		this.beElement.eachNode(() => {
			switch (method) {
				case 'set':
					this.set(args as Record<string, string> | string);
					break;
				case 'get':
					this.get(args as string);
					break;
				case 'unset':
					this.unset(args as string);
					break;
			}
		});

		return this.beElement;
	}

	private resolveIndirection(actions: BeStylesHandler): {
		method: BeStylesHandlerMethods;
		args: string | Record<string, string> | undefined;
	} {
		let method: BeStylesHandlerMethods = 'get'; // Default to 'get' or any valid method
		let args;
		Object.keys(actions).forEach((action: unknown) => {
			const actionKey = action as string;
			if (StylesHandler.methods.includes(actionKey as beStyleMethods)) {
				method = actionKey as BeStylesHandlerMethods;
				args = actions[actionKey as keyof BeStylesHandler];
			}
		});
		return { method: method as BeStylesHandlerMethods, args };
	}
	/**
	 * Sets one or more CSS styles for the selected element(s), including CSS custom properties.
	 * @param styles - An object of CSS properties and values, or a string of CSS properties and values.
	 * @param value - The value for a single CSS property when styles is a property name string.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test"></div>
	 * const beInstance = be('#test');
	 * beInstance.setStyle({ color: 'red', backgroundColor: 'blue' }); // Sets multiple styles
	 * beInstance.setStyle('color', 'green'); // Sets a single style
	 */
	set(styles: Record<string, string> | string, value?: string): Be {
		if (typeof styles === 'string') {
			// Handle string input,   if contains ':' and use cssText
			if (styles.includes(':')) {
				this.beElement.eachNode((el) => {
					el.style.cssText = styles;
				});
			} else {
				// If value is provided, treat it as a single property setting
				this.applyStyle(styles, value ?? '');
			}
		} else if (typeof styles === 'object') {
			// Handle object input
			Object.entries(styles).forEach(([prop, val]) => {
				this.applyStyle(prop, val);
			});
		}

		return this.beElement;
	}
	/**
	 * Gets the value of a CSS property for the first matched element.
	 * @param key - The CSS property name.
	 * @returns The value of the CSS property, or null if not found.
	 * @example
	 * // HTML: <div id="test" style="color: red;"></div>
	 * const beInstance = be('#test');
	 * const color = beInstance.getStyle('color');
	 * console.log(color); // Output: "red"
	 */
	/**
	 * Gets the inline value of a CSS property for the first matched element.
	 * Only inline styles (set via `setStyle` or the `style` attribute) are read —
	 * values coming from stylesheets are not resolved, so a property that was
	 * never set (or was removed with `unsetStyle`) returns null.
	 * @param key - The CSS property name (camelCase or kebab-case).
	 * @returns The value of the CSS property, or null if not set inline.
	 * @example
	 * // HTML: <div id="test" style="color: red;"></div>
	 * const beInstance = be('#test');
	 * const color = beInstance.getStyle('color');
	 * console.log(color); // Output: "red"
	 */
	get(key: string): string | null {
		let css: string | null = null;
		this.beElement.eachNode((el) => {
			css = el.style.getPropertyValue(toKebabCase(key)).trim() || null;
		}, true);
		return css;
	}
	/**
	 * Removes a CSS property from the selected element(s).
	 * @param key - The CSS property name to remove.
	 * @returns The Be instance for method chaining.
	 * @example
	 * // HTML: <div id="test" style="color: red;"></div>
	 * const beInstance = be('#test');
	 * beInstance.unsetStyle('color'); // Removes the "color" style
	 */
	unset(key: string): Be {
		this.beElement.eachNode((el) => {
			el.style.removeProperty(key);
		});
		return this.beElement;
	}

	private applyStyle(property: string, value: string): void {
		this.beElement.eachNode((el) => {
			const kebabProperty = toKebabCase(property);
			el.style.setProperty(kebabProperty, value);
		});
	}

	private getKey(key: string): string | null {
		let value: string | null = null;
		this.beElement.eachNode((el) => {
			value = el.style.getPropertyValue(key) || null;
		});
		return value;
	}
}

function toKebabCase(property: string): string {
	return property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
