type CombineElements<T extends string> = T extends any ? T | `${T} ${CombineElements<T>}` : never;
type IsWhat = 'element' | 'array' | 'qy';

type SnapToOptions =
	| 'top'
	| 'right'
	| 'bottom'
	| 'left'
	| `${'top' | 'right' | 'bottom' | 'left'} center`
	| 'center';

type DataHandlerHandle = {
	set: (keyOrObject: string | Record<string, string>, value?: string) => Be;
	delete: (keyOrObject: string | Record<string, string>, value?: string) => Be;
};

class DataHandler {
	private beElement: Be;

	constructor(element: Be) {
		this.beElement = element;
	}

	get(key: string): string | null {
		// if space in string
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).dataset[key] || null;
	}

	set(keyOrObject: string | Record<string, string>, value?: string): Be {
		this.beElement.each((el) => {
			if (typeof keyOrObject === 'string' && value !== undefined) {
				el.dataset[keyOrObject] = value;
			} else if (typeof keyOrObject === 'object') {
				Object.entries(keyOrObject).forEach(([key, val]) => {
					el.dataset[key] = val;
				});
			}
		});
		return this.beElement;
	}

	get beElem(): Be {
		return this.beElement;
	}
	handle(actions: Partial<DataHandlerHandle>): Be {
		this.beElement.each((el) => {
			if (actions.set) {
			}
			if (actions.delete) {
			}
		});
		return this.beElement;
	}

	valueOf(): DOMStringMap | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).dataset;
	}
}
class PropHandler {
	private element: Be;

	constructor(element: Be) {
		this.element = element;
	}

	get(name: string): any {
		if (this.element.isWhat !== 'element') return null;
		return (this.element.node as HTMLElement)[name];
	}

	set(nameOrObject: string | Record<string, any>, value?: any): Be {
		this.element.each((el) => {
			if (typeof nameOrObject === 'string' && value !== undefined) {
				el[nameOrObject] = value;
			} else if (typeof nameOrObject === 'object') {
				Object.entries(nameOrObject).forEach(([name, val]) => {
					el[name] = val;
				});
			}
		});
		return this.element;
	}

	valueOf(): Record<string, any> | null {
		if (this.element.isWhat !== 'element') return null;
		const el = this.element.node as HTMLElement;
		const props = {};
		for (let prop in el) {
			if (el.hasOwnProperty(prop)) {
				props[prop] = el[prop];
			}
		}
		return props;
	}
}

type DomHandlerHandle = {
	update?: string | HTMLElement;
	append?: string | HTMLElement;
	prepend?: string | HTMLElement;
	remove?: string | HTMLElement;
	replace?: string | HTMLElement;
	clear?: boolean;
};
class DomHandler {
	private beElement: Be;

	constructor(element: Be) {
		this.beElement = element;
	}

