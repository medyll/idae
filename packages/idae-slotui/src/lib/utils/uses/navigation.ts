export type Props = {
	className: string;
	selectedIndex: number;
};

export function navigation(node: HTMLElement, props: Props) {
	const { className } = props;

	let selectedIndex = props.selectedIndex ?? -1;
	node.addEventListener('keydown', preNavigate);
	node.addEventListener('click', () => {
		node.focus();
	});

	node.addEventListener('menu:navigate', ((e: CustomEvent<KeyboardEvent>) => {
		preNavigate(e.detail);
	}) as EventListener);

	node?.addEventListener('menu:gotoIndex', ((e: CustomEvent<{ selectedIndex: number }>) => {
		let menuItems = Array.from(node.querySelectorAll('.' + className));
		if (menuItems[e.detail.selectedIndex]) {
			scrollToElement(menuItems[e.detail.selectedIndex] as HTMLElement);
		}
		node.focus();
	}) as EventListener);

	function preNavigate(e: KeyboardEvent) {
		if (e.keyCode === 13) return;

		if (![38, 40].includes(e.keyCode)) return false;
		if ([38, 40].includes(e.keyCode)) e.preventDefault();
		const dir = e.keyCode === 38 ? 'prev' : 'next';
		let menuItems = Array.from(node.querySelectorAll('.' + className));
		let navElement = navigateToItem(selectedIndex, dir);
		if (navElement) selectedIndex = menuItems.indexOf(navElement);
		scrollToElement(navElement as HTMLElement);

		node.dispatchEvent(new CustomEvent('menu:onnavigate', { detail: { selectedIndex } }));
	}

	function navigateToItem(currentIndex: number, dir: 'next' | 'prev') {
		if (currentIndex == -1) currentIndex = 0;

		let menuItems = Array.from(node.querySelectorAll('.' + className));

		let navElement;
		if (dir === 'next') {
			navElement = nextItem(menuItems[currentIndex], className);
		} else {
			navElement = previousItem(menuItems[currentIndex], className);
		}

		return navElement;
	}

	function nextItem(node: Element, className: string) {
		let sibling = node.nextElementSibling;
		while (sibling) {
			if (sibling.classList.contains(className)) {
				return sibling;
			}
			sibling = sibling.nextElementSibling;
		}
		return node.parentElement.querySelector('.menuListItem') as Element;
	}

	function previousItem(node: Element, className: string) {
		let sibling = node.previousElementSibling;
		while (sibling) {
			if (sibling.classList.contains(className)) {
				return sibling;
			}
			sibling = sibling.previousElementSibling;
		}
		node.parentElement.querySelector('.menuListItem') as Element;
	}

	function scrollToElement(target: HTMLElement) {
		if (target) {
			const tD = target.getBoundingClientRect();
			const sD = node.getBoundingClientRect();
			if (tD.top - 10 <= sD.top || tD.bottom >= sD.bottom) {
				target.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}
	}

	return {
		update() {},
		destroy() {}
	};
}
