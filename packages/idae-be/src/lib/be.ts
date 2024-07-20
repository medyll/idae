import { type AttrHandlerHandle, AttrHandler } from './attrs.js';
import { StyleHandler, type BeStylesHandler } from './styles.js';
import { BeUtils } from './utils.js';
import type {
	CombineElements,
	PositionSnapOptions,
	IsWhat,
	HandlerCallbackProps,
	HandlerCallBack
} from './types.js';
import { type DataHandlerHandle, DataHandler } from './data.js';
import type { EventHandler } from 'svelte/elements';
import { EventHandler, type EventHandlerHandle } from './events.js';
import { type ClassHandlerHandler, ClassesHandler } from './classes.js';

class PropHandler {
	private element: Be;

	static methods = ['get', 'set'];

	constructor(element: Be) {
		this.element = element;
	}

	attach(thatBe: Be, instance: PropHandler, suffix: string = '') {
		BeUtils.attach<PropHandler>(thatBe, instance, suffix);
	}

	get(name: string): any {
		if (this.element.isWhat !== 'element') return null;
		return (this.element.node as HTMLElement)[name];
	}

	set(nameOrObject: string | Record<string, any>, value?: any): Be {
		this.element.eachNode((el) => {
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
	updateText?: string | HTMLElement;
	append?: string | HTMLElement;
	prepend?: string | HTMLElement;
	remove?: boolean;
	replace?: string | HTMLElement;
	clear?: boolean;
	callback?: (element: HandlerCallbackProps) => void;
};

class DomHandler {
	// update!: (content: DomHandlerHandle['update'], callback?: DomHandlerHandleCallBack) => Be;
	// updateText!: (content: DomHandlerHandle['update'], callback?: DomHandlerHandleCallBack) => Be;

	private beElement: Be;

	static methods = ['update', 'updateText', 'append', 'prepend', 'remove', 'replace', 'clear'];

	constructor(element: Be) {
		this.beElement = element;
		// this.attach(this as unknown as Be);
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
		this.beElement.eachNode((el) => {
			if (actions.update !== undefined) {
				const htmlInfo = BeUtils.isHTML(actions.update, { returnHTMLelement: true });
				if (htmlInfo.isHtml) {
					el.innerHTML = actions.update; /*  */
				}
			}
			if (actions.updateText !== undefined) {
				el.innerHTML = actions.update; /*  */
			}
			if (actions.append !== undefined) {
				let newElement: HTMLElement;
				if (typeof actions.append === 'string') {
					const htmlInfo = BeUtils.isHTML(actions.append, { returnHTMLelement: true });
					if (htmlInfo.isHtml) {
						newElement = htmlInfo.node;
						el.appendChild(htmlInfo.node);
					} else {
						newElement = document.createElement('span');
						newElement.textContent = actions.append;
						// el.insertAdjacentHTML('beforeend', actions.append);
					}
				} else {
					newElement = el.appendChild(actions.append);
				}
				actions?.callback?.({
					fragment: actions.append,
					element: be(newElement),
					root: this.beElement
				});
			}
			if (actions.prepend !== undefined) {
				if (typeof actions.prepend === 'string') {
					const htmlInfo = BeUtils.isHTML(actions.prepend, { returnHTMLelement: true });
					el.insertAdjacentHTML('afterbegin', actions.prepend);
				} else {
					el.insertBefore(actions.prepend, el.firstChild);
				}

				{
					returnHTMLelement: true;
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

	attach(thatBe: Be, instance: DomHandler, suffix: string = '') {
		BeUtils.attach<DomHandler>(thatBe, instance, suffix);
	}

	attachRoot(that: Be) {
		DomHandler.methods.forEach((method) => {
			that[method] = this.handlerFor(method);
		});
	}

	handlerFor(command: keyof DomHandlerHandle) {
		return (content: string | HTMLElement, callback: HandlerCallBack) =>
			this.handle({ [command]: content, callback });
	}

	update(content: DomHandlerHandle['update'], callback?: HandlerCallBack) {
		this.handle({ update: content, callback });
	}
	updateText(content: DomHandlerHandle['updateText'], callback?: HandlerCallBack) {
		this.handle({ updateText: content, callback });
	}
	append(content: DomHandlerHandle['append'], callback?: HandlerCallBack) {
		this.handle({ append: content, callback });
	}
	prepend(content: DomHandlerHandle['prepend'], callback?: HandlerCallBack) {
		this.handle({ prepend: content, callback });
	}
	replace(content: DomHandlerHandle['replace'], callback?: HandlerCallBack) {
		this.handle({ replace: content, callback });
	}
	remove(content: DomHandlerHandle['update'], callback?: HandlerCallBack) {
		this.handle({ update: content, callback });
	}
	clear(content: DomHandlerHandle['update'], callback?: HandlerCallBack) {
		this.handle({ update: content, callback });
	}

	valueOf(): string | null {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.node as HTMLElement).innerHTML;
	}
}

/**
 * Handles positioning operations for Be elements.
 */
class PositionHandler {
	private beElement: Be;

	static methods = ['clonePosition', 'overlapPosition', 'snapTo'];

	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	attach(thatBe: Be, instance: PositionHandler, suffix: string = '') {
		BeUtils.attach<PositionHandler>(thatBe, instance, suffix);
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

		this.beElement.eachNode((el) => {
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

		this.beElement.eachNode((el) => {
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
			sourceAnchor: PositionSnapOptions;
			targetAnchor: PositionSnapOptions;
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
		[sourceX, sourceY] = BeUtils.calculateAnchorPoint(sourceRect, sourceAnchor);

		// Calculate target anchor point
		[targetX, targetY] = BeUtils.calculateAnchorPoint(targetRect, targetAnchor);

		// Calculate final position
		const x = targetX - sourceX + offset.x;
		const y = targetY - sourceY + offset.y;

		// Apply position
		this.beElement.eachNode((el) => {
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
}

type WalkerMethods =
	| 'up'
	| 'next'
	| 'previous'
	| 'siblings'
	| 'children'
	| 'closest'
	| 'lastChild'
	| 'firstChild'
	| 'find'
	| 'findAll';

type WalkerMethodsProps = {
	[key in WalkerMethods]: (qy?: string) => Be;
};

interface IdaeWalkHandlerInterface {
	up: WalkerMethodsProps['up'];
	next: WalkerMethodsProps['next'];
	previous: WalkerMethodsProps['previous'];
	siblings: WalkerMethodsProps['siblings'];
	children: WalkerMethodsProps['children'];
	closest: WalkerMethodsProps['closest'];
	lastChild: WalkerMethodsProps['lastChild'];
	firstChild: WalkerMethodsProps['firstChild'];
	find: WalkerMethodsProps['find'];
	findAll: WalkerMethodsProps['findAll'];
}

class IdaeWalkHandler implements IdaeWalkHandlerInterface {
	up!: WalkerMethodsProps['up'];
	next!: WalkerMethodsProps['next'];
	previous!: WalkerMethodsProps['previous'];
	siblings!: WalkerMethodsProps['siblings'];
	children!: WalkerMethodsProps['children'];
	closest!: WalkerMethodsProps['closest'];
	lastChild!: WalkerMethodsProps['lastChild'];
	firstChild!: WalkerMethodsProps['firstChild'];

	static methods: WalkerMethods[] = [
		'up',
		'next',
		'previous',
		'siblings',
		'children',
		'closest',
		'lastChild',
		'firstChild',
		'find',
		'findAll'
	];

	private beElement: Be;

	constructor(beElement: Be) {
		this.beElement = beElement;
		this.attachRoot();
	}

	attachRoot() {
		IdaeWalkHandler.methods.forEach((method) => {
			this[method] = this.methodize(method);
		});
	}

	attach(thatBe: Be, instance: IdaeWalkHandler, suffix: string = '') {
		BeUtils.attach<IdaeWalkHandler>(thatBe, instance, suffix);
	}

	handle(actions: DomHandlerHandle) {
		console.log('not implemented');
		return;
	}

	find(qy: string): Be | null {
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

	findAll(qy: string): Be | null {
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

	private methodize(method: WalkerMethods) {
		return (qy?: string, callback?: HandlerCallBack) => {
			let result: HTMLElement | HTMLElement[] | null = null;
			switch (this.beElement.isWhat) {
				case 'element':
					result = this.findWhile(this.beElement.node as HTMLElement, method, qy);
					break;
				case 'array':
					result = (this.beElement.node as HTMLElement[]).map((node) =>
						this.findWhile(node, method, qy)
					);
					break;
				case 'qy':
					result = Array.from(document.querySelectorAll(this.beElement.node as string)).map(
						(node) => this.findWhile(node, method, qy)
					);
					break;
			}
			return Be.elem(result);
		};
	}

	private findWhile(
		element: Element,
		direction: WalkerMethods,
		selector?: string
	): HTMLElement | null {
		const dict: Record<string, keyof Element> = {
			up: 'parentNode',
			parent: 'parentNode',
			next: 'nextElementSibling',
			previous: 'previousElementSibling',
			siblings: 'nextElementSibling',
			children: 'children'
		};

		const property = dict[direction] ?? direction;
		let sibling = element[property] as HTMLElement | null;

		while (sibling) {
			if (!selector || sibling.matches(selector)) {
				return sibling;
			}
			sibling = sibling[property] as HTMLElement | null;
		}

		return null;
	}
}

export class Be {
	node: HTMLElement | HTMLElement[] | string;
	isWhat: IsWhat;
	// styles
	private styleHandler: StyleHandler;
	styles: (actions: BeStylesHandler) => Be;
	setStyle!: StyleHandler['set'];
	getStyle!: StyleHandler['get'];
	// properties
	private propHandler: PropHandler;
	// dataSet
	data: (actions: DataHandlerHandle) => Be;
	private dataHandler: DataHandler;
	setData!: DataHandler['set'];
	getData!: DataHandler['get'];
	// attributes
	attrs: (actions: Partial<AttrHandlerHandle>) => Be;
	private attrHandler: AttrHandler;
	setAttr!: AttrHandler['set'];
	getAttr!: AttrHandler['get'];
	// position
	private positionHandler: PositionHandler;
	clonePosition!: PositionHandler['clonePosition'];
	overlapPosition!: PositionHandler['overlapPosition'];
	snapTo!: PositionHandler['snapTo'];
	// dom
	dom: (actions: DomHandlerHandle) => Be;
	private domHandler: DomHandler;
	update!: DomHandler['update'];
	updateText!: DomHandler['updateText'];
	append!: DomHandler['append'];
	prepend!: DomHandler['prepend'];
	remove!: DomHandler['remove'];
	replace!: DomHandler['replace'];
	clear!: DomHandler['clear'];
	// events
	events: (actions: EventHandlerHandle) => Be;
	private eventHandler: EventHandler;
	on!: EventHandler['on'];
	off!: EventHandler['off'];
	// classes
	classes: (actions: ClassHandlerHandler) => Be;
	private classesHandler: ClassesHandler;
	addClass!: ClassesHandler['add'];
	toggleClass!: ClassesHandler['toggle'];
	replaceClass!: ClassesHandler['replace'];
	removeClass!: ClassesHandler['remove'];
	// walk
	private walkHandler: IdaeWalkHandler;
	up!: IdaeWalkHandler['up'];
	next!: IdaeWalkHandler['next'];
	previous!: IdaeWalkHandler['previous'];
	siblings!: IdaeWalkHandler['siblings'];
	children!: IdaeWalkHandler['children'];
	closest!: IdaeWalkHandler['closest'];
	lastChild!: IdaeWalkHandler['lastChild'];
	firstChild!: IdaeWalkHandler['firstChild'];
	find!: IdaeWalkHandler['find'];
	findAll!: IdaeWalkHandler['findAll'];

	private constructor(node: HTMLElement | HTMLElement[] | string) {
		this.node = node;
		this.isWhat = typeof node === 'string' ? 'qy' : Array.isArray(node) ? 'array' : 'element';

		// styles
		this.styleHandler = new StyleHandler(this);
		this.styles = this.styleHandler.handle;
		BeUtils.attach<StyleHandler>(this, this.styleHandler, 'Style', StyleHandler.methods);
		// properties
		this.propHandler = new PropHandler(this);
		BeUtils.attach<PropHandler>(this, this.propHandler, 'Prop', PropHandler.methods);
		// dataSet
		this.dataHandler = new DataHandler(this);
		this.data = this.dataHandler.handle;
		BeUtils.attach<DataHandler>(this, this.dataHandler, 'Data', DataHandler.methods);
		// attributes
		this.attrHandler = new AttrHandler(this);
		this.attrs = this.attrHandler.handle;
		BeUtils.attach<AttrHandler>(this, this.attrHandler, 'Attr', AttrHandler.methods);

		// position
		this.positionHandler = new PositionHandler(this);
		BeUtils.attach<PositionHandler>(this, this.positionHandler, '', PositionHandler.methods);

		// dom and handle
		this.domHandler = new DomHandler(this);
		this.dom = this.domHandler.handle;
		BeUtils.attach<DomHandler>(this, this.domHandler, '', DomHandler.methods);

		// events
		this.eventHandler = new EventHandler(this);
		this.events = this.eventHandler.handle;
		BeUtils.attach<EventHandler>(this, this.eventHandler, '', EventHandler.methods);

		// classes
		this.classesHandler = new ClassesHandler(this);
		this.classes = this.classesHandler.handle;
		BeUtils.attach<ClassesHandler>(this, this.classesHandler, 'Class', ClassesHandler.methods);

		// walk
		this.walkHandler = new IdaeWalkHandler(this);
		BeUtils.attach<IdaeWalkHandler>(this, this.walkHandler, '', IdaeWalkHandler.methods);

		console.log('that', this);
	}

	static elem(node: HTMLElement | HTMLElement[] | string): Be {
		return new Be(node);
	}

	static createBe(
		tagOrHtml: CreateFragment,
		options?: {
			is?: string;
			style?: Record<string, string> | string;
			attributes?: Record<string, string>;
			className?: string;
		}
	): Be {
		const test = BeUtils.isHTML(tagOrHtml, { returnHTMLelement: true });
		const testIsTag = test.isHtml && !tagOrHtml.includes(' ') && tagOrHtml.length < 15;
		let ret: Be;
		if (test.isHtml && test.beElem) {
			ret = test.beElem;
		} else if (testIsTag) {
			const el = document.createElement(tagOrHtml);
			ret = be(el);
		} else {
			const el = document.createElement('div');
			ret = be(el);
		}

		if (options?.style) ret.setStyle(options.style);
		if (options?.attributes) ret.setAttr(options.attributes);
		if (options?.className) ret.addClass(options.className);

		return ret;
	}

	/**
	 * setStyle Sets one or more CSS styles for the selected element(s), including CSS custom properties.
	 * @param styles An object of CSS properties and values, or a string of CSS properties and values.
	 * @param value The value for a single CSS property when styles is a property name string.
	 * @returns The Be instance for method chaining.
	 */

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

	get eachNode() {
		return function (callback: (el: HTMLElement) => void): void {
			switch (this.isWhat) {
				case 'element':
					callback(this.node as HTMLElement);
					break;
				case 'array':
					(this.node as HTMLElement[]).forEach(callback);
					break;
				case 'qy':
					document
						.querySelectorAll(this.node as string)
						.forEach((el) => callback(el as HTMLElement));
					break;
			}
		};
	}

	/** DOM
	 * Handles various DOM operations on the element(s).
	 * @param actions An object specifying the DOM actions to perform.
	 * @returns The Be instance for method chaining.
	 */

	get html() {
		return this.isWhat === 'element' ? (this.node as HTMLElement).innerHTML : null;
	}

	get text() {
		return this.isWhat === 'element' ? (this.node as HTMLElement).textContent : null;
	}
}

type CreateFragment = `<${string}>${string}</${string}>` | string;

export const be = Be.elem;
export const createBe = Be.createBe;