	get text(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).textContent;
	}

	/**
	 * Handles various DOM operations on the element(s).
	 * @param actions An object specifying the DOM actions to perform.
	 * @param actions.update - HTML content to update the element(s) with.
	 * @param actions.append - Content to append to the element(s).
	 * @param actions.prepend - Content to prepend to the element(s).
	 * @param actions.remove - If true, removes the element(s) from the DOM.
	 * @param actions.replace - Content to replace the element(s) with.
	 * @param actions.clear - If true, clears the content of the element(s).
	 * @returns The Be instance for method chaining.
	 */
	handle(actions: DomHandlerHandle): Be {
		this.beElement.each((el) => {
			if (actions.update !== undefined) {
				el.innerHTML = actions.update; /*  */
			}
			if (actions.append !== undefined) {
				if (typeof actions.append === 'string') {
					el.insertAdjacentHTML('beforeend', actions.append);
				} else {
					el.appendChild(actions.append);
				}
			}
			if (actions.prepend !== undefined) {
				if (typeof actions.prepend === 'string') {
					el.insertAdjacentHTML('afterbegin', actions.prepend);
				} else {
					el.insertBefore(actions.prepend, el.firstChild);
				}
			}
			if (actions.remove) {
				el.remove();
			}
			if (actions.replace !== undefined) {
				if (typeof actions.replace === 'string') {
					el.outerHTML = actions.replace;
				} else {
					el.parentNode?.replaceChild(actions.replace, el);
				}
			}
			if (actions.clear) {
				el.innerHTML = '';
			}
		});

		return this.beElement;
	}

	/**
	 * Updates the innerHTML of the element(s).
	 * @param content The HTML content to set.
	 * @returns The Be instance for method chaining.
	 */
	update(content: string): Be {
		return this.handle({ update: content });
	}

	updateText(content: string): Be {
		this.beElement.each((el) => {
			el.textContent = content;
		});
		return this.beElement;
	}

	/**
	 * Appends content to the selected elements.
	 *
	 * @param {string | HTMLElement} content - The content to append.
	 * If a string is provided, it will be parsed as HTML and inserted
	 * as the last child of each element. If an HTMLElement is provided,
	 * it will be appended as the last child of each element.
	 * @return {this} - The Be instance for method chaining.
	 */
	append(content: string | HTMLElement): Be {
		return this.handle({ append: content });
	}

	/**
	 * Prepends content to the element(s).
	 * @param content The content to prepend.
	 * @returns The Be instance for method chaining.
	 */
	prepend(content: string | HTMLElement): Be {
		return this.handle({ prepend: content });
	}

	/**
	 * Removes the element(s) from the DOM.
	 * @return {this} - The Be instance for method chaining.
	 */
	remove(): Be {
		return this.handle({ remove: true });
	}

	/**
	 * Replaces the element(s) with new content.
	 * @param content The content to replace the element(s) with.
	 * @returns The Be instance for method chaining.
	 */
	replace(content: string | HTMLElement): Be {
		return this.handle({ replace: content });
	}

	/**
	 * Clears the content of the element(s).
	 * @returns The Be instance for method chaining.
	 */
	clear(): Be {
		return this.handle({ clear: true });
	}

	valueOf(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).innerHTML;
	}
}

type AttrHandlerHandle = {
	set: AttrHandler['set'];
	delete: AttrHandler['handle'];
};
class AttrHandler {
	private beElement: Be;

	constructor(element: Be) {
		this.beElement = element;
	}

	get(name?: string): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		const el = this.beElement.node as HTMLElement;
		return name ? el.getAttribute(name) : null;
	}

	set(nameOrObject: string | Record<string, string>, value?: string): Be {
		this.beElement.each((el) => {
			if (typeof nameOrObject === 'string' && value !== undefined) {
				el.setAttribute(nameOrObject, value);
			} else if (typeof nameOrObject === 'object') {
				Object.entries(nameOrObject).forEach(([name, val]) => {
					el.setAttribute(name, val);
				});
			}
		});
		return this.beElement;
	}

	delete(nameOrObject: string | Record<string, string>): Be {
		this.beElement.each((el) => {
			if (typeof nameOrObject === 'string') {
				el.removeAttribute(nameOrObject);
			} else if (typeof nameOrObject === 'object') {
				Object.entries(nameOrObject).forEach(([name, val]) => {
					el.removeAttribute(name);
				});
			}
		});
		return this.beElement;
	}

	handle(actions: Partial<AttrHandlerHandle>): Be {
		this.beElement.each((el) => {
			if (actions.delete) {
			}
			if (actions.set) {
			}
		});
		return this.beElement;
	}

	valueOf(): Record<string, string> | null {
		if (this.beElement.isWhat !== 'element') return null;
		const el = this.beElement.node as HTMLElement;
		const attrs = {};
		for (let i = 0; i < el.attributes.length; i++) {
			const attr = el.attributes[i];
			attrs[attr.name] = attr.value;
		}
		return attrs;
	}
}

