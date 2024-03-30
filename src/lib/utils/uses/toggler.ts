let togglerService = {
	listenerSet: false
};

export function togglerSource(node: HTMLElement, props: { uid: string }) {
	node.addEventListener('click', onClick);

	if (!togglerService.listenerSet) {
		togglerService.listenerSet = true;
	}

	function onClick(e: Event) {
		e.stopPropagation();
		// show target
		const event = new CustomEvent('toggler:clicked', { detail: { uid: props.uid }, bubbles: true });
		document.dispatchEvent(event);
	}

	return {
		destroy() {
			node.removeEventListener('click', onClick);
		}
	};
}

export function togglerTarget(node: HTMLElement, props: { uid: string }) {
	document.addEventListener('toggler:clicked', onClick);

	function onClick(e: any) {
		if (e?.detail?.uid === props.uid)
			node.style.display = node.style.display === 'none' ? '' : 'none';
	}

	return {
		destroy() {
			document.removeEventListener('toggler:clicked', onClick);
		}
	};
}
