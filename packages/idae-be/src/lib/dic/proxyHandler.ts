import { createBe, type Be } from '$lib/be.js';

// Définition des presets avec des types constants
const examplePresets = {
	display: ['flex', 'grid', 'string'],
	position: ['absolute', 'fixed', 'static', 'relative'],
	margin: ['top', 'bottom', 'left', 'right']
} as const;

type ExamplePresets = typeof examplePresets;
type CssProperties = keyof ExamplePresets;
type CssValues = ExamplePresets[CssProperties][number];

export class DynamicHandler {
	private beElement: Be;
	private attr: string;

	constructor(element: Be, attr: string = 'style') {
		this.beElement = element;
		this.attr = attr;
	}

	private handler = {
		get: (target: DynamicHandler, prop: string) => {
			// Utiliser Reflect.get si la méthode existe sur la cible
			if (prop in target) {
				return Reflect.get(target, prop);
			}

			const matchSet = prop.match(/^set([A-Z]\w*)([A-Z]\w*)?$/);
			if (matchSet) {
				const [, mainProp, subProp] = matchSet;
				const cssProp = mainProp.toLowerCase();

				if (subProp) {
					const cssValue = subProp.toLowerCase();
					return () => {
						this.beElement.eachNode((el: HTMLElement) => {
							(el[this.attr] as any)[cssProp] = cssValue;
						});
					};
				} else {
					return (value?: string) => {
						this.beElement.eachNode((el: HTMLElement) => {
							if (value === undefined) {
								(el[this.attr] as any)[cssProp] = '';
							} else {
								(el[this.attr] as any)[cssProp] = value;
							}
						});
					};
				}
			}
			return undefined;
		}
	};

	public proxy(): DynamicHandler {
		return new Proxy(this, this.handler);
	}
}

// Utilisation
const div = createBe('div');
const styler = new DynamicHandler(div, 'style').proxy();

// Utilisation des méthodes dynamiques
styler.setDisplay('block');
styler.setDisplay(); // Réinitialise la propriété display
styler.setDisplayNone();
styler.setPosition('relative');
styler.setPositionAbsolute();
styler.setColor('red');
styler.setBackgroundColor('#f0f0f0');
styler.setFontSize('16px');