type ClassHandlerHandler = {
	add?: CombineElements<string> | string[];
	remove?: CombineElements<string> | string[];
	toggle?: CombineElements<string> | string[];
	replace?: `${string} ${string}` | [string, string][];
};

/**
 * Handles class operations for Be elements.
 */
class ClassesHandler {
	private beElement: Be;

	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	/**
	 * Manipulate classes on the element(s).
	 * @param actions An object specifying the classes to add, remove, toggle, or replace.
	 * @param actions.add - Classes to add. Can be a space-separated string or an array of strings.
	 * @param actions.remove - Classes to remove. Can be a space-separated string or an array of strings.
	 * @param actions.toggle - Classes to toggle. Can be a space-separated string or an array of strings.
	 * @param actions.replace - Classes to replace. Can be a string in the format "oldClass newClass" or an array of [oldClass, newClass] pairs.
	 * @returns The Be instance for method chaining.
	 */
	handle(actions: ClassHandlerHandler): Be {
		this.beElement.each((el) => {
			if (actions.add) {
				const classesToAdd = Array.isArray(actions.add) ? actions.add : actions.add.split(' ');
				el.classList.add(...classesToAdd.filter((c) => c.trim() !== ''));
			}
			if (actions.remove) {
				const classesToRemove = Array.isArray(actions.remove)
					? actions.remove
					: actions.remove.split(' ');
				el.classList.remove(...classesToRemove.filter((c) => c.trim() !== ''));
			}
			if (actions.toggle) {
				const classesToToggle = Array.isArray(actions.toggle)
					? actions.toggle
					: actions.toggle.split(' ');
				classesToToggle.forEach((className) => {
					el.classList.toggle(className);
				});
			}
			if (actions.replace) {
				let replacements: [string, string][];
				if (typeof actions.replace === 'string') {
					replacements = actions.replace
						.split(';')
						.map((pair) => pair.trim().split(' ') as [string, string]);
				} else if (Array.isArray(actions.replace) && actions.replace.every(Array.isArray)) {
					replacements = actions.replace as [string, string][];
				} else {
					replacements = [actions.replace.split(' ') as [string, string]];
				}
				replacements.forEach(([oldClass, newClass]) => {
					if (oldClass && newClass) {
						el.classList.replace(oldClass, newClass);
					}
				});
			}
		});
		return this.beElement;
	}

	add(className: string): Be {
		this.beElement.each((el) => el.classList.add(className));
		return this.beElement;
	}

	/**
	 * Toggle a class on the element(s).
	 * @param className The class to toggle.
	 * @returns The Be instance for method chaining.
	 */
	toggle(className: string): Be {
		this.beElement.each((el) => el.classList.toggle(className));
		return this.beElement;
	}

	/**
	 * Replace a class on the element(s).
	 * @param sourceClassName The class to be replaced.
	 * @param targetClassName The new class to replace with.
	 * @returns The Be instance for method chaining.
	 */
	replace(sourceClassName: string, targetClassName: string): Be {
		this.beElement.each((el) => el.classList.replace(sourceClassName, targetClassName));
		return this.beElement;
	}

	/**
	 * Remove a class from the element(s).
	 * @param className The class to remove.
	 * @returns The Be instance for method chaining.
	 */
	remove(className: string): Be {
		this.beElement.each((el) => el.classList.remove(className));
		return this.beElement;
	}
}

type EventHandlerHandler = {
	on: { eventName: string; handler: EventListener };
	off: { eventName: string; handler: EventListener };
};

/**
 * Handles event operations for Be elements.
 */
class EventHandler {
	private beElement: Be;

	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	/**
	 * Handle event actions (add or remove event listeners).
	 * @param actions An object specifying the event actions to perform.
	 * @returns The Be instance for method chaining.
	 */
	handle(actions: EventHandlerHandler): Be {
		if (actions.on) {
			this.beElement.each((el) => el.addEventListener(actions.on.eventName, actions.on.handler));
		}
		if (actions.off) {
			this.beElement.each((el) =>
				el.removeEventListener(actions.off.eventName, actions.off.handler)
			);
		}
		return this.beElement;
	}

