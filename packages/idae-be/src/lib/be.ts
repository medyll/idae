import { type AttrHandlerHandle, AttrHandler } from './modules/attrs.js';
import { StylesHandler, type BeStylesHandler } from './modules/styles.js';
import { BeUtils } from './utils.js';
import type { IsWhat } from './types.js';
import { type DataHandlerHandle, DataHandler } from './modules/data.js';
import { EventsHandler, type EventHandlerHandle } from './modules/events.js';
import { type ClassHandlerHandler, ClassesHandler } from './modules/classes.js';
import { DomHandler, type DomHandlerHandle } from './modules/dom.js';
import { PositionHandler, type PositionHandlerHandle } from './modules/position.js';
import { WalkHandler } from './modules/walk.js';
import { TextHandler, type TextHandlerHandle } from './modules/text.js';
import { TimersHandler } from './modules/timers.js';

export class Be {
	inputNode!: HTMLElement | HTMLElement[] | string;
	isWhat!: IsWhat;
	//
	timerOut: NodeJS.Timeout | null = null;
	timerInterval: NodeJS.Timeout | null = null;
	// styles
	styles!: (actions: BeStylesHandler) => Be;
	private styleHandler!: StylesHandler;
	setStyle!: StylesHandler['set'];
	getStyle!: StylesHandler['get'];
	unsetStyle!: StylesHandler['unset'];
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
	append!: DomHandler['append'];
	prepend!: DomHandler['prepend'];
	insert!: DomHandler['insert'];
	afterBegin!: DomHandler['afterBegin'];
	afterEnd!: DomHandler['afterEnd'];
	beforeBegin!: DomHandler['beforeBegin'];
	beforeEnd!: DomHandler['beforeEnd'];
	remove!: DomHandler['remove'];
	replace!: DomHandler['replace'];
	clear!: DomHandler['clear'];
	normalize!: DomHandler['normalize'];
	wrap!: DomHandler['wrap'];
	// text
	text!: (actions: TextHandlerHandle) => Be;
	private textHandler!: TextHandler;
	appendText!: TextHandler['append'];
	prependText!: TextHandler['prepend'];
	updateText!: TextHandler['update'];
	replaceText!: TextHandler['replace'];
	removeText!: TextHandler['remove'];
	clearText!: TextHandler['clear'];
	normalizeText!: TextHandler['normalize'];
	wrapText!: TextHandler['wrap'];
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
	without!: WalkHandler['without'];
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
		this.inputNode = Be.getNode(input);
		this.isWhat =
			typeof this.inputNode === 'string'
				? 'qy'
				: Array.isArray(this.inputNode)
					? 'array'
					: 'element';

		// styles
		this.styleHandler = new StylesHandler(this);
		this.styles = this.handle(this.styleHandler);
		this.attach(StylesHandler, 'Style');
		// dataSet
		this.dataHandler = new DataHandler(this);
		this.data = this.handle(this.styleHandler);
		this.attach<DataHandler>(DataHandler, 'Data');
		// attributes
		this.attrHandler = new AttrHandler(this);
		this.attrs = this.handle(this.styleHandler);
		this.attach<AttrHandler>(AttrHandler, 'Attr');

		// position
		this.positionHandler = new PositionHandler(this);
		this.position = this.handle(this.positionHandler);
		this.attach<PositionHandler>(PositionHandler, 'Position');

		// text
		this.textHandler = new TextHandler(this);
		this.dom = this.handle(this.textHandler);
		this.attach<TextHandler>(TextHandler, 'Text');

		// dom and handle
		this.domHandler = new DomHandler(this);
		this.dom = this.handle(this.domHandler);
		this.attach<DomHandler>(DomHandler);

		// events
		this.eventHandler = new EventsHandler(this);
		this.events = this.handle(this.eventHandler);
		this.attach<EventsHandler>(EventsHandler);

		// classes
		this.classesHandler = new ClassesHandler(this);
		this.classes = this.handle(this.classesHandler);
		this.attach<ClassesHandler>(ClassesHandler, 'Class');

		// walk
		this.walkHandler = new WalkHandler(this);
		this.walk = this.handle(this.walkHandler);
		this.attach<WalkHandler>(WalkHandler);

