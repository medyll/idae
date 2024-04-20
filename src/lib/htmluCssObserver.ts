export type CssObserverCallBack = (node: Element) => void;
export type CssObserverCallBackSummary = (node: Node[]) => void;
export type CssObserverOptions = {
	strictlyNew: boolean;
	eventDelay: number;
	marquee: string;
	legacyCssPrefix: 'Webkit' | 'Moz' | 'O' | 'ms' | '';
	debounceDelay: number;
};
type QuerySelector = string;

export class CssObserver {
	private selector: QuerySelector;
	private selectorId: string;

	options: CssObserverOptions = {
		strictlyNew: true,
		eventDelay: 1,
		legacyCssPrefix: '',
		marquee: 'hcs',
		debounceDelay: 10
	};

	/**
	 * Constructor for creating a new instance of the class.
	 *
	 * @param {QuerySelector} selector - the query selector for the instance
	 */
	constructor(selector: QuerySelector) {
		this.selector = selector;
		this.selectorId = this.cleanSpecialChars(selector);
	}

	private cleanSpecialChars(str: string): string {
		return str.replace(/[^a-zA-Z0-9 _-]/g, '');
	}
	/**
	 * Tracks the animation events for the specified selector and invokes the callback function when the animation is completed.
	 * @param callback The callback function to be invoked when the animation is completed.
	 * @returns An object with methods to control the animation tracking.
	 */
	track(
		callback: CssObserverCallBack,
		opts: { onlyNew: boolean } | undefined = { onlyNew: false }
	) {
		const animationName = crypto.randomUUID();
		const styleFragment = this.createStyleFragment(this.selector, animationName);

		if (!opts.onlyNew)
			document.querySelectorAll(this.selector).forEach((element) => {
				this.callCallback(element, callback);
			});
		const eventHandler = (event: AnimationEvent | any) => {
			if (event.animationName === animationName) {
				this.callCallback(event.target, callback);
			}
		};

		let animationLoader = this.addEvent(eventHandler);

		return {
			start: () => {
				animationLoader = this.addEvent(eventHandler);
			},
			pause: () => {
				clearTimeout(animationLoader);
				this.removeEvent(eventHandler);
			},
			destroy: () => {
				clearTimeout(animationLoader);
				styleFragment.replace('');
				this.removeEvent(eventHandler);
			}
		};
	}

	callCallback(element: Element, callback: CssObserverCallBack) {
		if (this.hasTag(element)) return;
		this.doTag(element);
		callback(element);
	}

	getSummary(callback: CssObserverCallBackSummary) {
		let insertions = new Set<Element>();

		const debouncedCallback = this.debounce(() => {
			callback(Array.from(insertions));
			insertions.clear();
		}, this.options.debounceDelay);

		const observerCallback = (element: Element) => {
			if (!element || this.hasTag(element)) return;
			this.doTag(element);

			let myParent = this.findParentWithAttribute(element);
			if (myParent && !insertions.has(myParent)) insertions.add(myParent);

			debouncedCallback();
		};

		return this.track(observerCallback);
	}
	/**
	 * Set options for the HtmluCssObserver instance.
	 *
	 * @param {CssObserverOptions} options - the options to be set
	 *   - options.strictlyNew: boolean - indicates if it's strictly new
	 *   - options.eventDelay: number - the delay for events
	 *   - options.marquee: string - the marquee value
	 *   - options.legacyCssPrefix: 'Webkit' | 'Moz' | 'O' | 'ms' | '' - the legacy CSS prefix
	 *   - options.debounceDelay: number - the delay for debouncing
	 */
	static setOptions(options: CssObserverOptions) {
		CssObserver.prototype.options = { ...CssObserver.prototype.options, ...options };
	}

	/**
	 * Debounces a function to limit the number of times it gets called within a specified delay.
	 * @param func The function to debounce.
	 * @param delay The delay in milliseconds.
	 * @returns A debounced version of the function.
	 */
	private debounce(func: CssObserverCallBackSummary, delay: number) {
		let timeoutId: NodeJS.Timeout;
		return (...args: any[]) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				func.apply(this, args);
			}, delay);
		};
	}

	private findParentWithAttribute(element: Element) {
		while (element) {
			const parent = element.parentElement ?? document.body;
			if (this.hasTag(parent) || element.tagName === 'BODY') return element;
			element = parent;
		}
	}

	private doTag(element: Element) {
		element.setAttribute(`data-${this.options.marquee}`, this.selectorId);
	}

	private hasTag(element: Element) {
		return element.hasAttribute(`data-${this.options.marquee}`);
	}

	tagAll(element: Node) {
		if (!element) return;

		let queue = [element];

		while (queue.length > 0) {
			let current = queue.shift();
			this.doTag(current as Element);
			Array.from(current.children).forEach((child: Node) => {
				if (child.nodeType === 1) {
					queue.push(child);
				}
			});
		}
	}

	private addEvent(eventHandler: (event: AnimationEvent | any) => any) {
		return setTimeout(() => {
			document.addEventListener('animationstart', eventHandler, false);
		}, this.options.eventDelay);
	}
	private removeEvent(eventHandler: (event: AnimationEvent | any) => any) {
		return setTimeout(() => {
			document.removeEventListener('animationstart', eventHandler);
		}, this.options.eventDelay);
	}

	/**
	 * Creates a style fragment with the specified selector and animation name.
	 * @param selector - The CSS selector for the style fragment.
	 * @param animationName - The name of the animation.
	 * @returns The created style element.
	 */
	private createStyleFragment(selector: string, animationName: string) {
		const sheet = new CSSStyleSheet();
		const styleContent = `@${this.options.legacyCssPrefix}keyframes ${animationName} {
									from { outline: 1px solid transparent; }
									to { outline: 0px solid transparent; }
								}
								${selector} {
									animation-duration: 0.0001s!important;
									${this.options.legacyCssPrefix}animation-name: ${animationName}!important;
								}`;
		sheet.replaceSync(styleContent);
		document.adoptedStyleSheets.push(sheet);

		return sheet;
	}
}

/**
 * Creates a selector object that allows querying the DOM using CSS selectors.
 * @param selector - The CSS selector to query the DOM.
 * @param opts - Optional options for the selector.
 * @returns {each,summary}
 */
export function cssObserve(selector: QuerySelector, opts?: { onlyNew: boolean }) {
	const domCss = new CssObserver(selector);

	return {
		/**
		 * Tracks the animation events for the specified selector and invokes the callback function when the animation is completed.
		 * @param callback The callback function to be invoked when the animation is completed.
		 * @returns An object with methods to control the animation tracking.
		 */
		each: function (callback: CssObserverCallBack) {
			return domCss.track(callback, opts);
		},
		summary: function (callback: CssObserverCallBackSummary) {
			return domCss.getSummary(callback);
		}
	};
}
