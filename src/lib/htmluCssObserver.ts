type CallBackType = (node: Element) => void;
type CallBackSummaryType = (node: Node[]) => void;
type Options = {
	strictlyNew: boolean;
	eventDelay: number;
	marquee: string;
	legacyCssPrefix: 'Webkit' | 'Moz' | 'O' | 'ms' | '';
	debounceDelay: number;
};
type QuerySelector = string;

class HtmluCssObserver {
	private selector: QuerySelector;
	options: Options = {
		strictlyNew: true,
		eventDelay: 5,
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
	}

	/**
	 * Tracks the animation events for the specified selector and invokes the callback function when the animation is completed.
	 * @param callback The callback function to be invoked when the animation is completed.
	 * @returns An object with methods to control the animation tracking.
	 */
	track(callback: CallBackType) {
		const animationName = crypto.randomUUID();
		const styleFragment = this.createStyleFragment(this.selector, animationName);

		const eventHandler = (event: AnimationEvent | any) => {
			if (event.animationName === animationName && !this.hasTag(event.target)) {
				callback(event.target);
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
				document.head.removeChild(styleFragment);
				this.removeEvent(eventHandler);
			}
		};
	}

	getSummary(callback: CallBackSummaryType) {
		let insertions = new Set<Element>();

		const debouncedCallback = this.debounce(() => {
			callback(Array.from(insertions));
			insertions.clear();
		}, this.options.debounceDelay);

		const observerCallback = (element: Element) => {
			if (!element || this.hasTag(element)) return;
			this.doTag(element);

			let myParent = this.findParentWithAttribute(element);
			if (!insertions.has(myParent)) insertions.add(myParent);

			debouncedCallback();
		};

		return this.track(observerCallback);
	}
	/**
	 * Set options for the HtmluCssObserver instance.
	 *
	 * @param {Options} options - the options to be set
	 *   - options.strictlyNew: boolean - indicates if it's strictly new
	 *   - options.eventDelay: number - the delay for events
	 *   - options.marquee: string - the marquee value
	 *   - options.legacyCssPrefix: 'Webkit' | 'Moz' | 'O' | 'ms' | '' - the legacy CSS prefix
	 *   - options.debounceDelay: number - the delay for debouncing
	 */
	static setOptions(options: Options) {
		HtmluCssObserver.prototype.options = { ...HtmluCssObserver.prototype.options, ...options };
	}

	/**
	 * Debounces a function to limit the number of times it gets called within a specified delay.
	 * @param func The function to debounce.
	 * @param delay The delay in milliseconds.
	 * @returns A debounced version of the function.
	 */
	private debounce(func: CallBackSummaryType, delay: number) {
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
		element.setAttribute(`data-${this.options.marquee}`, this.options.marquee);
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
		const style = document.createElement('style');
		const styleContent = `@${this.options.legacyCssPrefix}keyframes ${animationName} {
									from { outline: 1px solid transparent; }
									to { outline: 0px solid transparent; }
								}
								${selector} {
									animation-duration: 0.0001s!important;
									${this.options.legacyCssPrefix}animation-name: ${animationName}!important;
								}`;
		style.id = animationName;
		style.appendChild(document.createTextNode(styleContent));
		document.head.appendChild(style);
		return style;
	}
}

/**
 * Creates a selector object that allows querying the DOM using CSS selectors.
 * @param selector - The CSS selector to query the DOM.
 * @param opts - Optional options for the selector.
 * @returns {each,summary}
 */
export function elementObserve(selector: QuerySelector, opts?: any) {
	const domCss = new HtmluCssObserver(selector);
	domCss.tagAll(document.body);
	return {
		/**
		 * Tracks the animation events for the specified selector and invokes the callback function when the animation is completed.
		 * @param callback The callback function to be invoked when the animation is completed.
		 * @returns An object with methods to control the animation tracking.
		 */
		each: function (callback: CallBackType) {
			return domCss.track(callback);
		},
		summary: function (callback: CallBackSummaryType) {
			return domCss.getSummary(callback);
		}
	};
}
