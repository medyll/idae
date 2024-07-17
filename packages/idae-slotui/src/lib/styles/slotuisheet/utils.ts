import sharedConfigCss from './containerConfig.css?raw';

interface ContainerItemProps {
	class: string;
	style?: string;
}
export const configCssVars = parseCSSVariables(sharedConfigCss);
export type ContainerQueryConfig = typeof configCssVars;

export const containerQueryConfig: ContainerQueryConfig = {
	...configCssVars,
	containerItem: 'container-item',
	onContainer: 'on-container',
	hideSelector: 'hide',
	showSelector: 'show',
	more: 'more',
	than: 'than'
};

export function parseCSSVariables(cssContent: string): Record<string, string> {
	const variables: Record<string, string> = {};
	const regex = /--([^:]+):\s*([^;]+);/g;
	let match;

	while ((match = regex.exec(cssContent)) !== null) {
		const [, name, value] = match;
		variables[name.trim()] = value.trim();
	}

	return variables;
}

export const containerQueryProps = {
	hideMaxWidth: 'hide-max-width',
	hideMinWidth: 'hide-min-width',
	hideMaxHeight: 'hide-max-height',
	hideMinHeight: 'hide-min-height'
} as const;

export function toContainerQuery(
	attribute: keyof typeof containerQueryProps,
	value?: string,
	config = containerQueryConfig
) {
	let castAttribute = containerQueryProps[attribute];

	const regexPattern = new RegExp(
		`^${config.containerItem}-(${config.showSelector}|${config.hideSelector})-(max|min)-(width|height)$`
	);

	const match = `${config.containerItem}-${castAttribute}`.match(regexPattern);

	if (match) {
		const [, showHide, maxMin, dimension] = match;
		const isMax = maxMin === 'max';

		const cssVariable = `--${showHide}-${config.onContainer}-${dimension}-${isMax ? `${config.more}-${config.than}` : `${config.less}-${config.than}`}`;

		return {
			class: `${config.containerItem}-${castAttribute}`, // add class to element
			style: value ? `${cssVariable}: ${value};` : undefined // add style to element
		};
	}

	return null;
}
