import { type AttrHandlerHandle, AttrHandler } from './modules/attrs.js';
import { StylesHandler, type BeStylesHandler } from './modules/styles.js';
import { BeUtils } from './utils.js';
import type { IsWhat } from './types.js';
import { type DataHandlerHandle, DataHandler } from './modules/data.js';
import { EventsHandler, type EventHandlerHandle } from './modules/events.js';
import { type ClassHandlerHandler, ClassesHandler } from './modules/classes.js';
import { PropsHandler, type PropsHandlerHandle } from './modules/props.js';
import { DomHandler, type DomHandlerHandle } from './modules/dom.js';
import { PositionHandler, type PositionHandlerHandle } from './modules/position.js';
import { WalkHandler } from './modules/walk.js';
import { TextHandler, type TextHandlerHandle } from './modules/text.js';
import { TimersHandler } from './modules/timers.js';

export class Be {
	node!: HTMLElement | HTMLElement[] | string;
	isWhat!: IsWhat;
	//
	BeTimer: NodeJS.Timeout | null = null;
	BeInterval: NodeJS.Timeout | null = null;
	// styles
	styles!: (actions: BeStylesHandler) => Be;
	private styleHandler!: StylesHandler;
	setStyle!: StylesHandler['set'];
	getStyle!: StylesHandler['get'];
	unsetStyle!: StylesHandler['unset'];
	// properties
	props!: (actions: PropsHandlerHandle) => Be;
	private propHandler!: PropsHandler;
	// dataSet
	data!: (actions: DataHandlerHandle) => Be;
	private dataHandler!: DataHandler;
	setData!: DataHandler['set'];
	getData!: DataHandler['get'];
	deleteData!: DataHandler['delete'];
	getKey!: DataHandler['getKey'];
	// attributes
	attrs!: (actions: Partial<AttrHandlerHandle>) => Be;
	private attrHandler!: AttrHandler;
	setAttr!: AttrHandler['set'];
	getAttr!: AttrHandler['get'];
	deleteAttr!: AttrHandler['delete'];
	// position
	position!: (actions: PositionHandlerHandle) => Be;
	private positionHandler!: PositionHandler;
	clonePosition!: PositionHandler['clonePosition'];
	overlapPosition!: PositionHandler['overlapPosition'];
	snapTo!: PositionHandler['snapTo'];
	// dom
	dom!: (actions: DomHandlerHandle) => Be;
	private domHandler!: DomHandler;
	update!: DomHandler['update'];
	updateText!: DomHandler['updateText'];
	append!: DomHandler['append'];
	prepend!: DomHandler['prepend'];
	remove!: DomHandler['remove'];
	replace!: DomHandler['replace'];
	clear!: DomHandler['clear'];
	// text
	text!: (actions: TextHandlerHandle) => Be;
	private textHandler!: TextHandler;
	appendText!: TextHandler['append'];
	// events
	events!: (actions: EventHandlerHandle) => Be;
	private eventHandler!: EventsHandler;
	on!: EventsHandler['on'];
	off!: EventsHandler['off'];
	fire!: EventsHandler['fire'];
	// classes
	classes!: (actions: ClassHandlerHandler) => Be;
	private classesHandler!: ClassesHandler;
	addClass!: ClassesHandler['add'];
	removeClass!: ClassesHandler['remove'];
	toggleClass!: ClassesHandler['toggle'];
	replaceClass!: ClassesHandler['replace'];
	// walk
	walk!: (actions: DataHandlerHandle) => Be;
	private walkHandler!: WalkHandler;
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
	// timers
	timers!: (actions: TextHandlerHandle) => Be;
	private timerHandler!: TimersHandler;
	timeout!: TimersHandler['timeout'];
	interval!: TimersHandler['interval'];
	clearTimeout!: TimersHandler['clearTimeout'];
	clearInterval!: TimersHandler['clearInterval'];
	private constructor(input: HTMLElement | HTMLElement[] | Be | string) {
		if (input instanceof Be) {
			return input;
		}
		this.node = input;
		this.isWhat = typeof input === 'string' ? 'qy' : Array.isArray(input) ? 'array' : 'element';

		// styles
		this.styleHandler = new StylesHandler(this);
		this.styles = this.handle(this.styleHandler);
		this.attach<StylesHandler>(this.styleHandler, 'Style', StylesHandler.methods);
		// properties
		this.propHandler = new PropsHandler(this);
		this.props = this.handle(this.styleHandler);
		this.attach<PropsHandler>(this.propHandler, 'Prop', PropsHandler.methods);
		// dataSet
		this.dataHandler = new DataHandler(this);
		this.data = this.handle(this.styleHandler);
		this.attach<DataHandler>(this.dataHandler, 'Data', DataHandler.methods);
		// attributes
		this.attrHandler = new AttrHandler(this);
		this.attrs = this.handle(this.styleHandler);
		this.attach<AttrHandler>(this.attrHandler, 'Attr', AttrHandler.methods);

		// position
		this.positionHandler = new PositionHandler(this);
		this.position = this.handle(this.positionHandler);
		this.attach<PositionHandler>(this.positionHandler, '', PositionHandler.methods);

		// text
		this.textHandler = new TextHandler(this);
		this.dom = this.handle(this.textHandler);
		this.attach<TextHandler>(this.textHandler, 'Text', TextHandler.methods);

		// dom and handle
		this.domHandler = new DomHandler(this);
		this.dom = this.handle(this.domHandler);
		this.attach<DomHandler>(this.domHandler, '', DomHandler.methods);

		// events
		this.eventHandler = new EventsHandler(this);
		this.events = this.handle(this.eventHandler);
		this.attach<EventsHandler>(this.eventHandler, '', EventsHandler.methods);

		// classes
		this.classesHandler = new ClassesHandler(this);
		this.classes = this.handle(this.classesHandler);
		this.attach<ClassesHandler>(this.classesHandler, 'Class', ClassesHandler.methods);

		// walk
		this.walkHandler = new WalkHandler(this);
		this.walk = this.handle(this.walkHandler);
		this.attach<WalkHandler>(this.walkHandler, '', WalkHandler.methods);

		// timers
		this.timerHandler = new TimersHandler(this);
		this.timers = this.handle(this.timerHandler);
		this.attach<TimersHandler>(this.timerHandler, '', TimersHandler.methods);
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

	eachNode(callback: (el: HTMLElement) => void): void {
		switch (this.isWhat) {
			case 'element':
				BeUtils.applyCallback(this.node as HTMLElement, callback);
				break;
			case 'array':
				(this.node as HTMLElement[]).forEach((lo) => {
					BeUtils.applyCallback(lo, callback);
				});
				break;
			case 'qy':
				document.querySelectorAll(this.node as string).forEach((el) => callback(el as HTMLElement));
				break;
		}
	}

	/** DOM
	 * Handles various DOM operations on the element(s).
	 * @param actions An object specifying the DOM actions to perform.
	 * @returns The Be instance for method chaining.
	 */

	get html() {
		return this.isWhat === 'element' ? (this.node as HTMLElement).innerHTML : null;
	}

	/* get text() {
		return this.isWhat === 'element' ? (this.node as HTMLElement).textContent : null;
	} */

	private attach<T>(from: T, suffix: string = '', methods?: (keyof T)[]) {
		const fromMethods = methods ?? from.methods ?? [];
		fromMethods.forEach((method) => {
			const methodName = method + suffix;
			// console.log(methodName);
			if (!from[method]) console.error(`Method ${method} not found in ${from}`, from);
			if (from[method] && !this[methodName]) this[methodName] = from[method]?.bind(from);
		});
	}

	private handle<T extends Record<string, any>>(cl: T) {
		return cl.handle.bind(cl);
	}
}

type CreateFragment = `<${string}>${string}</${string}>` | string;

export const be = Be.elem;
export const beId = (id: string) => Be.elem(`#${id}`);
export const createBe = Be.createBe;
