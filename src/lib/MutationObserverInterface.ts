type HtmluDomElement = {};

type MutationRecordDetails = {
	spawn: Element[];
	trashed: Element[];
	reallocated: Element[];
	attributeChanged: Record<string, Element[]>;
	elementChanged: Record<string, Element[]>;
	oldAttribute: any; // à définir en fonction de vos besoins
	lastParentNode: any; // à définir en fonction de vos besoins
};

interface Selector {
	element: string | Node | NodeList;
	mutations: {
		attributes?: string;
	};
}

type MutationHandlerCallback = (
	mutations: MutationRecord[],
	observer: MutationObserver
) => Record<
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

class MutationsHandler {
	observedNode: ObservedElement;

	constructor(observedNode: ObservedElement) {
		this.observedNode = observedNode;
	}

	handleMutation(mutations: MutationRecord[], observer: MutationObserver) {
		for (const mutation of mutations) {
			if (
				mutation.type &&
				this.observedNode.mutationConfig[mutation.type] &&
				typeof this.observedNode?.mutationCallback == 'function'
			) {
				console.log(this.observedNode.mutationCallback(mutations, observer)[mutation.type]);
			}
		}
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
	public targetNode!: Node;
	public mutationConfig!: MutationObserverInit;
	public mutationCallback: MutationHandlerCallback;

	constructor(
		element: Node,
		mutationConfig: MutationObserverInit,
		actions: MutationHandlerCallback
	) {
		this.targetNode = element;
		this.mutationConfig = this.updateDefaultConfig(mutationConfig);
		this.mutationCallback = actions;

		return this;
	}

	updateDefaultConfig(params: MutationObserverInit) {
		return { ...defaultMutationConfig, ...params };
	}
}

class HtmluEvent {
	private observedElement!: ObservedElement;
	private observer!: MutationObserver;

	constructor(observedNode: ObservedElement) {
		// should i stack the observed elements in a specific object /class
		// yes
		this.observedElement = observedNode;
	}

	observe() {
		try {
			/** create callback */
			const callBackHandler = new MutationsHandler(this.observedElement);
			/** create observer */
			this.observer = new MutationObserver(callBackHandler.handleMutation.bind(callBackHandler));
			/** observe */
			this.observer.observe(this.observedElement.targetNode, this.observedElement.mutationConfig);
		} catch (error) {
			console.error('Error in observe method', error);
		}
	}

	disconnect() {
		this.observer.disconnect();
	}

	addEvent(eventType: string, callback: EventListenerOrEventListenerObject) {
		this.observedElement.targetNode.addEventListener(eventType, callback);
	}

	removeEvent(eventType: string, callback: EventListenerOrEventListenerObject) {
		this.observedElement.targetNode.removeEventListener(eventType, callback);
	}
}

/**
 * Represents a loader for the HtmluDom library.
 */
export class HtmluDomLib {
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
	 * @param opts - The options for attaching the library.
	 */
	public attach(opts: AttachOptionsType | AttachOptionsType[]) {
		const optionsArray = HtmluDomUtils.forceArrayType<AttachOptionsType>(opts);
		if (typeof window == 'undefined' || !optionsArray) return true;

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

					const core = new HtmluEvent(targetNode);
					core.observe();

					this.storeObservable(core);
				}
			}
		}
		return true;
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

	/**
	 * Stores the observable elements.
	 * @param element - The observable element.
	 */
	private storeObservable(element: HtmluEvent) {}
}

export const HtmluDom = HtmluDomLib.getInstance();
