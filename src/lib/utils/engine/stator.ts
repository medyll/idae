type Primitive = string | number | boolean;
type State<T> = T extends Primitive ? { value: T } : T;
type StateChangeHandler<T> = (oldValue: T, newValue: T) => void;

export function stator<T>(initialState: T): State<T> & { onchange?: StateChangeHandler<State<T>> } {
	let objState: State<T> =
		!isPrimitive(initialState) && initialState !== null
			? (initialState as State<T>)
			: ({ value: initialState } as State<T>);

	function isPrimitive(val: unknown) {
		return typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean';
	}

	let onchange = () => {
		console.log('change unset');
	};

	const handler: ProxyHandler<State<T> & { onchange?: StateChangeHandler<State<T>> }> = {
		get(target, property, receiver) {
			// console.log({ target, property, receiver });
			if (isPrimitive(initialState)) {
				return Reflect.get(target, 'value', receiver);
			} else {
				return Reflect.get(target, property, receiver);
			}
		},
		set(target, property, value, receiver) {
			if (property === 'onchange' && typeof value === 'function') {
				onchange = value;
				return true;
			}
			const result = Reflect.set(target, property, value, receiver);

			const oldValue = target[property as keyof State<T>];

			if (onchange && oldValue !== value) {
				//onchange(oldValue as State<T>, value);
				onchange(oldValue, value);
			}
			//console.log({ target, property, value, receiver });
			return result;
		},
		has(target, property) {
			if (property === 'onchange') {
				return true;
			}
			return Reflect.has(target, property);
		},
		ownKeys(target) {
			const keys = Reflect.ownKeys(target);
			return keys.filter((key) => key !== 'onchange');
		}
	};

	return new Proxy<State<T> & { onchange?: StateChangeHandler<State<T>> }>(
		objState as State<T> & { onchange?: StateChangeHandler<State<T>> },
		handler
	);
}
