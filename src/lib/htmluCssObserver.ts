/* path: D:\boulot\app-node\htmludom\src\lib\htmluCssObserver.ts */
export type CssObserverCallBack = (node: Element) => void;
export type CssObserverCallBackSummary = (nodes: Node[]) => void;
export type CssObserverOptions = {
	strictlyNew: boolean;
	eventDelay: number;
	marquee: string;
	legacyCssPrefix: 'Webkit' | 'Moz' | 'O' | 'ms' | '';
	debounceDelay: number;
};
type QuerySelector = string;

/**
 * CssObserver class for tracking CSS changes and animations.
 */
export class CssObserver {
	private selector: QuerySelector;
	private selectorId: string;
	private activeAnimations: Set<string> = new Set();

	options: CssObserverOptions = {
		strictlyNew: true,
		eventDelay: 1,
		legacyCssPrefix: '',
		marquee: 'hcs',
		debounceDelay: 10
	};

	/**
	 * Creates a new instance of CssObserver.
	 * @param {QuerySelector} selector - The query selector for the instance.
	 */
	constructor(selector: QuerySelector) {
		this.selector = selector;
		if (!('adoptedStyleSheets' in Document.prototype) || !('replace' in CSSStyleSheet.prototype)) {
			throw new Error(
				'Your browser does not support the CSSStyleSheet.replace method. Please use a modern browser.'
			);
		}
		this.selectorId = this.cleanSpecialChars(selector);
	}

	/**
	 * Removes special characters from a string.
	 * @param {string} str - The string to clean.
	 * @returns {string} The cleaned string.
	 */
	private cleanSpecialChars(str: string): string {
		return str.replace(/[^a-zA-Z0-9 _-]/g, '');
	}

