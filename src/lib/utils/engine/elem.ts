class beElem {
	private node: HTMLElement | HTMLElement[] | string;
	private isWhat: string | HTMLElement | HTMLElement[];

	private constructor(node: HTMLElement | HTMLElement[] | string) {
		this.node = node;
		this.isWhat = typeof node === 'string' ? 'qy' : node;
		this.isWhat = Array.isArray(node) ? 'array' : this.isWhat;
		this.isWhat = node instanceof HTMLElement ? 'element' : this.isWhat;
	}

	public static elem(node: HTMLElement | HTMLElement[] | string) {
		return new beElem(node);
	}

	private findWhile(
		element: HTMLElement | Element | any,
		property: keyof HTMLElement,
		expression: string | number = 0
	) {
		let sibling = element[property];
		while (sibling) {
			if (sibling.matches(expression)) {
				return sibling;
			}
			sibling = sibling[property];
		}
	}

	public find(qy: string) {
		switch (this.isWhat) {
			case 'element':
				return (this.node as HTMLElement).querySelector(qy);
			case 'array':
				return (this.node as HTMLElement[]).map((node) => node.querySelector(qy));
			case 'string':
				return document.querySelector(this.node as string)?.querySelector(qy);
		}
	}

	public findAll(qy: string) {
		switch (this.isWhat) {
			case 'element':
				return (this.node as HTMLElement).querySelectorAll(qy);
			case 'array':
				return (this.node as HTMLElement[]).map((node) => node.querySelectorAll(qy));
			case 'string':
				return Array.from(document.querySelectorAll(this.node as string)).flatMap((node) =>
					node.querySelectorAll(qy)
				);
		}
	}

	public up(qy?: string | undefined) {
		switch (this.isWhat) {
			case 'element':
				return this.findWhile(this.node, 'parentNode', qy);
			case 'array':
				return (this.node as HTMLElement[]).map((node) => this.findWhile(node, 'parentNode', qy));
			case 'string':
				return Array.from(document.querySelectorAll(this.node as string)).flatMap((node) =>
					this.findWhile(node, 'parentNode', qy)
				);
		}
	}

	public next(qy?: string | undefined) {
		switch (this.isWhat) {
			case 'element':
				return this.findWhile(this.node, 'nextElementSibling', qy);
			case 'array':
				return (this.node as HTMLElement[]).map((node) =>
					this.findWhile(node, 'nextElementSibling', qy)
				);
			case 'string':
				return Array.from(document.querySelectorAll(this.node as string)).flatMap((node) =>
					this.findWhile(node, 'nextElementSibling', qy)
				);
		}
	}

	public previous(qy?: string | undefined) {
		switch (this.isWhat) {
			case 'element':
				return this.findWhile(this.node, 'previousElementSibling', qy);
			case 'array':
				return (this.node as HTMLElement[]).map((node) =>
					this.findWhile(node, 'previousElementSibling', qy)
				);
			case 'string':
				return Array.from(document.querySelectorAll(this.node as string)).flatMap((node) =>
					this.findWhile(node, 'previousElementSibling', qy)
				);
		}
	}

	public setStyle(styles: Record<string, any>) {
		switch (this.isWhat) {
			case 'element':
				const elementStyle = this.node.style;
				for (const property in styles) {
					// @ts-ignore
					elementStyle[property] = styles[property];
				}
				return this.node;
			case 'array':
				(this.node as HTMLElement[]).forEach((node) => {
					const elementStyle = node.style;
					for (const property in styles) {
						// @ts-ignore
						elementStyle[property] = styles[property];
					}
				});

				return this.node;
			case 'string':
				Array.from(document.querySelectorAll(this.node as string)).forEach((node) => {
					const elementStyle = (node as HTMLElement).style;
					for (const property in styles) {
						// @ts-ignore
						elementStyle[property] = styles[property];
					}
				});

				return this.node;
		}

		return this.node;
	}
}

const elem = (node: HTMLElement | HTMLElement[] | string) => {
	let isWhat: string | HTMLElement | HTMLElement[] = typeof node === 'string' ? 'qy' : node;
	isWhat = Array.isArray(node) ? 'array' : isWhat;
	isWhat = node instanceof HTMLElement ? 'element' : isWhat;

	const elements = Array.isArray(node)
		? node
		: Array.from(document.querySelectorAll(node as string));

	function findWhile(
		element: HTMLElement | Element | any,
		property: keyof HTMLElement,
		expression: string | number = 0
	) {
		let sibling = element[property];
		while (sibling) {
			if (sibling.matches(expression)) {
				return sibling;
			}
			sibling = sibling[property];
		}
	}

	return {
		find: (qy: string) => {
			switch (isWhat) {
				case 'element':
					return (node as HTMLElement).querySelector(qy);
				case 'array':
					return (node as HTMLElement[]).map((node) => node.querySelector(qy));
				case 'string':
					return document.querySelector(node as string)?.querySelector(qy);
			}
		},
		findAll: (qy: string) => {
			switch (isWhat) {
				case 'element':
					return (node as HTMLElement).querySelectorAll(qy);
				case 'array':
					return (node as HTMLElement[]).map((node) => node.querySelectorAll(qy));
				case 'string':
					return Array.from(document.querySelectorAll(node as string)).flatMap((node) =>
						node.querySelectorAll(qy)
					);
			}
		},
		up: (qy?: string | undefined) => {
			switch (isWhat) {
				case 'element':
					return findWhile(node, 'parentNode', qy);
				case 'array':
					return (node as HTMLElement[]).map((node) => findWhile(node, 'parentNode', qy));
				case 'string':
					return Array.from(document.querySelectorAll(node as string)).flatMap((node) =>
						findWhile(node, 'parentNode', qy)
					);
			}
		},
		next: (qy?: string | undefined) => {
			switch (isWhat) {
				case 'element':
					return findWhile(node, 'nextElementSibling', qy);
				case 'array':
					return (node as HTMLElement[]).map((node) => findWhile(node, 'nextElementSibling', qy));
				case 'string':
					return Array.from(document.querySelectorAll(node as string)).flatMap((node) =>
						findWhile(node, 'nextElementSibling', qy)
					);
			}
		},
		previous: (qy?: string | undefined) => {
			switch (isWhat) {
				case 'element':
					return findWhile(node, 'previousElementSibling', qy);
				case 'array':
					return (node as HTMLElement[]).map((node) =>
						findWhile(node, 'previousElementSibling', qy)
					);
				case 'string':
					return Array.from(document.querySelectorAll(node as string)).flatMap((node) =>
						findWhile(node, 'previousElementSibling', qy)
					);
			}
		},
		setStyle: (styles: Record<string, any>) => {
			switch (isWhat) {
				case 'element':
					const elementStyle = node.style;
					for (const property in styles) {
						// @ts-ignore
						elementStyle[property] = styles[property];
					}
					return node;
				case 'array':
					(node as HTMLElement[]).forEach((node) => {
						const elementStyle = node.style;
						for (const property in styles) {
							// @ts-ignore
							elementStyle[property] = styles[property];
						}
					});

					return node;
				case 'string':
					Array.from(document.querySelectorAll(node as string)).forEach((node) => {
						const elementStyle = (node as HTMLElement).style;
						for (const property in styles) {
							// @ts-ignore
							elementStyle[property] = styles[property];
						}
					});

					return node;
			}

			return node;
		}
	};
};

const be = elem;
export { elem, be };
