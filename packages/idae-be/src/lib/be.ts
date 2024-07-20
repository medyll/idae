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
import { EventsHandler, type EventHandlerHandle } from './events.js';
import { type ClassHandlerHandler, ClassesHandler } from './classes.js';
import { PropsHandler } from './props.js';
import { DomHandler, type DomHandlerHandle } from './dom.js';
import { PositionHandler } from './position.js';
import { WalkHandler } from './walk.js';

export class Be {
	node: HTMLElement | HTMLElement[] | string;
	isWhat: IsWhat;
	// styles
	private styleHandler: StyleHandler;
	styles: (actions: BeStylesHandler) => Be;
	setStyle!: StyleHandler['set'];
	getStyle!: StyleHandler['get'];
	// properties
	private propHandler: PropsHandler;
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
	private eventHandler: EventsHandler;
	on!: EventsHandler['on'];
	off!: EventsHandler['off'];
	// classes
	classes: (actions: ClassHandlerHandler) => Be;
	private classesHandler: ClassesHandler;
	addClass!: ClassesHandler['add'];
	toggleClass!: ClassesHandler['toggle'];
	replaceClass!: ClassesHandler['replace'];
	removeClass!: ClassesHandler['remove'];
	// walk
	private walkHandler: WalkHandler;
	up!: WalkHandler['up'];
	next!: WalkHandler['next'];
	previous!: WalkHandler['previous'];
	siblings!: WalkHandler['siblings'];
	children!: WalkHandler['children'];
	closest!: WalkHandler['closest'];
	lastChild!: WalkHandler['lastChild'];
	firstChild!: WalkHandler['firstChild'];
	find!: WalkHandler['find'];
	findAll!: WalkHandler['findAll'];

	private constructor(node: HTMLElement | HTMLElement[] | string) {
		this.node = node;
		this.isWhat = typeof node === 'string' ? 'qy' : Array.isArray(node) ? 'array' : 'element';

		// styles
		this.styleHandler = new StyleHandler(this);
		this.styles = this.styleHandler.handle;
		this.attach<StyleHandler>(this.styleHandler, 'Style', StyleHandler.methods);
		// properties
		this.propHandler = new PropsHandler(this);
		this.attach<PropsHandler>(this.propHandler, 'Prop', PropsHandler.methods);
		// dataSet
		this.dataHandler = new DataHandler(this);
		this.data = this.dataHandler.handle;
		this.attach<DataHandler>(this.dataHandler, 'Data', DataHandler.methods);
		// attributes
		this.attrHandler = new AttrHandler(this);
		this.attrs = this.attrHandler.handle;
		this.attach<AttrHandler>(this.attrHandler, 'Attr', AttrHandler.methods);

		// position
		this.positionHandler = new PositionHandler(this);
		this.attach<PositionHandler>(this.positionHandler, '', PositionHandler.methods);

		// dom and handle
		this.domHandler = new DomHandler(this);
		this.dom = this.domHandler.handle;
		this.attach<DomHandler>(this.domHandler, '', DomHandler.methods);

		// events
		this.eventHandler = new EventsHandler(this);
		this.events = this.eventHandler.handle;
		this.attach<EventsHandler>(this.eventHandler, '', EventsHandler.methods);

		// classes
		this.classesHandler = new ClassesHandler(this);
		this.classes = this.classesHandler.handle;
		this.attach<ClassesHandler>(this.classesHandler, 'Class', ClassesHandler.methods);

		// walk
		this.walkHandler = new WalkHandler(this);
		this.attach<WalkHandler>(this.walkHandler, '', WalkHandler.methods);
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

	private attach<T>(from: T, suffix: string = '', methods?: (keyof T)[]) {
		const fromMethods = methods ?? from.methods ?? [];
		fromMethods.forEach((method) => {
			const methodName = method + suffix;
			if (!from[method]) console.error(`Method ${method} not found in ${from}`);
			if (from[method] && !this[methodName]) this[methodName] = from[method]?.bind(from);
		});
	}
}

type CreateFragment = `<${string}>${string}</${string}>` | string;

export const be = Be.elem;
export const createBe = Be.createBe;