	on(eventName: string, handler: EventListener) {
		this.beElement.each((el) => el.addEventListener(eventName, handler));
		return this;
	}

	off(eventName: string, handler: EventListener) {
		this.beElement.each((el) => el.removeEventListener(eventName, handler));
		return this;
	}
}

/**
 * Handles positioning operations for Be elements.
 */
class PositionHandler {
	private beElement: Be;

	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	/**
	 * Clones the position of a source element to this element.
	 * @param sourceElement The element or selector of the element whose position is to be cloned.
	 * @param options Additional options for positioning.
	 * @param options.offsetX Horizontal offset from the source position.
	 * @param options.offsetY Vertical offset from the source position.
	 * @param options.useTransform Whether to use CSS transform for positioning.
	 * @returns The Be instance for method chaining.
	 */
	clonePosition(
		sourceElement: string | HTMLElement,
		options: {
			offsetX?: number;
			offsetY?: number;
			useTransform?: boolean;
		} = {}
	): Be {
		if (this.beElement.isWhat !== 'element') return this.beElement;

		const sourceEl =
			typeof sourceElement === 'string' ? document.querySelector(sourceElement) : sourceElement;

		if (!sourceEl) return this.beElement;

		const sourceRect = sourceEl.getBoundingClientRect();
		const targetRect = (this.beElement.node as HTMLElement).getBoundingClientRect();
		const { offsetX = 0, offsetY = 0, useTransform = false } = options;

		this.beElement.each((el) => {
			if (useTransform) {
				const x = sourceRect.left - targetRect.left + offsetX;
				const y = sourceRect.top - targetRect.top + offsetY;
				el.style.transform = `translate(${x}px, ${y}px)`;
			} else {
				el.style.left = `${sourceRect.left + offsetX}px`;
				el.style.top = `${sourceRect.top + offsetY}px`;
			}
		});

		return this.beElement;
	}

	/**
	 * Positions this element to overlap a target element.
	 * @param targetElement The element or selector of the element to overlap.
	 * @param options Additional options for positioning.
	 * @param options.alignment The alignment of this element relative to the target.
	 * @param options.offset The distance to offset from the target element.
	 * @param options.useTransform Whether to use CSS transform for positioning.
	 * @returns The Be instance for method chaining.
	 */
	overlapPosition(
		targetElement: string | HTMLElement,
		options: {
			alignment?: 'center' | 'top' | 'bottom' | 'left' | 'right';
			offset?: number;
			useTransform?: boolean;
		} = {}
	): Be {
		if (this.beElement.isWhat !== 'element') return this.beElement;

		const targetEl =
			typeof targetElement === 'string' ? document.querySelector(targetElement) : targetElement;

		if (!targetEl) return this.beElement;

		const { alignment = 'center', offset = 0, useTransform = false } = options;
		const targetRect = targetEl.getBoundingClientRect();
		const selfRect = (this.beElement.node as HTMLElement).getBoundingClientRect();

		let x = 0,
			y = 0;

		switch (alignment) {
			case 'center':
				x = targetRect.left + (targetRect.width - selfRect.width) / 2;
				y = targetRect.top + (targetRect.height - selfRect.height) / 2;
				break;
			case 'top':
				x = targetRect.left + (targetRect.width - selfRect.width) / 2;
				y = targetRect.top - selfRect.height - offset;
				break;
			case 'bottom':
				x = targetRect.left + (targetRect.width - selfRect.width) / 2;
				y = targetRect.bottom + offset;
				break;
			case 'left':
				x = targetRect.left - selfRect.width - offset;
				y = targetRect.top + (targetRect.height - selfRect.height) / 2;
				break;
			case 'right':
				x = targetRect.right + offset;
				y = targetRect.top + (targetRect.height - selfRect.height) / 2;
				break;
		}

		this.beElement.each((el) => {
			if (useTransform) {
				el.style.transform = `translate(${x}px, ${y}px)`;
			} else {
				el.style.left = `${x}px`;
				el.style.top = `${y}px`;
			}
		});

		return this.beElement;
	}

