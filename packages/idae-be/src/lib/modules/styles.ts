import { Be } from '../be.js';
import type { CommonHandler, HandlerCallBack } from '../types.js';

enum beStyleMethods {
	set = 'set',
	get = 'get',
	delete = 'delete',
	getKey = 'getKey'
}

export interface BeStylesHandler {
	set?: Record<string, string> | string;
	value?: string;
	get?: string;
	delete?: string;
	getKey?: string;
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

						// If value is provided, treat it as a single property setting
						/* if (value !== undefined) {
							this.applyStyle(styles, value);
						} */
					} else if (typeof args === 'object') {
						// Handle object input
						Object.entries(args).forEach(([prop, val]) => {
							this.applyStyle(prop, val);
						});
					}
					console.log({ method, args });
					break;
				case 'get':
					console.log({ method, args });
					break;
				case 'delete':
					break;
				case 'getKey':
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
			// Handle string input
			const styleEntries = styles.split(';').filter((s) => s.trim() !== '');
			styleEntries.forEach((entry) => {
				const [property, propertyValue] = entry.split(':').map((s) => s.trim());
				if (property && propertyValue) {
					this.applyStyle(property, propertyValue);
				}
			});

			// If value is provided, treat it as a single property setting
			if (value !== undefined) {
				this.applyStyle(styles, value);
			}
		} else if (typeof styles === 'object') {
			// Handle object input
			Object.entries(styles).forEach(([prop, val]) => {
				this.applyStyle(prop, val);
			});
		}

		return this.beElement;
	}
	// get style
	get(key: string): string | null {
		return '';
	}
	// unset style
	unset(key: string): string | null {
		return '';
	}
	//
	getKey(key: string): string | null {
		return '';
	}

	delete(key: string): string | null {
		return '';
	}

	private handlerFor(command: BeStylesHandlerMethods) {
		return (content: string | HTMLElement, callback: HandlerCallBack) =>
			this.handle({ [command]: content, callback });
	}

	private applyStyle(property: string, value: string): void {
		this.beElement.eachNode((el) => {
			el.style.setProperty(property, value);
		});
	}
}
