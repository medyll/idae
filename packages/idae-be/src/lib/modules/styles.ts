import { Be } from '../be.js';
import type { CommonHandler, HandlerCallBackFn } from '../types.js';

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

export class StylesHandler implements CommonHandler<StylesHandler> {
	private beElement: Be;

	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	static methods = Object.values(beStyleMethods);

	handle(actions: BeStylesHandler) {
		const { method, args } = this.resolveIndirection(actions);

		this.beElement.eachNode((el) => {
			switch (method) {
				case 'set':
					if (typeof args === 'string') {
						// Handle string input
						const styleEntries = args.split(';').filter((s) => s.trim() !== '');
						styleEntries.forEach((entry) => {
							const [property, propertyValue] = entry.split(':').map((s) => s.trim());
							if (property && propertyValue) {
								this.applyStyle(property, propertyValue);
							}
						});
					} else if (typeof args === 'object') {
						// Handle object input
						Object.entries(args).forEach(([prop, val]) => {
							this.applyStyle(prop, val);
						});
					} else {
						console.warn('Invalid argument type for set method');
					}
					break;
				case 'get':
					return this.get(args);
					break;
				case 'unset':
					this.unset(args);
					break;
			}
		});

		return this.beElement;
	}

	private resolveIndirection(actions: BeStylesHandler): {
		method: BeStylesHandlerMethods;
		args: any;
	} {
		let method;
		let args;
		Object.keys(actions).forEach((action: unknown) => {
			if (StylesHandler.methods.includes(action)) {
				method = action;
				args = actions[action];
			}
		});
		return { method, args };
	}
	/**
	 * setStyle Sets one or more CSS styles for the selected element(s), including CSS custom properties.
	 * @param styles An object of CSS properties and values, or a string of CSS properties and values.
	 * @param value The value for a single CSS property when styles is a property name string.
	 * @returns The Be instance for method chaining.
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
	 * getStyle Gets the value of a CSS property for the first matched element.
	 * @param key The CSS property name.
	 * @returns The value of the CSS property, or null if not found.
	 */
	get(key: string): string | null {
		let css: string | null = null;
		this.beElement.eachNode((el) => {
			css = el.style[key as any] || null;

			if (!css) {
				const computedStyle = window.getComputedStyle(el);
				css = computedStyle.getPropertyValue(key).trim();
			}
		}, true);
		return css || null;
	}
	// unset style
	unset(key: string): string | null {
		this.beElement.eachNode((el) => {
			el.style.removeProperty(key);
		});
		return null;
	}

	private applyStyle(property: string, value: string): void {
		this.beElement.eachNode((el) => {
			el.style[property] = value;
			// el.style.setProperty(property, value);
			// console.log(`Setting style ${property}: ${value}`);
		});
	}

	getKey(key: string): string | null {
		let value: string | null = null;
		this.beElement.eachNode((el) => {
			value = el.style.getPropertyValue(key) || null;
		});
		return value;
	}
}