	/**
	 * Snaps the element to a target element with specified anchor points.
	 * @param targetElement The element or selector of the element to snap to.
	 * @param options Snapping options.
	 * @param options.sourceAnchor The anchor point on the source element.
	 * @param options.targetAnchor The anchor point on the target element.
	 * @param options.offset Optional offset from the target anchor point.
	 * @returns The Be instance for method chaining.
	 */
	snapTo(
		targetElement: string | HTMLElement, // SnapToOptions
		options: {
			sourceAnchor: SnapToOptions;
			targetAnchor: SnapToOptions;
			offset?: { x: number; y: number };
		}
	): Be {
		if (this.beElement.isWhat !== 'element') return this.beElement;

		const targetEl =
			typeof targetElement === 'string' ? document.querySelector(targetElement) : targetElement;

		if (!targetEl) return this.beElement;

		const sourceRect = (this.beElement.node as HTMLElement).getBoundingClientRect();
		const targetRect = targetEl.getBoundingClientRect();
		const { sourceAnchor, targetAnchor, offset = { x: 0, y: 0 } } = options;

		let sourceX: number, sourceY: number, targetX: number, targetY: number;

		// Calculate source anchor point
		[sourceX, sourceY] = this.calculateAnchorPoint(sourceRect, sourceAnchor);

		// Calculate target anchor point
		[targetX, targetY] = this.calculateAnchorPoint(targetRect, targetAnchor);

		// Calculate final position
		const x = targetX - sourceX + offset.x;
		const y = targetY - sourceY + offset.y;

		// Apply position
		this.beElement.each((el) => {
			const computedStyle = window.getComputedStyle(el);
			const position = computedStyle.position;

			if (position === 'static') {
				el.style.position = 'relative';
			}

			el.style.left = `${x}px`;
			el.style.top = `${y}px`;
		});

		return this.beElement;
	}

	private calculateAnchorPoint(rect: DOMRect, anchor: string): [number, number] {
		const [vertical, horizontal] = anchor.split(' ');
		let x: number, y: number;

		switch (vertical) {
			case 'top':
				y = rect.top;
				break;
			case 'bottom':
				y = rect.bottom;
				break;
			case 'center':
				y = rect.top + rect.height / 2;
				break;
			default:
				y = rect.top;
		}

		switch (horizontal) {
			case 'left':
				x = rect.left;
				break;
			case 'right':
				x = rect.right;
				break;
			case 'center':
				x = rect.left + rect.width / 2;
				break;
			default:
				x = rect.left;
		}

		return [x, y];
	}
}

class WalkHandler {
	private beElement: Be;
	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	up(qy?: string): Be {
		let result: HTMLElement | HTMLElement[] | null = null;
		switch (this.beElement.isWhat) {
			case 'element':
				result = this.beElement.findWhile(this.node as HTMLElement, 'parent', qy);
				break;
			case 'array':
				result = (this.beElement.node as HTMLElement[]).map((node) =>
					this.findWhile(node, 'parent', qy)
				);
				break;
			case 'qy':
				result = Array.from(document.querySelectorAll(this.beElement.node as string)).map((node) =>
					this.findWhile(node, 'parent', qy)
				);
				break;
		}
		return Be.elem(result);
	}

