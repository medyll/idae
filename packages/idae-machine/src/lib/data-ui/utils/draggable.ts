/**
 * Svelte action — make a node draggable by pointer.
 * Drag handle = descendant matching `[data-drag-handle]`, else the whole node.
 * Moves via top/left so it composes with `position: fixed`.
 */
export interface DraggableOptions {
	disabled?: boolean;
	handle?: string;
}

export function draggable(node: HTMLElement, options: DraggableOptions = {}) {
	let { disabled = false, handle = '[data-drag-handle]' } = options;
	let moving = false;
	let left = node.offsetLeft;
	let top = node.offsetTop;

	const getTarget = (): HTMLElement => (handle ? (node.querySelector(handle) as HTMLElement) : node) ?? node;
	let target = getTarget();
	target.style.userSelect = 'none';
	target.style.cursor = 'grab';

	function onPointerDown(e: PointerEvent) {
		if (disabled || e.button !== 0) return;
		moving = true;
		left = node.offsetLeft;
		top = node.offsetTop;
		target.style.cursor = 'grabbing';
		window.addEventListener('pointermove', onPointerMove, true);
		window.addEventListener('pointerup', onPointerUp, true);
	}

	function onPointerMove(e: PointerEvent) {
		if (!moving) return;
		left += e.movementX;
		top += e.movementY;
		node.style.left = `${left}px`;
		node.style.top = `${top}px`;
	}

	function onPointerUp() {
		moving = false;
		target.style.cursor = 'grab';
		window.removeEventListener('pointermove', onPointerMove, true);
		window.removeEventListener('pointerup', onPointerUp, true);
	}

	target.addEventListener('pointerdown', onPointerDown, true);

	return {
		update(next: DraggableOptions = {}) {
			disabled = next.disabled ?? false;
			if (next.handle !== undefined && next.handle !== handle) {
				target.removeEventListener('pointerdown', onPointerDown, true);
				handle = next.handle;
				target = getTarget();
				target.style.userSelect = 'none';
				target.style.cursor = 'grab';
				target.addEventListener('pointerdown', onPointerDown, true);
			}
		},
		destroy() {
			target.removeEventListener('pointerdown', onPointerDown, true);
			window.removeEventListener('pointermove', onPointerMove, true);
			window.removeEventListener('pointerup', onPointerUp, true);
		}
	};
}

/** Center `node` in the viewport. */
export function centerInViewport(node: HTMLElement) {
	const rect = node.getBoundingClientRect();
	node.style.left = `${Math.max(0, (window.innerWidth - rect.width) / 2)}px`;
	node.style.top = `${Math.max(0, (window.innerHeight - rect.height) / 2)}px`;
}
