/** Represents primitive types */
type Primitive = string | number | boolean;

/**
 * Represents the state type
 * For primitives, it wraps the value in an object
 * For non-primitives, it keeps the original type
 */
type State<T> = { stator: T };

/**
 * Callback function type for state changes
 * @param oldValue The previous value of the state
 * @param newValue The new value of the state
 */
type StateChangeHandler<T> = (oldValue: T, newValue: T) => void;

/**
 * Augmented state type that includes the onchange handler
 */
type AugmentedState<T> = State<T> & {
	onchange?: StateChangeHandler<T>;
	toString: () => string;
	valueOf: () => T;
	[Symbol.toPrimitive]: (hint: string) => Primitive;
};

/**
 * Creates a stateful object with change tracking
 * @param initialState The initial state value
 * @returns A proxy object that wraps the state and provides change tracking
 */
export function stator<T>(initialState: T): AugmentedState<T> {
	/**
	 * Checks if a value is of primitive type
	 * @param val The value to check
	 * @returns True if the value is a primitive, false otherwise
	 */
	function isPrimitive(val: unknown): val is Primitive {
		return typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean';
	}

	/**
	 * Logs errors with a custom prefix
	 * @param message The error message
	 * @param error The error object
	 */
	function logError(message: string, error: unknown) {
		console.error(`[Stator Error] ${message}`, error);
	}

	// Create the state object
	const state: State<T> = { stator: initialState };

	// Default onchange handler
	let onchange: StateChangeHandler<T> | undefined;

	/**
	 * Creates a nested proxy for object properties
	 * @param obj The object to proxy
	 * @returns A proxied version of the object
	 */
	function createNestedProxy(obj: any): any {
		if (typeof obj !== 'object' || obj === null) {
			return obj;
		}

		return new Proxy(obj, {
			get(target, property, receiver) {
				return createNestedProxy(Reflect.get(target, property, receiver));
			},
			set(target, property, value, receiver) {
				const oldValue = Reflect.get(target, property, receiver);
				const result = Reflect.set(target, property, value, receiver);
				if (onchange && !Object.is(oldValue, value)) {
					onchange(state.stator, { ...state.stator });
				}
				return result;
			}
		});
	}

	// Proxy handler to intercept property access and modifications
	const handler: ProxyHandler<AugmentedState<T>> = {
		get(target: State<T>, property: string | symbol, receiver: any) {
			try {
				if (property === 'onchange') {
					return onchange;
				}
				if (property === 'stator') {
					return createNestedProxy(target.stator);
				}
				if (property === 'toString') {
					return function () {
						return String(target.stator);
					};
				}
				if (property === 'valueOf') {
					return function () {
						return target.stator;
					};
				}
				if (property === Symbol.toPrimitive) {
					return function (hint: string) {
						if (hint === 'number') return Number(target.stator);
						if (hint === 'string') return String(target.stator);
						return isPrimitive(target.stator) ? target.stator : String(target.stator);
					};
				}
				return Reflect.get(target.stator, property, receiver);
			} catch (error) {
				logError(`Error getting property ${String(property)}:`, error);
				throw error;
			}
		},
		set(target: State<T>, property: string | symbol, value: any, receiver: any) {
			if (property === 'onchange') {
				if (typeof value !== 'function') {
					throw new TypeError('onchange must be a function');
				}
				onchange = value as StateChangeHandler<T>;
				return true;
			}

			try {
				const oldValue = target.stator;
				let newValue: T;

				if (property === 'stator') {
					newValue = value;
					target.stator = value;
				} else if (typeof target.stator === 'object' && target.stator !== null) {
					Reflect.set(target.stator, property, value);
					newValue = { ...target.stator };
				} else {
					throw new Error('Cannot set property on primitive value');
				}

				if (onchange && !Object.is(oldValue, newValue)) {
					// Wrap primitive values in an object for consistency
					const oldWrapped = isPrimitive(oldValue) ? { stator: oldValue } : oldValue;
					const newWrapped = isPrimitive(newValue) ? { stator: newValue } : newValue;
					onchange(oldWrapped as T, newWrapped as T);
				}

				return true;
			} catch (error) {
				logError(`Error setting property ${String(property)}:`, error);
				throw error;
			}
		},
		has(target: State<T>, property: string | symbol) {
			return (
				property === 'onchange' || property === 'stator' || Reflect.has(target.stator, property)
			);
		},
		ownKeys(target: State<T>) {
			return Reflect.ownKeys(target.stator).concat('stator', 'onchange');
		},
		getOwnPropertyDescriptor(target: State<T>, property: string | symbol) {
			if (property === 'onchange' || property === 'stator') {
				return {
					configurable: true,
					enumerable: false,
					value: property === 'stator' ? target.stator : onchange,
					writable: true
				};
			}
			return Reflect.getOwnPropertyDescriptor(target.stator, property);
		}
	};

	// Create and return the proxied state object
	return new Proxy(state, handler) as unknown as AugmentedState<T>;
}
