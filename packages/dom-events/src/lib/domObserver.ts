interface Selector {
	element: Node | Node[] | NodeList;
	mutations?: {
		attributes?: string[];
	};
}

type MutationHandlerCallback = (
	element: Node,
	mutations: MutationRecord[],
	observer: MutationObserver
) => MutationHandlerCallbackReturn;

type MutationHandlerCallbackReturn = Record<
	Partial<MutationRecordType>,
	(element: Node, mutation: MutationRecord, observer: MutationObserver) => any
>;

type AttachedElement = {
	selectors: Selector | Selector[];
	selectorCallback: MutationHandlerCallback;
	observerParameters: MutationObserverInit;
};

interface HtmluDomOptions {
	defaultAttributeFilter?: string[];
	useSubtree?: boolean;
	debounceTime?: number;
	errorHandler?: (error: Error | any) => void;
}

type AttachOptionsType = AttachedElement | AttachedElement[];

export type querySelector = string;
export type moduleName = string;

/**
 * Represents a loader for the HtmluDom library.
 */
class DomObserver {
	private static instance: DomObserver;
	private activeObservers: WeakMap<Node, MutationObserver> = new WeakMap();
	private options: HtmluDomOptions;

	private constructor(options: HtmluDomOptions = {}) {
		this.options = {
			defaultAttributeFilter: undefined,
			useSubtree: true,
			debounceTime: 0,
			errorHandler: console.error,
			...options
		};
	}

	/**
	 * Returns the singleton instance of the HtmluDomLoader.
	 * @returns The singleton instance of the HtmluDomLoader.
	 */
	public static getInstance(options?: HtmluDomOptions): DomObserver {
		if (!DomObserver.instance) {
			DomObserver.instance = new DomObserver(options);
		}
		return DomObserver.instance;
	}

	public updateOptions(newOptions: Partial<HtmluDomOptions>): void {
		this.options = { ...this.options, ...newOptions };
	}

	/**
	 * Attaches the HtmluDom library to the specified elements.
	 * this methods allows mass declaration
	 * @param opts - The options for attaching the library.
	 */
	public attach(opts: AttachOptionsType | AttachOptionsType[]) {
		const optionsArray = Array.isArray(opts) ? opts : [opts];
		if (typeof window == 'undefined' || !optionsArray) return;

		const elementsToObserve: ObservedElement[] = [];

		for (const option of optionsArray as AttachedElement[]) {
			const selectorsArray = Array.isArray(option.selectors)
				? option.selectors
				: [option.selectors];

			for (const elementSelector of selectorsArray) {
				const elements = this.getSelectorElements(elementSelector);
				for (const element of elements) {
					elementsToObserve.push(
						new ObservedElement(element, option.observerParameters, option.selectorCallback)
					);
				}
			}
		}

		// Batch DOM operations
		this.scheduleUpdate(() => {
			elementsToObserve.forEach((el) => this.observe(el));
		});

		return true;
	}

	/**
	 * Track mutations on the specified selector and trigger callbacks based on the mutation types.
	 * @param selector - The selector to track mutations on.
	 * @param attributeFilterOrMutationType - Either an array of attribute filters or an object specifying mutation types and their respective callback functions.
	 * @param mutationsTypes - Optional object specifying mutation types and their respective callback functions.
	 * @returns The current instance of the class for chaining.
	 */
	public async track(
		selector: string | string[] | Node | NodeList,
		attributeFilterOrMutationType: string[] | OnMutationType,
		mutationsTypes?: OnMutationType
	) {
		// Reverse the order of the parameters
		let [selectorParam, attributeFilter, paramOnMutationType] = [
			selector,
			attributeFilterOrMutationType,
			mutationsTypes
		].reverse();

		// Set selectorParam to attributeFilter if it is null or undefined
		selectorParam = selectorParam ?? attributeFilter;

		// Determine attributeFilter and paramOnMutationType based on the type of attributeFilterOrMutationType
		if (Array.isArray(attributeFilterOrMutationType)) {
			attributeFilter = attributeFilterOrMutationType;
			paramOnMutationType = mutationsTypes as OnMutationType;
		} else {
			attributeFilter = undefined;
			paramOnMutationType = attributeFilterOrMutationType;
		}

		// Create a selectorCallback object with defined callbacks
		const selectorCallback: MutationHandlerCallbackReturn = {} as MutationHandlerCallbackReturn;

		if (paramOnMutationType.onAttributesChange) {
			selectorCallback.attributes = (element, mutation, observer) =>
				paramOnMutationType.onAttributesChange!(element, mutation, observer);
		}
		if (paramOnMutationType.onChildListChange) {
			selectorCallback.childList = (element, mutation, observer) =>
				paramOnMutationType.onChildListChange!(element, mutation, observer);
		}
		if (paramOnMutationType.onCharacterDataChange) {
			selectorCallback.characterData = (element, mutation, observer) =>
				paramOnMutationType.onCharacterDataChange!(element, mutation, observer);
		}

		if (!selectorParam) return console.error('No selector provided');

		const observerParameters = {
			attributeFilter: attributeFilter ?? this.options.defaultAttributeFilter,
			attributes: Boolean(attributeFilter) || Boolean(paramOnMutationType.onAttributesChange),
			childList: Boolean(paramOnMutationType.onChildListChange),
			subtree:
				this.options.useSubtree &&
				(Boolean(attributeFilter) || Boolean(paramOnMutationType.onChildListChange)),
			characterData: Boolean(paramOnMutationType.onCharacterDataChange)
		};

		// Attach the observer in debounce mode with the specified selector, mutation types, and callback functions
		const debouncedAttach = this.options.debounceTime
			? this.debounce(
					() =>
						this.attach({
							selectors: [
								{
									element: selectorParam as Selector['element'],
									mutations: { attributes: attributeFilter }
								}
							],
							selectorCallback: () => selectorCallback,
							observerParameters
						}),
					this.options.debounceTime
				)
			: () =>
					this.attach({
						selectors: [
							{
								element: selectorParam as Selector['element'],
								mutations: { attributes: attributeFilter }
							}
						],
						selectorCallback: () => selectorCallback,
						observerParameters
					});
		debouncedAttach();

		return {
			untrack: () => this.detach(selector)
		};
	}