	/**
	 * Tracks animation events for the specified selector and invokes the callback function.
	 * @param {CssObserverCallBack} callback - The callback function to be invoked.
	 * @param {Object} opts - Optional settings.
	 * @param {boolean} [opts.onlyNew=false] - Whether to track only new elements.
	 * @returns {Object} An object with methods to control the animation tracking.
	 */
	track(callback: CssObserverCallBack, opts: { onlyNew: boolean } = { onlyNew: false }) {
		const animationName = crypto.randomUUID();
		this.activeAnimations.add(animationName);
		const styleFragment = this.createStyleFragment(this.selector, animationName);

		if (!opts.onlyNew) {
			this.processExistingElements(callback);
		}

		const eventHandler = this.createEventHandler(animationName, callback);
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
				if (styleFragment instanceof CSSStyleSheet) {
					styleFragment.replace('');
				} else {
					styleFragment.remove();
				}
				this.removeEvent(eventHandler);
				this.activeAnimations.delete(animationName);
			}
		};
	}

	/**
	 * Processes existing elements that match the selector.
	 * @param {CssObserverCallBack} callback - The callback function to be invoked for each element.
	 */
	private processExistingElements(callback: CssObserverCallBack) {
		document.querySelectorAll(this.selector).forEach((element) => {
			this.callCallback(element, callback);
		});
	}

	/**
	 * Creates an event handler for animation events.
	 * @param {string} animationName - The name of the animation to track.
	 * @param {CssObserverCallBack} callback - The callback function to be invoked.
	 * @returns {Function} The event handler function.
	 */
	private createEventHandler(animationName: string, callback: CssObserverCallBack) {
		return (event: AnimationEvent) => {
			if (event.animationName === animationName) {
				this.callCallback(event.target as Element, callback);
			}
		};
	}

	/**
	 * Calls the callback function for an element if it hasn't been processed before.
	 * @param {Element} element - The element to process.
	 * @param {CssObserverCallBack} callback - The callback function to be invoked.
	 */
	private callCallback(element: Element, callback: CssObserverCallBack) {
		if (this.hasTag(element)) return;
		this.doTag(element);
		callback(element);
	}

	/**
	 * Gets a summary of changes by grouping them under parent elements.
	 * @param {CssObserverCallBackSummary} callback - The callback function to be invoked with the summary.
	 * @returns {Object} An object with methods to control the summary tracking.
	 */
	getSummary(callback: CssObserverCallBackSummary) {
		const insertions = new Set<Element>();
		const debouncedCallback = this.debounce(() => {
			callback(Array.from(insertions));
			insertions.clear();
		}, this.options.debounceDelay);

		const observerCallback = (element: Element) => {
			if (!element || this.hasTag(element)) return;
			this.doTag(element);

			const myParent = this.findParentWithAttribute(element);
			if (myParent && !insertions.has(myParent)) insertions.add(myParent);

			debouncedCallback();
		};

		return this.track(observerCallback);
	}

	/**
	 * Sets options for the CssObserver instance.
	 * @param {CssObserverOptions} options - The options to be set.
	 */
	static setOptions(options: CssObserverOptions) {
		CssObserver.prototype.options = { ...CssObserver.prototype.options, ...options };
	}

	/**
	 * Debounces a function to limit the number of times it gets called.
	 * @param {Function} func - The function to debounce.
	 * @param {number} delay - The delay in milliseconds.
	 * @returns {Function} A debounced version of the function.
	 */
	private debounce<T extends (...args: any[]) => any>(
		func: T,
		delay: number
	): (...args: Parameters<T>) => void {
		let timeoutId: NodeJS.Timeout;
		return (...args: Parameters<T>) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func(...args), delay);
		};
	}

	/**
	 * Finds the nearest parent element with the tracking attribute.
	 * @param {Element} element - The starting element.
	 * @returns {Element | null} The nearest parent with the attribute, or null if not found.
	 */
	private findParentWithAttribute(element: Element): Element | null {
		while (element && element !== document.body) {
			if (this.hasTag(element)) return element;
			element = element.parentElement!;
		}
		return null;
	}

	/**
	 * Adds a tracking attribute to an element.
	 * @param {Element} element - The element to tag.
	 */
	private doTag(element: Element) {
		element.setAttribute(`data-${this.options.marquee}`, this.selectorId);
	}

	/**
	 * Checks if an element has the tracking attribute.
	 * @param {Element} element - The element to check.
	 * @returns {boolean} True if the element has the tracking attribute, false otherwise.
	 */
	private hasTag(element: Element): boolean {
		return element.hasAttribute(`data-${this.options.marquee}`);
	}

	/**
	 * Tags all elements in the given node and its descendants.
	 * @param {Node} element - The root node from which to start tagging.
	 */
	tagAll(element: Node) {
		if (!element) return;
		const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT);
		let currentNode: Node | null;
		while ((currentNode = walker.nextNode())) {
			if (currentNode instanceof Element) {
				this.doTag(currentNode);
			}
		}
	}

	/**
	 * Adds an event listener for animation start events.
	 * @param {Function} eventHandler - The event handler function.
	 * @returns {number} The timeout ID.
	 */
	private addEvent(eventHandler: (event: AnimationEvent) => void): NodeJS.Timeout {
		return setTimeout(() => {
			document.addEventListener('animationstart', eventHandler, false);
		}, this.options.eventDelay);
	}

	/**
	 * Removes an event listener for animation start events.
	 * @param {Function} eventHandler - The event handler function to remove.
	 */
	private removeEvent(eventHandler: (event: AnimationEvent) => void) {
		setTimeout(() => {
			document.removeEventListener('animationstart', eventHandler);
		}, this.options.eventDelay);
	}

	/**
	 * Creates a style fragment with the specified selector and animation name.
	 * @param {string} selector - The CSS selector for the style fragment.
	 * @param {string} animationName - The name of the animation.
	 * @returns {CSSStyleSheet} The created style sheet.
	 */
	private createStyleFragment(selector: string, animationName: string): CSSStyleSheet | Element {
		const sheet = new CSSStyleSheet();
		const styleContent = `@${this.options.legacyCssPrefix}keyframes ${animationName} {
            from { outline: 1px solid transparent; }
            to { outline: 0px solid transparent; }
        }
        ${selector} {
            animation-duration: 0.0001s !important;
            ${this.options.legacyCssPrefix}animation-name: ${animationName} !important;
        }`;
		sheet.replaceSync(styleContent);
		document.adoptedStyleSheets.push(sheet);
		return sheet;
	}
}

/**
 * Creates a selector object that allows querying the DOM using CSS selectors.
 * @param {QuerySelector} selector - The CSS selector to query the DOM.
 * @param {Object} [opts] - Optional options for the selector.
 * @param {boolean} [opts.onlyNew] - Whether to observe only new elements.
 * @returns {Object} An object with methods to track changes.
 */
export function cssObserve(
	selector: QuerySelector,
	opts?: { onlyNew: boolean; trackChildList: boolean; trackResize: boolean }
) {
	const domCss = new CssObserver(selector);

	return {
		/**
		 * Tracks changes for each matching element.
		 * @param {CssObserverCallBack} callback - The callback function to be invoked for each change.
		 * @returns {Object} An object with methods to control the tracking.
		 */
		each: function (callback: CssObserverCallBack) {
			return domCss.track(callback, opts);
		},
		/**
		 * Tracks changes and provides a summary of affected elements.
		 * @param {CssObserverCallBackSummary} callback - The callback function to be invoked with the summary.
		 * @returns {Object} An object with methods to control the tracking.
		 */
		summary: function (callback: CssObserverCallBackSummary) {
			return domCss.getSummary(callback);
		}
	};
}
