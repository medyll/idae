import postcss from 'postcss';

// Étape 1 : Ajouter des propriétés personnalisées
const myPlugin = (root: postcss.Root) => {
	root.walkDecls((decl) => {
		console.log(`Propriété : ${decl.prop}`);
		console.log(`Valeur : ${decl.value}`);
		console.log(`Important : ${decl.important}`);
		console.log(
			`Source : ligne ${decl?.source?.start?.line}, colonne ${decl.source?.start?.column}`
		);
		// Ajoute un préfixe à toutes les propriétés
		decl.prop = 'my-prefix-' + decl.prop;
		// decl?.parent.append({ prop: 'my-prefix-' + decl.prop, value: decl.value });
	});
};

type all = string | number;
type top = string | number;
type bottom = string | number;
type left = string | number;
type right = string | number;

type cssProp = CSSPropertyRule;

const nodeType = ['all', 'top', 'bottom', 'left', 'right'];

const objModel = {
	outer: {
		display: ['flex', 'grid', 'string'],
		flow: ['absolute', 'fixed', 'static', 'relative', 'string', 'inherit', 'initial', 'unset'],
		pos: ['left', 'right', 'top', 'bottom', 'string'],
		margin: ['all', ['top', 'bottom'], ['top', 'bottom', 'left', 'right']]
	}
};

export interface OpCssF {
	outer: {
		display: 'flex' | 'grid' | string;
		flow: 'absolute' | 'fixed' | 'static' | 'relative' | string | 'inherit' | 'initial' | 'unset';
		pos: 'left' | 'right' | 'top' | 'bottom' | string;
		margin: [all] | [top, bottom] | [top, bottom, left, right];
	};

	animate: {
		all: 'all' | 'none' | cssProp;
		duration: string;
		timing: string;
		delay: string;
	};

	box: {
		border: [all] | [top, bottom] | [left, right] | [top, bottom, left, right];
		shadow: [string, string?, string?, string?];
		/**  Radius of the element   */
		radius: [string, string?, string?, string?];
		/**  Opacity of the element  from 0.0 to 1.0 */
		opacity: string | number;
	};

	size: {
		width: [string, string?, string?];
		height: [string, string?, string?];
		ratio: [string, string?];
	};

	typo: {
		font: string;
		size: string;
		style: 'bold' | 'italic' | 'normal' | string;
		underline: 'none' | 'dotted' | 'dashed' | 'solid' | 'double' | 'wavy' | string;
		shadow: [string, string?, string?, string?];
	};

	color: {
		text: string;
		bg: string;
	};

	gutter: {
		gap: string;
		padding: string;
	};
}

export class Op {
	outer(decl: postcss.Declaration) {
		return {
			display: (value: OpCssF['outer']['display']) => {},
			flow: (value: OpCssF['outer']['flow']) => {},
			pos: (value: OpCssF['outer']['pos']) => {},
			margin: (value: OpCssF['outer']['margin']) => {}
		};
	}
	box(decl: postcss.Declaration) {
		return {
			border: (value: OpCssF['box']['border']) => {},
			shadow: (value: OpCssF['box']['shadow']) => {},
			radius: (value: OpCssF['box']['radius']) => {}
		};
	}
	size(decl: postcss.Declaration) {
		return {
			width: (value: string, min: string, max: string) => {},
			height: (value: string, min: string, max: string) => {},
			ratio: (unit: string, quot: string) => {}
		};
	}
	color(decl: postcss.Declaration) {
		return {
			text: (value: string) => {},
			bg: (value: string) => {}
		};
	}
	margin(decl: postcss.Declaration) {
		return {
			gap: (value: string) => {},
			padding: (value: string) => {}
		};
	}
	typo(decl: postcss.Declaration) {
		return {
			font: (value: string) => {},
			size: (value: string) => {},
			style: (value: string) => {}
		};
	}
}
/* const processor = postcss([myPlugin]);

processor.process('a { color: black; }').then((result) => {
	console.log(result.css);
}); */

class cssGuide {
	static generateTsInterfaceAndClass(objModel: Record<string, any>, types: string[]) {
		// Helper function to convert array values to TypeScript union types
		const toUnionType = (arr) => {
			return arr
				.map((item) => (Array.isArray(item) ? `[${item.join(', ')}]` : `'${item}'`))
				.join(' | ');
		};

		let interfaces = 'export interface OpCssF {\n';
		let classMethods = 'export class Op {\n';

		for (const [outerKey, value] of Object.entries(objModel)) {
			interfaces += `  ${outerKey}: {\n`;
			classMethods += `  ${outerKey}(decl: postcss.Declaration) {\n    return {\n`;

			for (const [key, val] of Object.entries(value)) {
				if (Array.isArray(val)) {
					// Convert array to TypeScript union type
					interfaces += `    ${key}: ${toUnionType(val)};\n`;
					classMethods += `      ${key}: (value: OpCssF['${outerKey}']['${key}']) => {},\n`;
				}
			}

			interfaces += '  };\n';
			classMethods += '    };\n  }\n';
		}

		interfaces += '}\n';
		classMethods += '}\n';

		return { interfaces, classMethods };
	}
}

/* const { interfaces, classMethods } = cssGuide.generateTsInterfaceAndClass(objModel, nodeType);
console.log(interfaces);
console.log(classMethods); */