	next(qy?: string): Be {
		let result: HTMLElement | HTMLElement[] | null = null;
		switch (this.beElement.isWhat) {
			case 'element':
				result = this.findWhile(this.node as HTMLElement, 'next', qy);
				break;
			case 'array':
				result = (this.node as HTMLElement[]).map((node) => this.findWhile(node, 'next', qy));
				break;
			case 'qy':
				result = Array.from(document.querySelectorAll(this.node as string)).map((node) =>
					this.findWhile(node, 'next', qy)
				);
				break;
		}
		return Be.elem(result);
	}

	previous(qy?: string): Be {
		let result: HTMLElement | HTMLElement[] | null = null;
		switch (this.beElement.isWhat) {
			case 'element':
				result = this.findWhile(this.beElement.node as HTMLElement, 'previous', qy);
				break;
			case 'array':
				result = (this.beElement.node as HTMLElement[]).map((node) =>
					this.findWhile(node, 'previous', qy)
				);
				break;
			case 'qy':
				result = Array.from(document.querySelectorAll(this.beElement.node as string)).map((node) =>
					this.findWhile(node, 'previous', qy)
				);
				break;
		}
		return Be.elem(result);
	}
	siblings(qy?: string): Be {
		let result: HTMLElement | HTMLElement[] | null = null;
		switch (this.beElement.isWhat) {
			case 'element':
				result = this.findWhile(this.beElement.node as HTMLElement, 'siblings', qy);
				break;
			case 'array':
				result = (this.beElement.node as HTMLElement[]).map((node) =>
					this.findWhile(node, 'siblings', qy)
				);
				break;
			case 'qy':
				result = Array.from(document.querySelectorAll(this.node as string)).map((node) =>
					this.findWhile(node, 'siblings', qy)
				);
				break;
		}
		return Be.elem(result);
	}

	private findWhile(
		element: Element,
		direction: 'parent' | 'next' | 'previous' | 'siblings',
		selector?: string
	): HTMLElement | null {
		if (direction === 'parent') {
			return selector ? element.closest(selector) : element.parentElement;
		}

		const siblingProperty = direction === 'next' ? 'nextElementSibling' : 'previousElementSibling';
		let sibling = element[siblingProperty] as HTMLElement | null;

		while (sibling) {
			if (!selector || sibling.matches(selector)) {
				return sibling;
			}
			sibling = sibling[siblingProperty] as HTMLElement | null;
		}

		return null;
	}
}

export class Be {
	node: HTMLElement | HTMLElement[] | string;
	isWhat: IsWhat;
	attr: AttrHandler;
	prop: PropHandler;
	data: DataHandler;
	// properties
	private propHandler: PropHandler;
	setProp: PropHandler['set'];
	getProp: PropHandler['get'];
	// dataSet
	private dataHandler: DataHandler;
	setData: DataHandler['set'];
	getData: DataHandler['get'];
	// attributes
	private attrHandler: AttrHandler;
	setAttr: AttrHandler['set'];
	getAttr: AttrHandler['get'];
	// position
	private positionHandler: PositionHandler;
	clonePosition: PositionHandler['clonePosition'];
	overlapPosition: PositionHandler['overlapPosition'];
	snapTo: PositionHandler['snapTo'];
	// dom
	private domHandler: DomHandler;
	update: DomHandler['update'];
	updateText: DomHandler['updateText'];
	append: DomHandler['append'];
	prepend: DomHandler['prepend'];
	remove: DomHandler['remove'];
	replace: DomHandler['replace'];
	clear: DomHandler['clear'];
	// events
	private eventHandler: EventHandler;
	on: EventHandler['on'];
	off: EventHandler['off'];
	// classes
	private classesHandler: ClassesHandler;
	addClass: ClassesHandler['add'];
	toggleClass: ClassesHandler['toggle'];
	replaceClass: ClassesHandler['replace'];
	removeClass: ClassesHandler['remove'];
	// walk
	private walkHandler: WalkHandler;
	up: WalkHandler['up'];
	next: WalkHandler['next'];
	previous: WalkHandler['previous'];
	siblings: WalkHandler['siblings'];