	private debounce(func: Function, wait: number) {
		let timeout: NodeJS.Timeout;
		return (...args: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func(...args), wait);
		};
	}

	private observe(observedElement: ObservedElement) {
		try {
			const observer = new MutationObserver(this.debounce(callback, 25));

			try {
				observer.observe(observedElement.element, observedElement.mutationConfig);
				this.activeObservers.set(observedElement.element, observer);
				return observer;
			} catch (error) {
				console.error('Error in observe method', error);
			}

			function callback(mutations: MutationRecord[]) {
				for (const mutation of mutations) {
					if (
						mutation.type &&
						observedElement.mutationConfig[mutation.type] &&
						typeof observedElement?.mutationCallback == 'function'
					) {
						const callbackResult = observedElement.mutationCallback(
							observedElement.element,
							mutations,
							observer
						);

						if (callbackResult && typeof callbackResult[mutation.type] === 'function') {
							callbackResult[mutation.type](observedElement.element, mutation, observer);
						}
					}
				}
			}
		} catch (error) {
			this.options?.errorHandler?.(error);
		}
	}

	private getSelectorElements({ element }: Selector): Node[] {
		if (element instanceof Node) {
			return [element];
		} else if (element instanceof NodeList || element instanceof HTMLCollection) {
			return Array.from(element);
		} else if (typeof element === 'string') {
			return Array.from(document.querySelectorAll(element));
		} else if (Array.isArray(element)) {
			return element.flatMap((sel) =>
				typeof sel === 'string'
					? Array.from(document.querySelectorAll(sel))
					: sel instanceof Node
						? [sel]
						: []
			);
		}
		return [];
	}

	private scheduleUpdate(callback: () => void) {
		requestAnimationFrame(() => {
			callback();
		});
	}

	/**
	 * Detaches the HtmluDom library from the specified elements.
	 * @param args - The options for detaching the library.
	 */
	public detach(selector?: string | Node | NodeList | string[]) {
		if (selector) {
			const elements = this.getSelectorElements({ element: selector });
			elements.forEach((element) => {
				const observer = this.activeObservers.get(element);
				if (observer) {
					observer.disconnect();
					this.activeObservers.delete(element);
				}
			});
		} else {
			// Détacher tous les observateurs si aucun sélecteur n'est spécifié
			this.activeObservers.forEach((observer) => observer.disconnect());
			this.activeObservers.clear();
		}
	}

	public getActiveObserversCount(): number {
		return this.activeObservers.size;
	}
}

export const Htmlu = DomObserver.getInstance();

const defaultMutationConfig: MutationObserverInit = {
	attributeFilter: undefined,
	childList: false,
	subtree: false
};

/**
 * Represents an observed element for the MutationObserverInterface.
 */
class ObservedElement {
	public element!: Node;
	public mutationConfig!: MutationObserverInit;
	public mutationCallback: MutationHandlerCallback;

	constructor(
		element: Node,
		mutationConfig: MutationObserverInit,
		actions: MutationHandlerCallback
	) {
		this.element = element;
		this.mutationConfig = this.updateDefaultConfig(mutationConfig);
		this.mutationCallback = actions;

		return this;
	}

	updateDefaultConfig(params: MutationObserverInit) {
		return { ...defaultMutationConfig, ...params };
	}
}

type OnMutationType = {
	onChange?: (element: Node, mutation: MutationRecord, observer: MutationObserver) => void;
	onAttributesChange?:
		| undefined
		| ((element: Node, mutation: MutationRecord, observer: MutationObserver) => void);
	onChildListChange?:
		| undefined
		| ((element: Node, mutation: MutationRecord, observer: MutationObserver) => void);
	onCharacterDataChange?:
		| undefined
		| ((element: Node, mutation: MutationRecord, observer: MutationObserver) => void);
};

// examples of how to use

// using  htmlu

// monitor some attributes changes
/* htmlu.track('#widget', ['lang'], {
	onAttributesChange: (element, mutation, observer) => {
		console.log(mutation);
	},
	onChildListChange: (mutation) => {
		console.log(mutation);
	},
	onCharacterDataChange: (mutation) => {
		console.log(mutation);
	}
});

// monitor all attributes changes on #widget
htmlu.track('#widget', {
	onAttributesChange: (element, mutation, observer) => {
		console.log(mutation);
	},
	onChildListChange: (mutation) => {
		console.log(mutation);
	},
	onCharacterDataChange: (mutation) => {
		console.log(mutation);
	}
});

// monitor all attributes changes on body
htmlu.track(['lang'], {
	onAttributesChange: (element, mutation, observer) => {
		console.log(mutation);
	},
	onChildListChange: (mutation) => {
		console.log(mutation);
	},
	onCharacterDataChange: (mutation) => {
		console.log(mutation);
	}
});

// using HtmluDom
HtmluDom.attach({
	selectors: [{ element: '#widget', mutations: { attributes: '[lang]' } }],
	selectorCallback: (mutations, observer) => {
		return {
			attributes: (mutation: MutationRecord, observer: MutationObserver) => {},
			childList: (mutation: MutationRecord, observer: MutationObserver) => {},
			characterData: (mutation: MutationRecord, observer: MutationObserver) => {}
		};
	}
}); */
