type ClickAwayProps = {
	parent?: HTMLElement | string;
	action?: () => void;
	disabled?: boolean;
};

export function clickAway(node: HTMLElement, props: ClickAwayProps) {
	const { action, disabled } = props;

	// treat outside click
	document.addEventListener('click', doEvent, true);

	function doEvent(event: any) {
		const bounds = node.getBoundingClientRect();

		let inner =
			event.pageX > bounds.left &&
			event.pageX < bounds.right &&
			event.pageY > bounds.top &&
			event.pageY < bounds.bottom;

		// console.log(inner)
		if (!disabled) {
			if (action && !inner) {
				action();
				const event = new CustomEvent('clickAway', { bubbles: true });
				node?.dispatchEvent(event);
				document.removeEventListener('click', doEvent, true);
			}
		}
	}

	return {
		destroy() {
			document.removeEventListener('click', doEvent, true);
		}
	};
}