		// timers
		this.timerHandler = new TimersHandler(this);
		this.timers = this.handle(this.timerHandler);
		this.attach(TimersHandler);
	}

	/**
	 * Normalizes the input to ensure `node` is always an HTMLElement or an array of HTMLElements.
	 * @param input - The input to normalize (string, HTMLElement, or array of HTMLElements).
	 * @returns A valid HTMLElement or an array of HTMLElements.
	 */
	private static getNode(input: HTMLElement | HTMLElement[] | string): HTMLElement | HTMLElement[] {
		if (typeof input === 'string') {
			// Si `input` est une chaîne, sélectionnez les éléments correspondants
			const elements = Array.from(document.querySelectorAll(input));
			return elements.length === 1 ? elements[0] : elements;
		} else if (input instanceof HTMLElement) {
			// Si `input` est un seul élément DOM, retournez-le
			return input;
		} else if (Array.isArray(input)) {
			// Si `input` est un tableau, filtrez pour ne garder que les éléments DOM valides
			return input.filter((n) => n instanceof HTMLElement) as HTMLElement[];
		}
		throw new Error('Invalid input: must be a string, HTMLElement, or an array of HTMLElements.');
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
	 * Creates a new `Be` element based on the provided string or HTMLElement.
	 * If the input is an HTMLElement, it creates a new `Be` element and sets it as the child of the provided element.
	 * If the input is a string, it checks if it is a valid HTML string and creates a new `Be` element based on it.
	 * If the input is neither a string nor an HTMLElement, it creates a new `Be` element with the default tag.
	 *
	 * @param str - The string or HTMLElement to create the `Be` element from.
	 * @param options - Additional options for creating the `Be` element.
	 * @returns The created `Be` element.
	 */
	static toBe(
		str: string | HTMLElement,
		options: {
			tag?: string;
		} = {}
	): Be {
		const { tag = 'span' } = options;

		let beElem: Be;

		if (str instanceof HTMLElement) {
			beElem = be(str);
		} else if (typeof str === 'string') {
			const trimmed = str.trim();

			if (trimmed.startsWith('<') && trimmed.endsWith('>') && trimmed.includes('</')) {
				// Parse as HTML
				const parser = new DOMParser();
				const doc = parser.parseFromString(trimmed, 'text/html');
				const element: HTMLElement =
					(doc.body.firstElementChild as HTMLElement) || document.createElement(tag);

				beElem = createBe(tag);
				beElem.update(element.innerHTML);

				// Apply styles
				const styles = element.getAttribute('style');
				if (styles) {
					const styleObj = Object.fromEntries(
						styles
							.split(';')
							.filter((style) => style.trim())
							.map((style) => {
								const [key, value] = style.split(':').map((s) => s.trim());
								return [key, value];
							})
					);
					beElem.setStyle(styleObj);
				}

				// Apply other attributes
				Array.from(element.attributes).forEach((attr) => {
					if (attr.name !== 'style') {
						beElem.setAttr(attr.name, attr.value);
					}
				});
			} else {
				// Create a Be element with the default tag and set text content
				beElem = be(document.createElement(tag));
				beElem.update(str);
			}
		} else {
			// Handle non-string, non-HTMLElement input
			beElem = createBe(tag);
		}

		return beElem;
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

	get node(): HTMLElement | HTMLElement[] {
		switch (this.isWhat) {
			case 'element':
				return this.inputNode as HTMLElement;
			case 'array':
				return Array.from(this.inputNode as HTMLElement[]);
			case 'qy':
				return Array.from(document.querySelectorAll(this.inputNode as string)) as HTMLElement[];
		}
	}

	eachNode(callback: (el: HTMLElement) => void, firstChild?: boolean): void {
		switch (this.isWhat) {
			case 'element':
				BeUtils.applyCallback(this.inputNode as HTMLElement, callback);
				break;
			case 'array':
				(this.inputNode as HTMLElement[]).forEach((lo) => {
					BeUtils.applyCallback(lo, callback);
					if (firstChild) return;
				});
				break;
			case 'qy':
				document.querySelectorAll(this.inputNode as string).forEach((el) => {
					callback(el as HTMLElement);
					if (firstChild) return;
				});
				break;
		}
	}

	/** DOM
	 * Handles various DOM operations on the element(s).
	 * @param actions An object specifying the DOM actions to perform.
	 * @returns The Be instance for method chaining.
	 */

	get html() {
		return this.isWhat === 'element' ? (this.inputNode as HTMLElement).innerHTML : null;
	}

	private attach<T extends new (beElement: Be) => unknown>(
		Handler: T & { methods?: string[] },
		suffix: string = ''
	) {
		const fromMethods = Handler.methods || [];

		fromMethods.forEach((method: string) => {
			const handler = new Handler(this);
			const methodName = method + suffix;
			if (!(method in handler)) {
				console.error(`Method ${method} not found in ${Handler.name}`, handler);
			} else if (methodName in this) {
				this[methodName] = (...args: any[]) => {
					return (handler[method] as Function).apply(handler, args);
				};
			}
		});
	}

	private handle<T extends Record<string, any>>(cl: T) {
		return cl.handle.bind(cl);
	}
}

type CreateFragment = `<${string}>${string}</${string}>` | string;

/** set exports as root */
export const be = Be.elem;
export const toBe = Be.toBe;
export const beId = (id: string) => Be.elem(`#${id}`);
export const createBe = Be.createBe;
