import { onDestroy } from 'svelte';

interface UseEventProps {
	event: string;
	action: (event?: any) => void;
	options?: boolean | AddEventListenerOptions;
}

export function onEvent(node: HTMLElement, props: UseEventProps) {
	node.addEventListener(props.event, props.action, props.options ?? true);

	return {
		update() {},
		destroy() {
			node.removeEventListener(props.event, props.action, true);
		}
	};
}