	private constructor(node: HTMLElement | HTMLElement[] | string) {
		this.node = node;
		this.isWhat = typeof node === 'string' ? 'qy' : Array.isArray(node) ? 'array' : 'element';

		this.attr = new AttrHandler(this);
		this.prop = new PropHandler(this);
		this.data = new DataHandler(this);
		// properties
		this.propHandler = new PropHandler(this);
		this.setProp = this.propHandler.set;
		this.getProp = this.propHandler.get;
		// dataSet
		this.dataHandler = new DataHandler(this);
		this.setData = this.dataHandler.set;
		this.getData = this.dataHandler.get;
		// attributes
		this.attrHandler = new AttrHandler(this);
		this.setAttr = this.attrHandler.set;
		this.getAttr = this.attrHandler.get;
		// position
		this.positionHandler = new PositionHandler(this);
		this.clonePosition = this.positionHandler.clonePosition;
		this.overlapPosition = this.positionHandler.overlapPosition;
		this.snapTo = this.positionHandler.snapTo;
		// dom
		this.domHandler = new DomHandler(this);
		// dom handle
		this.dom = this.domHandler.handle;
		this.update = this.domHandler.update;
		this.updateText = this.domHandler.updateText;
		this.append = this.domHandler.append;
		this.prepend = this.domHandler.prepend;
		this.remove = this.domHandler.remove;
		this.replace = this.domHandler.replace;
		this.clear = this.domHandler.clear;

		// events
		this.eventHandler = new EventHandler(this);
		this.on = this.eventHandler.on;
		this.off = this.eventHandler.off;

		// classes
		this.classesHandler = new ClassesHandler(this);
		this.addClass = this.classesHandler.add;
		this.toggleClass = this.classesHandler.toggle;
		this.replaceClass = this.classesHandler.replace;
		this.removeClass = this.classesHandler.remove;

		// walk
		this.walkHandler = new WalkHandler(this);
		this.up = this.walkHandler.up;
		this.next = this.walkHandler.next;
		this.previous = this.walkHandler.previous;
		this.siblings = this.walkHandler.siblings;
	}

	static elem(node: HTMLElement | HTMLElement[] | string): Be {
		return new Be(node);
	}

	/**
	 * Manipulate classes on the element(s).
	 * @param actions An object specifying the actions and the classes to add, remove, toggle, or replace.
	 * @param actions.add - Classes to add. Can be a space-separated string or an array of strings.
	 * @param actions.remove - Classes to remove. Can be a space-separated string or an array of strings.
	 * @param actions.toggle - Classes to toggle. Can be a space-separated string or an array of strings.
	 * @param actions.replace - Classes to replace. Can be a string in the format "oldClass newClass" or an array of [oldClass, newClass] pairs.
	 * @param actions.remove -
	 * @returns The Be instance for method chaining.
	 */
	classes(actions: ClassHandlerHandler): Be {
		return this.classesHandler.handle(actions);
	}

	/**
	 * Handle events on the element(s).
	 * @param actions - Actions to perform on the element(s).
	 * @param actions.on - Events to add. Can be a space-separated string or an array of [eventName, handler] pairs.
	 * @param actions.off - Events to remove. Can be a space-separated string or an array of [eventName, handler] pairs.
	 * @returns The Be instance for method chaining.
	 */
	events(actions: Partial<EventHandlerHandler>): Be {
		return this.eventHandler.handle(actions as EventHandlerHandler);
	}

	attrs(actions: Partial<AttrHandler>): Be {
		return this.attrHandler.handle(actions as AttrHandler);
	}

	find(qy: string) {
		switch (this.isWhat) {
			case 'element':
				return (this.node as HTMLElement).querySelector(qy);
			case 'array':
				return (this.node as HTMLElement[])
					.map((node) => node.querySelector(qy))
					.filter((el) => el !== null);
			case 'qy': {
				const foundElement = document.querySelector(this.node as string);
				return foundElement ? foundElement.querySelector(qy) : null;
			}
			default:
				return null;
		}
	}

