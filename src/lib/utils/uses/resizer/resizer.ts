interface ResizerProps {
	direction?: 'horizontal' | 'vertical' | 'multiple';
}

export const resizer = (node: HTMLElement, props: ResizerProps = {}) => {
	let handle: HTMLElement;
	let width = eval(node.style.width.replace('px', '')) ?? node.offsetWidth;
	let x = 0;

	const { direction = 'horizontal' } = props;

	let expanding: boolean | null = null;
	let start: number | null = null,
		initial: { x: number; width: number } | null = null;

	const eventStart = new CustomEvent('resizer:start', { bubbles: true });
	const eventEnd = new CustomEvent('resizer:end', { bubbles: true });

	const arrPool: string[] = [];
	let timer: any = null;

	if (node.parentNode) {
		node.parentNode.addEventListener('mousemove', expand);
		node.parentNode.addEventListener('mouseup', stopExpand);
	}

	if (!node.querySelector('data-resizer')) {
		handle = document.createElement('div');
		handle.setAttribute('data-resizer', 'true');
		handle.setAttribute(
			'style',
			'position:absolute;height:100%;right:0;cursor:col-resize;width:8px;background-color:transparent;z-index:10'
		);
		handle.innerHTML = '';
		node.appendChild(handle);
	} else {
		handle = node.querySelector('data-resizer') ?? node;
	}

	if (handle) handle.addEventListener('mousedown', startExpand);

	async function expand(event: any) {
		if (!expanding) return;

		if (direction == 'horizontal') {
			if (start) {
				clearTimeout(timer);

				timer = setTimeout(() => {
					const delta = event.pageX - start;

					if (initial?.width) {
						width = initial.width + delta;
						node.style.width = width + 'px';
					}

					const eventResize = new CustomEvent('resizer:resize', {
						detail: { width },
						bubbles: true
					});
					node.dispatchEvent(eventResize);
				}, 10);
			}
		}
	}

	function startExpand(event: any) {
		// event.stopPropagation();
		// event.preventDefault();
		if (!expanding) {
			expanding = true;
			start = event.pageX;
			width = eval(node.style.width.replace('px', '')) ?? node.offsetWidth;
			initial = { x, width };
			node.dispatchEvent(eventStart);
		}
	}

	function stopExpand() {
		expanding = null;
		start = null;
		initial = null;
		node.dispatchEvent(eventEnd);
	}

	return {
		destroy() {
			if (handle) handle.removeEventListener('mousedown', startExpand);
			if (node.parentNode) {
				node.parentNode.removeEventListener('mousemove', expand);
				node.parentNode.removeEventListener('mouseup', stopExpand);
			}
		}
	};
};
