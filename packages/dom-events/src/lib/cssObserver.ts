import { Htmlu } from './domObserver.js';

/* path: D:\boulot\app-node\htmludom\src\lib\htmluCssObserver.ts */
export type CssObserverCallBack = undefined | ((node: Element, mutation?: MutationRecord) => void);
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
	private resizeObserver: ResizeObserver | null = null;

	/**
	 * Default options for the CssObserver.
	 */
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
		CssObserver.checkBrowserSupport();
		this.selector = selector;
		this.selectorId = this.cleanSpecialChars(selector);
	}

	/**
	 * Checks if the browser supports necessary features.
	 * @throws {Error} If the browser doesn't support required features.
	 */
	private static checkBrowserSupport() {
		if (!('adoptedStyleSheets' in Document.prototype) || !('replace' in CSSStyleSheet.prototype)) {
			throw new Error(
				'Your browser does not support the CSSStyleSheet.replace method. Please use a modern browser.'
			);
		}
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
	 * @param {boolean} [opts.trackChildList] - Whether to track child list changes.
	 * @param {boolean|string[]} [opts.trackAttributes] - Whether to track attribute changes or an array of specific attributes.
	 * @param {boolean} [opts.trackResize] - Whether to track resize events.
	 * @returns {Object} An object with methods to control the animation tracking.
	 */
	track(
		callback: CssObserverCallBack,
		opts: {
			onlyNew?: boolean;
			trackChildList?: boolean;
			trackAttributes?: string[];
			trackCharacterData?: boolean;
			trackResize?: boolean;
		} = {}
	) {
		/* if (!document?.body) {
			return;
			throw new Error('Document body is not available. Please wait for the document to load.');
		} */
		const animationName = crypto.randomUUID();
		this.activeAnimations.add(animationName);
		const styleFragment = this.createStyleFragment(this.selector, animationName);

		let transCallBak: CssObserverCallBack = (node) => {
			if (opts.trackResize) {
				this.addResizeObserver(callback);
			}

			if (opts.trackAttributes) {
				Htmlu.track(node, opts.trackAttributes, {
					onAttributesChange: callback,
					onChildListChange: opts.trackChildList ? callback : undefined,
					onCharacterDataChange: Boolean(opts.trackCharacterData) ? callback : undefined
				});
			} else if (opts.trackChildList || opts.trackCharacterData) {
				Htmlu.track(node, {
					onChildListChange: opts.trackChildList ? callback : undefined,
					onCharacterDataChange: Boolean(opts.trackCharacterData) ? callback : undefined
				});
			}
			return callback?.(node);
		};

		if (!opts.onlyNew) {
			this.processExistingElements(transCallBak);
		}

		const eventHandler = this.createEventHandler(animationName, transCallBak);
		let animationLoader = this.listenToAnimationEvent(eventHandler);

		return {
			start: () => {
				animationLoader = this.listenToAnimationEvent(eventHandler);
				if (opts.trackResize) {
					this.addResizeObserver(transCallBak);
				}
			},
			pause: () => {
				clearTimeout(animationLoader);
				this.removeEvent(eventHandler);
				if (opts.trackResize) {
					this.removeResizeObserver();
				}
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
				if (opts.trackResize) {
					this.removeResizeObserver();
				}
				if (opts.trackChildList || opts.trackAttributes) {
					Htmlu.detach(this.selector);
				}
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
	 * @param {MutationRecord} [mutation] - The mutation record associated with the change.
	 */
	private callCallback(element: Element, callback: CssObserverCallBack, mutation?: MutationRecord) {
		if (this.hasTag(element)) return;
		this.doTag(element);
		callback?.(element, mutation);
	}

	/**
	 * Gets a summary of changes by grouping them under parent elements.
	 * @param {CssObserverCallBackSummary} callback - The callback function to be invoked with the summary.
	 * @param {Object} opts - Optional settings.
	 * @param {boolean} [opts.onlyNew=false] - Whether to track only new elements.
	 * @param {boolean} [opts.trackChildList] - Whether to track child list changes.
	 * @param {boolean|string[]} [opts.trackAttributes] - Whether to track attribute changes or an array of specific attributes.
	 * @param {boolean} [opts.trackResize] - Whether to track resize events.
	 * @returns {Object} An object with methods to control the summary tracking.
	 */
	getSummary(
		callback: CssObserverCallBackSummary,
		opts: {
			onlyNew?: boolean;
			trackChildList?: boolean;
			trackAttributes?: boolean | string[];
			trackResize?: boolean;
		} = {}
	) {
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

		const tracker = this.track(observerCallback, opts);

		if (opts.trackChildList || opts.trackAttributes) {
			Htmlu.track(this.selector, opts.trackAttributes ? opts.trackAttributes : [], {
				onChildListChange: opts.trackChildList ? observerCallback : undefined,
				onAttributesChange: opts.trackAttributes ? observerCallback : undefined
			});
		}

		if (opts.trackResize) {
			const resizeObserver = new ResizeObserver((entries) => {
				for (let entry of entries) {
					observerCallback(entry.target as Element);
				}
			});
			document
				.querySelectorAll(this.selector)
				.forEach((element) => resizeObserver.observe(element));
		}

		return tracker;
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
	private listenToAnimationEvent(eventHandler: (event: AnimationEvent) => void): number {
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
	 * @returns {CSSStyleSheet | HTMLStyleElement} The created style sheet or style element.
	 */
	private createStyleFragment(
		selector: string,
		animationName: string
	): CSSStyleSheet | HTMLStyleElement {
		if ('adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype) {
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
		} else {
			const style = document.createElement('style');
			style.textContent = `@${this.options.legacyCssPrefix}keyframes ${animationName} {
                from { outline: 1px solid transparent; }
                to { outline: 0px solid transparent; }
            }
            ${selector} {
                animation-duration: 0.0001s !important;
                ${this.options.legacyCssPrefix}animation-name: ${animationName} !important;
            }`;
			document.head.appendChild(style);
			return style;
		}
	}

	/**
	 * Adds a ResizeObserver to track size changes of elements matching the selector.
	 * @param {CssObserverCallBack} callback - The callback function to be invoked on resize.
	 */
	private addResizeObserver(callback: CssObserverCallBack) {
		this.resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				callback(entry.target as Element);
			}
		});
		document
			.querySelectorAll(this.selector)
			.forEach((element) => this.resizeObserver!.observe(element));
	}

	/**
	 * Removes the ResizeObserver if it exists.
	 */
	private removeResizeObserver() {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
	}
}

/**
 * Creates a selector object that allows querying the DOM using CSS selectors.
 * @param {QuerySelector} selector - The CSS selector to query the DOM.
 * @param {Object} [opts] - Optional options for the selector.
 * @param {boolean} [opts.onlyNew] - Whether to observe only new elements.
 * @param {boolean} [opts.trackChildList] - Whether to track child list changes.
 * @param {boolean|string[]} [opts.trackAttributes] - Whether to track attribute changes or an array of specific attributes.
 * @param {boolean} [opts.trackResize] - Whether to track resize events.
 * @returns {Object} An object with methods to track changes.
 */
export function cssObserve(
	selector: QuerySelector,
	opts?: {
		onlyNew?: boolean;
		trackChildList?: boolean;
		trackAttributes?: boolean | string[];
		trackResize?: boolean;
	}
) {
	const domCss = new CssObserver(selector);

	if (document?.body)
		document?.body?.addEventListener(
			'DOMContentLoaded',
			(event) => {
				console.log('DOMContentLoaded');
			},
			false
		);
	return {
		/**
		 * Tracks changes for each matching element.
		 * @param {CssObserverCallBack} callback - The callback function to be invoked for each change.
		 * @returns {Object} An object with methods to control the tracking.
		 */
		each: function (callback: CssObserverCallBack) {
			const tracker = domCss.track(callback, opts);

			return tracker;
		},
		/**
		 * Tracks changes and provides a summary of affected elements.
		 * @param {CssObserverCallBackSummary} callback - The callback function to be invoked with the summary.
		 * @returns {Object} An object with methods to control the tracking.
		 */
		summary: function (callback: CssObserverCallBackSummary) {
			const tracker = domCss.getSummary(callback, opts);

			if (opts?.trackChildList || opts?.trackAttributes) {
				Htmlu.track(selector, opts.trackAttributes ? opts.trackAttributes : [], {
					onChildListChange: opts.trackChildList ? (element) => callback([element]) : undefined,
					onAttributesChange: opts.trackAttributes
						? (element, mutation) => callback([element])
						: undefined
				});
			}

			if (opts?.trackResize) {
				const resizeObserver = new ResizeObserver((entries) => {
					for (let entry of entries) {
						callback([entry.target]);
					}
				});
				document.querySelectorAll(selector).forEach((element) => resizeObserver.observe(element));
			}

			return tracker;
		}
	};
}