	findAll(qy: string) {
		switch (this.isWhat) {
			case 'element':
				return Array.from((this.node as HTMLElement).querySelectorAll(qy));
			case 'array':
				return (this.node as HTMLElement[]).flatMap((node) =>
					Array.from(node.querySelectorAll(qy))
				);
			case 'qy':
				return Array.from(document.querySelectorAll(this.node as string)).flatMap((node) =>
					Array.from(node.querySelectorAll(qy))
				);
			default:
				return [];
		}
	}

	/** DOM
	 * Handles various DOM operations on the element(s).
	 * @param actions An object specifying the DOM actions to perform.
	 * @returns The Be instance for method chaining.
	 */
	dom(actions: DomHandlerHandle): Be {
		return this.domHandler.handle(actions);
	}

	get html() {
		return this.isWhat === 'element' ? (this.node as HTMLElement).innerHTML : null;
	}

	get text() {
		return this.isWhat === 'element' ? (this.node as HTMLElement).textContent : null;
	}

	/**
	 * setStyle Sets one or more CSS styles for the selected element(s), including CSS custom properties.
	 * @param styles An object of CSS properties and values, or a string of CSS properties and values.
	 * @param value The value for a single CSS property when styles is a property name string.
	 * @returns The Be instance for method chaining.
	 */
	setStyle(styles: Record<string, string> | string, value?: string): this {
		if (typeof styles === 'string') {
			// Handle string input
			const styleEntries = styles.split(';').filter((s) => s.trim() !== '');
			styleEntries.forEach((entry) => {
				const [property, propertyValue] = entry.split(':').map((s) => s.trim());
				if (property && propertyValue) {
					this.applyStyle(property, propertyValue);
				}
			});

			// If value is provided, treat it as a single property setting
			if (value !== undefined) {
				this.applyStyle(styles, value);
			}
		} else if (typeof styles === 'object') {
			// Handle object input
			Object.entries(styles).forEach(([prop, val]) => {
				this.applyStyle(prop, val);
			});
		}
		return this;
	}

	fetch<T extends object>(options: {
		url: string;
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE';
		data?: T;
		headers?: Record<string, string>;
	}) {
		return fetch(options.url, {
			method: options.method || 'GET',
			body: options.data ? JSON.stringify(options.data) : undefined,
			headers: options.headers || {}
		}).then((response) => response.json());
	}

	each(callback: (el: HTMLElement) => void): void {
		switch (this.isWhat) {
			case 'element':
				callback(this.node as HTMLElement);
				break;
			case 'array':
				(this.node as HTMLElement[]).forEach(callback);
				break;
			case 'qy':
				document.querySelectorAll(this.node as string).forEach((el) => callback(el as HTMLElement));
				break;
		}
	}

	private findWhile(
		element: Element,
		direction: 'parent' | 'next' | 'previous' | 'siblings',
		selector?: string
	): HTMLElement | null {
		if (direction === 'parent') {
			return selector ? element.closest(selector) : element.parentElement;
		}

		const siblingProperty = direction === 'next' ? 'nextElementSibling' : 'previousElementSibling';
		let sibling = element[siblingProperty] as HTMLElement | null;

		while (sibling) {
			if (!selector || sibling.matches(selector)) {
				return sibling;
			}
			sibling = sibling[siblingProperty] as HTMLElement | null;
		}

		return null;
	}

	private applyStyle(property: string, value: string): void {
		this.each((el) => {
			el.style.setProperty(property, value);
		});
	}
}

export function be(selector: string | HTMLElement | HTMLElement[]): Be {
	return Be.elem(selector);
}

be('#dom')
	.dom({ remove: 'frefr rezfsfds' })
	.events({ on: { eventName: 'fine', handler: () => {} } });
