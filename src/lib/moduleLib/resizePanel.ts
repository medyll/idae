type resizePanelOptions = {
	directions: ['vertical' | 'horizontal' | 'right' | 'left' | 'top' | 'bottom'];
	handleProps?: string[];
};

/**
 * Dispatches handle elements based on the input mask.
 *
 * @template M - The type of the mask key.
 * @template E - The type of the element.
 * @template A - The type of the value.
 *
 * @param inputMask - The input mask.
 * @param creatorFunction - The function to create the element based on the mask key.
 * @param apply - The function to apply the value to the element.
 */
function dispatchHandleElements<M extends string = string, E = Element, A = any>(
	inputMask: any[],
	creatorFunction: (maskKey: M, index: number) => E,
	apply: (element: E, value: A) => void
) {
	inputMask.forEach((maskKey, index) => {
		const element = creatorFunction(inputMask[index], maskKey);
		apply(element, inputMask[index]);
	});
}

export const resizePanel = (
	panel: Element,
	options: resizePanelOptions = {
		directions: ['right']
	}
) => {
	const { directions, handleProps = ['48px', '16px', '16px', '48px'] } = options;
	const [hw, hh, vw, vh] = handleProps;

	const resizeHandle = document.createElement('div');
	resizeHandle.classList.add('resize-handle');
	panel.appendChild(resizeHandle);

	let isResizing = false;
	let initialX = 0;
	let initialY = 0;
	let initialWidth = 0;
	let initialHeight = 0;

	const onDirection = (dx: number, dy: number) => {
		if (directions.includes('right') || directions.includes('horizontal')) {
			panel.style.width = `${initialWidth + dx}px`;
		}
		if (directions.includes('left') || directions.includes('horizontal')) {
			panel.style.width = `${initialWidth - dx}px`;
		}
		if (directions.includes('bottom') || directions.includes('vertical')) {
			panel.style.height = `${initialHeight + dy}px`;
		}
		if (directions.includes('top') || directions.includes('vertical')) {
			panel.style.height = `${initialHeight - dy}px`;
		}
	};

	dispatchHandleElements(
		directions,
		(direction, index) => createHandle(direction),
		(element, direction) => {
			panel.appendChild(element);
			element.addEventListener('mousedown', (event: MouseEvent) => {
				event.preventDefault();
				event.stopPropagation();
				const panelRect = panel.getBoundingClientRect();
				initialX = event.clientX;
				initialY = event.clientY;
				initialWidth = panelRect.width;
				initialHeight = panelRect.height;
				isResizing = true;
			});
		}
	);

	function createHandle(direction: string) {
		const handle = document.createElement('div');
		handle.classList.add('resize-handle');
		handle.classList.add(`resize-handle-${direction}`);
		switch (direction) {
			case 'vertical':
			case 'horizontal':
				handle.style.width = hw;
				handle.style.height = hh;
				break;
			case 'right':
			case 'left':
				handle.style.width = vw;
				handle.style.height = vh;
				break;
			case 'top':
			case 'bottom':
				handle.style.width = vw;
				handle.style.height = vh;
				break;
		}
		return handle;
	}

	window.addEventListener('mousemove', (event: MouseEvent) => {
		if (!isResizing) return;
		if (!isResizing) return;
		const dx = event.clientX - initialX;
		const dy = event.clientY - initialY;
		onDirection(dx, dy);
	});

	window.addEventListener('mouseup', (event: MouseEvent) => {
		isResizing = false;
	});
};
