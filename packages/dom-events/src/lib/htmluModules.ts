import { Htmlu, type moduleName, type querySelector } from './domObserver.js';

type HtmluModule = Record<moduleName, [querySelector, querySelector]>;

const configModules: HtmluModule = {
	'[data-htmlu-module-id]': ['[data-click]', '[data-click]']
};
// monitor specific attributes changes related to gui.engine events
class htmluModuleLoader {
	selectors: any;
	constructor() {}

	loadModuleLib() {}
}

/**
 * Represents the base class for HtmluCore.
 */
class HtmluModules {
	observer!: MutationObserver;
	private targetNode!: Node;

	private nodesToCollect: HtmluModule;

	private config: MutationObserverInit;

	private delay!: NodeJS.Timeout;

	private stack: Element[] = [];

	private defaultConfig: MutationObserverInit = {
		attributes: false,
		attributeFilter: undefined,
		characterData: false,
		childList: true,
		subtree: true
	};

	/**
	 * Represents the HtmluDom class.
	 * @constructor
	 * @param {Node | querySelector} targetNode - The target node or query selector.
	 * @param {MutationObserverInit} [config] - The configuration options for the MutationObserver.
	 */
	constructor(targetNode: Node | querySelector = '#body', config?: MutationObserverInit) {
		clearTimeout(this.delay);
		this.config = { ...this.defaultConfig, ...config };
		this.targetNode = targetNode as Node;

		// this.observe();

		// const moduleLoader = new htmluModuleLoader();

		Htmlu.attach({
			selectors: [
				{
					element: '#body'
					// mutations: { attributes: ['data-auto-track', 'data-htmlu-module'] }
				}
			],
			selectorCallback: (mutation, observer) => {
				return {
					attributes: (mutation: MutationRecord, observer: MutationObserver) => {},
					childList: this.collectSelectors,
					characterData: (mutation: MutationRecord, observer: MutationObserver) => {}
				};
			},
			observerParameters: {
				attributes: false,
				attributeFilter: [],
				characterData: false,
				childList: true,
				subtree: true
			}
		});

		console.log('attach');
		return this;
	}

	private collectSelectors(
		element: Node,
		mutationsList: MutationRecord[],
		observer: MutationObserver
	) {
		console.log(element, mutationsList, observer);
		for (let mutation of mutationsList) {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach((node: any) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						if (node.matches && node.matches('[data-htmlu-module]') && !this.stack.includes(node)) {
							node.setAttribute('data-auto-track', true);
						}
						if (node.matches && node.matches('[data-auto-track]') && !this.stack.includes(node)) {
							// console.log('Un nouvel élément a été ajouté:', node);
							// [data-htmlu-module
							this.addSelector(node);
							console.log(node);
						}
					}
				});
			}
		}
	}

	public async addSelector(node: Node | querySelector) {
		this.stack.push(node.setAttribute('data-htmlu-id', crypto.randomUUID()));

		this.evalScript.bind(node)(node);
	}

	private evalScript(node: Node) {
		// console.log(this);
		const scripts = node.querySelector('script').innerText;
		eval(scripts);
	}

	private async observe() {
		try {
			this.targetNode = await this.delayedStart();

			this.observer = new MutationObserver(this.collectSelectors.bind(this));
			this.observer.observe(this.targetNode, this.config);

			console.log('observer started');
		} catch (error) {
			console.log(error);
		}
	}

	private delayedStart(): Promise<Node> {
		return new Promise((resolve, reject) => {
			if (typeof window == 'undefined') {
				console.log('window is undefined');
				return;
			}
			if (typeof window === 'object') {
				const targetNode =
					typeof this.targetNode == 'string'
						? document.getElementById(this.targetNode) ?? document.body
						: this.targetNode ?? document.body;

				clearTimeout(this.delay);
				resolve(targetNode);

				return;
			}
		});
	}
}

export default new HtmluModules();
