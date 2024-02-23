interface Selector {
	element: string | Node | NodeList;
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
	(mutation: MutationRecord, observer: MutationObserver) => any
>;

type AttachedElement = {
	selectors: Selector | Selector[];
	selectorCallback: MutationHandlerCallback;
	observerParameters: MutationObserverInit;
};

type AttachOptionsType = AttachedElement | AttachedElement[];

class HtmluDomUtils {
	static forceArrayType<T>(value: T | T[]): T[] {
		return Array.isArray(value) ? value : [value];
	}
}

export type querySelector = string;
export type moduleName = string;

/**
 * Represents a loader for the HtmluDom library.
 */
class HtmluDomLib {
	private static instance: HtmluDomLib;

	private constructor() {}

	/**
	 * Returns the singleton instance of the HtmluDomLoader.
	 * @returns The singleton instance of the HtmluDomLoader.
	 */
	public static getInstance(): HtmluDomLib {
		if (!HtmluDomLib.instance) {
			HtmluDomLib.instance = new HtmluDomLib();
		}
		return HtmluDomLib.instance;
	}

	/**
	 * Attaches the HtmluDom library to the specified elements.
	 * this methods allows mass declaration
	 * @param opts - The options for attaching the library.
	 */
	public attach(opts: AttachOptionsType | AttachOptionsType[]) {
		const optionsArray = HtmluDomUtils.forceArrayType<AttachOptionsType>(opts);
		if (typeof window == 'undefined' || !optionsArray) return;

		for (const option of optionsArray as AttachedElement[]) {
			const selectorsArray = HtmluDomUtils.forceArrayType<Selector>(option.selectors);

			for (const elementSelector of selectorsArray) {
				const elements = this.getSelectorElements(elementSelector); // document.querySelectorAll(elementSelector.element);

				for (const element of elements) {
					const targetNode = new ObservedElement(
						element,
						option.observerParameters,
						option.selectorCallback
					);

					const core = new HtmluObserver(targetNode);

					core.observe();
				}
			}
		}
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

		// Create an empty selectorCallback object
		const selectorCallback: MutationHandlerCallbackReturn = {} as MutationHandlerCallbackReturn;

		// Set the attributes, childList, and characterData properties of selectorCallback based on the callback functions in paramOnMutationType
		if (paramOnMutationType.onAttributesChange)
			selectorCallback.attributes = paramOnMutationType.onAttributesChange;
		if (paramOnMutationType.onChildListChange)
			selectorCallback.childList = paramOnMutationType.onChildListChange;
		if (paramOnMutationType.onCharacterDataChange)
			selectorCallback.characterData = paramOnMutationType.onCharacterDataChange;

		// Attach the observer with the specified selector, mutation types, and callback functions
		this.attach({
			selectors: [{ element: selector, mutations: { attributes: attributeFilter } }],
			selectorCallback: (mutations, observer) => selectorCallback,
			observerParameters: {
				attributeFilter: attributeFilter ?? undefined,
				attributes:
					Boolean(attributeFilter) ?? Boolean(paramOnMutationType.onAttributesChange) ?? undefined,
				childList: Boolean(paramOnMutationType.onChildListChange),
				subtree: Boolean(attributeFilter) && Boolean(paramOnMutationType.onChildListChange),
				characterData: Boolean(paramOnMutationType.onCharacterDataChange)
			}
		});

		// Return the current instance of the class for chaining
		return this;
	}

	private getSelectorElements({ element }: Selector): Node[] {
		let elementList: Node[] = [];
		if (element instanceof Node) {
			elementList = [element];
		} else if (element instanceof NodeList) {
			elementList = Array.from(element);
		} else if (typeof element == 'string') {
			elementList = Array.from(document.querySelectorAll(element));
		}
		return elementList;
	}
	/**
	 * Detaches the HtmluDom library from the specified elements.
	 * @param args - The options for detaching the library.
	 */
	static detach(args: any /* to define */) {}
}

export class htmlu {
	constructor() {}
	/**
	 * A function to track mutations on the specified selector and handle the mutations using the provided callback.
	 *
	 * @param {string | string[] | Node | NodeList} selector - The selector to track mutations on.
	 * @param {string[] | OnMutationType} attributeFilterOrMutationType - The attribute filter or type of mutation to track.
	 * @param {OnMutationType} [mutationsTypes] - Additional mutation types to track.
	 * @return {htmlu} An instance of the htmlu class for chaining method calls.
	 */
	static async track(
		selector: string | string[] | Node | NodeList,
		attributeFilterOrMutationType: string[] | OnMutationType,
		mutationsTypes?: OnMutationType
	) {
		// await HtmluCore.addSelector(selector);

		let [selectorParam, attributeFilter, paramOnMutationType] = [
			selector,
			attributeFilterOrMutationType,
			mutationsTypes
		].reverse();

		selectorParam = selectorParam ?? attributeFilter;

		if (Array.isArray(attributeFilterOrMutationType)) {
			attributeFilter = attributeFilterOrMutationType;
			paramOnMutationType = mutationsTypes as OnMutationType;
		} else {
			attributeFilter = undefined;
			paramOnMutationType = attributeFilterOrMutationType;
		}

		const selectorCallback: MutationHandlerCallbackReturn = {} as MutationHandlerCallbackReturn;

		if (paramOnMutationType.onAttributesChange)
			selectorCallback.attributes = paramOnMutationType.onAttributesChange;
		if (paramOnMutationType.onChildListChange)
			selectorCallback.childList = paramOnMutationType.onChildListChange;
		if (paramOnMutationType.onCharacterDataChange)
			selectorCallback.characterData = paramOnMutationType.onCharacterDataChange;

		HtmluDomCore.attach({
			selectors: [{ element: selector, mutations: { attributes: attributeFilter } }],
			selectorCallback: (mutations, observer) => selectorCallback,
			observerParameters: {
				attributeFilter: attributeFilter ?? undefined,
				attributes:
					Boolean(attributeFilter) ?? Boolean(paramOnMutationType.onAttributesChange) ?? undefined,
				childList: Boolean(paramOnMutationType.onChildListChange),
				subtree: Boolean(attributeFilter) && Boolean(paramOnMutationType.onChildListChange),
				characterData: Boolean(paramOnMutationType.onCharacterDataChange)
			}
		});

		// get methods off elementFunction
		return new htmlu();
	}
}

export const HtmluDomCore = HtmluDomLib.getInstance();

class MutationsHandler {
	observedElement: ObservedElement;

	constructor(observedNode: ObservedElement) {
		this.observedElement = observedNode;
	}

	handleMutation(mutations: MutationRecord[], observer: MutationObserver) {
		for (const mutation of mutations) {
			if (
				mutation.type &&
				this.observedElement.mutationConfig[mutation.type] &&
				typeof this.observedElement?.mutationCallback == 'function'
			) {
				this.observedElement
					.mutationCallback(this.observedElement.element, mutations, observer)
					[mutation.type](this.observedElement.element, mutation, observer);
				// console.log(mutation.type, this.observedNode.mutationCallback(mutations, observer));
			}
		}

		// this.observedElement.mutationCallback();
	}
}

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

/**
 * Represents an event handler for observing and manipulating HTML elements.
 */
class HtmluObserver {
	private observedElement!: ObservedElement;
	private observer!: MutationObserver;

	constructor(observedNode: ObservedElement) {
		this.observedElement = observedNode;
		/** create callback */
		const callBackHandler = new MutationsHandler(this.observedElement);
		/** create observer */
		this.observer = new MutationObserver(callBackHandler.handleMutation.bind(callBackHandler));
		return this;
	}

	/**
	 * Starts observing the observed element for mutations.
	 */
	observe() {
		try {
			this.observer.observe(this.observedElement.element, this.observedElement.mutationConfig);
			return this.observer;
		} catch (error) {
			console.error('Error in observe method', error);
		}
	}
}

type OnMutationType = {
	onChange?: (element: Node, mutation: MutationRecord, observer: MutationObserver) => void;
	onAttributesChange?: (
		element: Node,
		mutation: MutationRecord,
		observer: MutationObserver
	) => void;
	onChildListChange?: (element: Node, mutation: MutationRecord, observer: MutationObserver) => void;
	onCharacterDataChange?: (
		element: Node,
		mutation: MutationRecord,
		observer: MutationObserver
	) => void;
};

type ChainTestParamsType = {
	selector: string | string[] | Node | NodeList;
	attributeFilterOrMutationType: string[] | OnMutationType;
	mutationsTypes?: OnMutationType;
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
