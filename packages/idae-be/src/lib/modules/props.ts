import { Be } from '../be.js';
import type { CommonHandler, HandlerCallBack, HandlerCallBackFn } from '../types.js';

enum PropsMethods {
	set = 'set',
	get = 'get',
	delete = 'delete',
	getKey = 'getKey'
}

export interface PropsHandlerHandle {
	set?: { [key: string]: unknown } & HandlerCallBack;
	delete?: { keys: string[] } & HandlerCallBack;
}

export class PropsHandler implements CommonHandler<PropsHandler, PropsHandlerHandle> {
	private beElement: Be;

	static methods = Object.values(PropsMethods);

	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	methods: (keyof PropsHandler)[] = PropsHandler.methods as (keyof PropsHandler)[];

	handle(actions: PropsHandlerHandle): Be {
		if (!actions) return this.beElement;
		Object.entries(actions).forEach(([method, props]) => {
			switch (method) {
				case 'set':
					{
						const [key, val] = Object.entries(props)[0];
						this.set(key, val, props.callback);
					}
					break;
				case 'delete':
					this.delete(props.delete);
					break;
			}
		});
		return this.beElement;
	}

	get(name: string, callback?: HandlerCallBackFn): any {
		if (this.beElement.isWhat !== 'element') return null;
		return (this.beElement.inputNode as HTMLElement)[name];
	}

	set(nameOrObject: string | Record<string, any>, value?: any, callback?: HandlerCallBackFn): Be {
		this.beElement.eachNode((el) => {
			if (typeof nameOrObject === 'string' && value !== undefined) {
				el[nameOrObject] = value;
			} else if (typeof nameOrObject === 'object') {
				Object.entries(nameOrObject).forEach(([name, val]) => {
					el[name] = val;
				});
			}
		});
		return this.beElement;
	}

	delete(name: string, callback?: HandlerCallBackFn): Be {}

	getKey(key: string, callback?: HandlerCallBackFn): string | null {
		return null;
	}

	valueOf(): Record<string, any> | null {
		if (this.beElement.isWhat !== 'element') return null;
		const el = this.beElement.inputNode as HTMLElement;
		const props = {};
		for (let prop in el) {
			if (el.hasOwnProperty(prop)) {
				props[prop] = el[prop];
			}
		}
		return props;
	}
}
