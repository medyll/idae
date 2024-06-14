import type { SvelteComponent } from 'svelte';
import { openPopper } from './actions.js';
import type { PopperPositionType } from './types.js';

export type UsePopperProps = {
	code?: string;
	component?: SvelteComponent | any;
	componentProps?: {};
	content?: any;
	parentNode?: HTMLElement | any;
	position?: PopperPositionType;
	disabled?: boolean;
};

/** adds click action to parentNode */
export function popper(node: HTMLElement, props?: UsePopperProps | undefined) {
	if (!props) return false;
	if (Boolean(props?.disabled)) return false;

	const { parentNode = undefined, position = 'R', code = crypto.randomUUID() } = props;

	const doPopperEvent = function (event: any) {
		event.stopPropagation();
		event.preventDefault();

		openPopper(code, { ...props, parentNode: node });
	};

	node.addEventListener('click', doPopperEvent);

	return {
		destroy() {
			node.removeEventListener('click', doPopperEvent);
		},
		update(args: any) {
			// fire event to parentNode
			const event = new CustomEvent('popper:closed', { bubbles: true });
			if (parentNode) parentNode.dispatchEvent(event);
		}
	};
}
