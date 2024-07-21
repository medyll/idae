import { type Be, createBe } from './be.js';

interface isHTMLReturn {
	isHtml: boolean;
	tag: string;
	attributes: { [key: string]: string };
	styles: { [key: string]: string };
	node: HTMLElement;
	beElem?: Be;
	content?: string;
}

export class BeUtils {
	static isHTML(
		str: string | HTMLElement,
		options: {
			returnHTMLelement?: boolean;
			transformTextToHtml?: boolean;
		}
	): isHTMLReturn {
		const result: isHTMLReturn = {
			isHtml: false,
			tag: '',
			attributes: {},
			styles: {},
			node: undefined,
			beElem: undefined
		};

		if (str instanceof HTMLElement) result.node = str;
		if (typeof str !== 'string') return result;
		const trimmed = str.trim();

		if (
			options.transformTextToHtml ||
			(trimmed.startsWith('<') && trimmed.endsWith('>') && trimmed.includes('</'))
		) {
			result.isHtml = true;

			// extract tag
			const tagMatch = trimmed.match(/<(\w+)/);
			result.tag = tagMatch?.[1] ?? 'span';

			// extract attributes
			const attributesMatch = trimmed.match(/<\w+\s+([^>]+)>/);
			if (attributesMatch) {
				const attributesString = attributesMatch[1];
				const attributeRegex = /(\w+)(?:="([^"]*)")?/g;
				let match;
				while ((match = attributeRegex.exec(attributesString)) !== null) {
					const [, key, value] = match;
					if (key === 'style') {
						// Traiter les styles séparément
						const styleRegex = /(\w+-?\w+)\s*:\s*([^;]+)/g;
						let styleMatch;
						while ((styleMatch = styleRegex.exec(value)) !== null) {
							const [, styleName, styleValue] = styleMatch;
							result.styles[styleName] = styleValue.trim();
						}
					} else {
						result.attributes[key] = value || '';
					}
				}
			}

			if (result.isHtml && options.returnHTMLelement) {
				const html = str.replace(/<[^>]+>/, '').replace(/<\/[^>]+>$/, '');

				result.beElem = createBe(result.tag);
				result.beElem.update(html);

				if (result.styles) result.beElem.setStyle(result.styles);
				// if (result?.attributes) result.beElem.setAttr(result?.attributes);

				const newElement: HTMLElement = document.createElement(result.tag);
				newElement.innerHTML = html;
				result.node = newElement;
			}
		}

		if (options.transformTextToHtml && !result.isHtml) {
			const newElement: HTMLElement = document.createElement('span');
			newElement.innerHTML = str;
			result.node = newElement;
		}

		return result;
	}

	static calculateAnchorPoint(rect: DOMRect, anchor: string): [number, number] {
		const [vertical, horizontal] = anchor.split(' ');
		let x: number, y: number;

		switch (vertical) {
			case 'top':
				y = rect.top;
				break;
			case 'bottom':
				y = rect.bottom;
				break;
			case 'center':
				y = rect.top + rect.height / 2;
				break;
			default:
				y = rect.top;
		}

		switch (horizontal) {
			case 'left':
				x = rect.left;
				break;
			case 'right':
				x = rect.right;
				break;
			case 'center':
				x = rect.left + rect.width / 2;
				break;
			default:
				x = rect.left;
		}

		return [x, y];
	}

	static applyStyle(beElement: Be, property: string, value: string): void {
		beElement.eachNode((el) => {
			el.style.setProperty(property, value);
		});
	}

	static applyCallback(el: HTMLElement | HTMLCollection, callback: (el: HTMLElement) => void) {
		if (el instanceof HTMLCollection) {
			return Array.from(el).forEach((ss) => {
				BeUtils.applyCallback(ss, callback);
			});
		} else {
			return callback(el);
		}
	}

	static resolveIndirection<T = CommonHandler>(
		classHandler: CommonHandler,
		actions: keyof T
	): {
		method: keyof T;
		props: any;
	} {
		let method: keyof T;
		let props;

		Object.keys(actions).forEach((action) => {
			if (classHandler.methods.includes(action)) {
				method = action;
				props = actions[action as keyof T];
			}
		});

		return { method, props };
	}
}

export interface CommonHandler<T> {
	methods: string[] | keyof T;
}
