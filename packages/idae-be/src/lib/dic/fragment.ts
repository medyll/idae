const nodesList: Record<string, HTMLElement> = {};

export class Fragments {
	static fragments: Record<string, Fragments> = {};

	create(tag: string, attributes?: Record<string, string>) {
		if (!nodesList[tag]) {
			nodesList[tag] = document.createElement(tag);
		}
		const fragment = document.createDocumentFragment();
		const cloned: HTMLElement = nodesList[tag].cloneNode(true) as HTMLElement;

		if (attributes) {
			Object.entries(attributes).forEach(([key, value]) => {
				cloned.setAttribute(key, value);
			});
		}
		fragment.appendChild(cloned);

		return fragment;
	}
}
