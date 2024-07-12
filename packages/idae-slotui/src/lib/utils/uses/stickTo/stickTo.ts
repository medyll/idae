// import { Position } from '$lib/engine/presets.js';
enum Position {
	TC = 'TC', // Top Center
	TL = 'TL', // Top Left
	TR = 'TR', // Top Right
	BC = 'BC', // Bottom Center
	BL = 'BL', // Bottom Left
	BR = 'BR', // Bottom Right
	T = 'T', // align on Top
	R = 'R', // align on Right
	B = 'B', // align on Bottom
	L = 'L', // align on Left
	C = 'C' // align on Center
}

export type StickToPositionType = keyof typeof Position;

type StickToProps = {
	parentNode: HTMLElement;
	position?: StickToPositionType;
	disabled?: boolean;
	stickToHookWidth?: boolean;
};
/** @type {import('svelte/action').Action<HTMLElement, StickToProps>}  */
export function stickTo(node: HTMLElement, props: StickToProps) {
	let { parentNode, position, stickToHookWidth } = props;
	let nodeObserver: ResizeObserver;
	let parentObserver: ResizeObserver;

	if (node && parentNode) {
		init(props);
	}

	function init(props: StickToProps) {
		parentNode = props.parentNode;
		position = props.position;
		stickToHookWidth = props.stickToHookWidth;

		if (node && props.parentNode) {
			document.body.appendChild(node);
			setPosition(node, props.position, props.parentNode);

			scrollObserver();

			nodeObserver = new ResizeObserver(() => {
				setPosition(node, props.position, props.parentNode);
			});
			nodeObserver.observe(node);

			parentObserver = new ResizeObserver(() => {
				setPosition(node, props.position, props.parentNode);
			});
			parentObserver.observe(props.parentNode);
		}
	}

	function scrollObserver() {
		const scrollableContainers = getScrollParent(node);
		scrollableContainers.forEach((el) => {
			el.addEventListener('scroll', () => {
				setPosition(node, position, parentNode);
			});
		});
	}
	function getScrollParent(node: HTMLElement) {
		let scrollableContainers: HTMLElement[] = [];
		let el: HTMLElement = parentNode;

		while (el && el !== document.body) {
			let computedStyle = getComputedStyle(el);
			if (computedStyle.overflowY === 'auto' || computedStyle.overflowY === 'scroll') {
				if (!scrollableContainers.includes(el)) scrollableContainers.push(el);
			}
			el = el.parentElement ?? window.document.body; // Passez au parent
		}

		return scrollableContainers;
	}

	function checkBoundaries(node: HTMLElement, parentNode: HTMLElement, position: string) {
		const nodePos = node.getBoundingClientRect();
		let newPos: string = position;

		window.requestAnimationFrame(() => {});
		const threshold = 32;
		//node.style.transition = 'all 0.05s ease-in-out';
		if (nodePos.bottom >= window.innerHeight - threshold) {
			newPos = newPos.replace('B', 'T');
		} else if (nodePos.top - threshold <= 0) {
			newPos = newPos.replace('T', 'B');
		}
		if (nodePos.right > window.innerWidth - threshold) {
			newPos = newPos.replace('R', 'L');
		} else if (nodePos.left - threshold <= 0) {
			newPos = newPos.replace('L', 'R');
		}

		return newPos;
	}

	function setMaxDimensions(node: HTMLElement, parentNode: HTMLElement) {
		const nodePos = node.getBoundingClientRect();
		const docWidth = document.documentElement.clientWidth;
		const docHeight = document.documentElement.clientHeight;

		const maxWidth = docWidth - nodePos.left;
		const maxHeight = docHeight - nodePos.top;

		node.style.maxWidth = maxWidth + 'px';
		node.style.maxHeight = maxHeight + 'px';
	}

	function setPosition(node: HTMLElement, position: any, parentNode: HTMLElement) {
		setMaxDimensions(node, parentNode);

		const parentPos = parentNode.getBoundingClientRect();

		const newPosition = checkBoundaries(node, parentNode, position);

		//window.requestAnimationFrame(() => {
		if (stickToHookWidth) node.style.minWidth = String(parentPos.width) + 'px';

		if (newPosition.includes(Position.T)) {
			node.style.top = String(parentPos.top - node.offsetHeight) + 'px';
		}
		if (newPosition.includes(Position.R)) {
			node.style.left = String(parentPos.right - node.offsetWidth) + 'px';
		}
		if (newPosition.includes(Position.B)) {
			node.style.top = String(parentPos.bottom) + 'px';
		}
		if (newPosition.includes(Position.L)) {
			node.style.left = String(parentPos.left) + 'px';
		}

		if (newPosition.includes(Position.C)) {
			node.style.left = String(parentPos.left + parentPos.width / 2 - node.offsetWidth / 2) + 'px';
		}
		//});
	}

	return {
		update(props: StickToProps) {
			if (nodeObserver) nodeObserver.disconnect();
			if (parentObserver) parentObserver.disconnect();
			window.removeEventListener('scroll', () => {
				setPosition(node, position, parentNode);
			});
			init(props);
		},
		destroy() {
			if (nodeObserver) nodeObserver.disconnect();
			if (parentObserver) parentObserver.disconnect();
			window.removeEventListener('scroll', () => {
				setPosition(node, position, parentNode);
			});
			node.remove();
		}
	};
}
