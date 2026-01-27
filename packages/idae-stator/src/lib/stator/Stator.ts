
/** Represents primitive types */
type Primitive = string | number | boolean;


/**
 * Represents the state type
 * For primitives, it wraps the value in an object
 * For non-primitives, it keeps the original type
 */
type State<T> = { value: T };


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
 * Creates a deeply reactive stateful object with change tracking.
 * Deep reactivity is achieved by recursively wrapping nested objects/arrays in proxies.
 * @param initialState The initial state value
 * @returns A proxy object that wraps the state and provides deep change tracking
 */
export function stator<T>(initialState: T): AugmentedState<T> {
  /**
   * Checks if a value is of primitive type
   * @param val The value to check
   * @returns True if the value is a primitive, false otherwise
   */
  function isPrimitive(val: unknown): val is Primitive {
    return (
      typeof val === "string" ||
      typeof val === "number" ||
      typeof val === "boolean"
    );
  }

  /**
   * Logs errors with a custom prefix
   * @param message The error message
   * @param error The error object
   */
  function logError(message: string, error: unknown) {
    console.error(`[Stator Error] ${message}`, error);
  }

  // Default onchange handler
  let onchange: StateChangeHandler<T> | undefined;

  /**
   * Recursively wraps an object or array in a Proxy to enable deep reactivity.
   * @param obj The object or array to wrap
   * @param notifyChange Callback to notify when a change occurs
   * @returns A Proxy that tracks deep changes
   */
  // Helper to clone objects/arrays for oldValue/newValue snapshots
  function deepClone(val: any): any {
    if (isPrimitive(val) || val === null) return val;
    if (Array.isArray(val)) return val.map(deepClone);
    if (typeof val === 'object') {
      const out: any = {};
      for (const k in val) out[k] = deepClone(val[k]);
      return out;
    }
    return val;
  }

  /**
   * Recursively wraps an object or array in a Proxy to enable deep reactivity.
   * Ensures deep mutations trigger the root onchange handler with correct old/new values.
   * Proxy is deeply equal to plain object/array for toEqual.
   */
  // Pass a getter for the current root onchange handler
  // WeakMap to track root state and handler for each object/array
  const rootMap: WeakMap<object, { getOnChange: () => StateChangeHandler<any> | undefined, rootState: { value: any } }> = new WeakMap();

  /**
   * Recursively proxies an object or array to enable deep reactivity.
   * Ensures all nested objects/arrays are always proxied and tracked.
   * All deep mutations trigger the root onchange handler.
   */
  function deepProxy(obj: any, rootInfo?: { getOnChange: () => StateChangeHandler<any> | undefined, rootState: { value: any } }): any {
    if (isPrimitive(obj) || obj === null) return obj;

    // If already proxied, return the proxy
    if (rootMap.has(obj)) return obj;

    // Attach rootInfo if not provided
    if (!rootInfo) {
      throw new Error('deepProxy called without rootInfo');
    }
    rootMap.set(obj, rootInfo);

    const handler: ProxyHandler<any> = {
      get(target, property, receiver) {
        if (property === "onchange") return rootInfo.getOnChange();
        if (property === "stator") return target;
        if (property === "toString") return function () { return JSON.stringify(target); };
        if (property === "valueOf") return function () { return target; };
        if (property === Symbol.toPrimitive) {
          return function (hint: string) {
            if (hint === "number") return Number(target);
            if (hint === "string") return JSON.stringify(target);
            return isPrimitive(target) ? target : JSON.stringify(target);
          };
        }
        if (property === Symbol.for('nodejs.util.inspect.custom')) {
          return () => target;
        }
        if (property === 'constructor') return target.constructor;
        if (property === Symbol.iterator && Array.isArray(target)) {
          return target[Symbol.iterator].bind(target);
        }
        // Array mutating methods
        const mutatingArrayMethods = [
          'copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift',
        ];
          if (Array.isArray(target) && mutatingArrayMethods.includes(property as string)) {
            return (...args: any[]) => {
              const oldValue = deepClone(rootInfo.rootState.value);
              const result = (Array.prototype as any)[property as string].apply(target, args);
              rootInfo.rootState.value = target;
              const currentOnChange = rootInfo.getOnChange();
              if (currentOnChange && !Object.is(oldValue, rootInfo.rootState.value)) {
                currentOnChange(oldValue, deepClone(rootInfo.rootState.value));
              }
              return result;
            };
        }
        let value = Reflect.get(target, property, receiver);
        // Always proxy nested objects/arrays
        if (typeof value === "object" && value !== null) {
          // If not already proxied, wrap and attach root info
          if (!rootMap.has(value)) {
            value = deepProxy(value, rootInfo);
            Reflect.set(target, property, value);
          }
          return value;
        }
        if (!(property in target)) return undefined;
        return value;
      },
      set(target, property, value, receiver) {
        const oldValue = deepClone(rootInfo.rootState.value);
        // Always proxy assigned objects/arrays
        let proxiedValue = value;
        if (typeof value === "object" && value !== null) {
          if (!rootMap.has(value)) {
            proxiedValue = deepProxy(value, rootInfo);
          }
        }
        const result = Reflect.set(target, property, proxiedValue, receiver);
        rootInfo.rootState.value = target;
        const currentOnChange = rootInfo.getOnChange();
        if (process && process.env && process.env.DEBUG_STAT0R) {
          // eslint-disable-next-line no-console
          console.log('[Stator Debug] set trap (deepProxy):', {
            target,
            property,
            value,
            oldValue,
            handler: !!currentOnChange,
            isRoot: rootInfo.rootState === target,
            rootState: rootInfo.rootState,
          });
        }
        if (currentOnChange && !Object.is(oldValue, rootInfo.rootState.value)) {
          if (process && process.env && process.env.DEBUG_STAT0R) {
            // eslint-disable-next-line no-console
            console.log('[Stator Debug] calling onchange (deepProxy)', { oldValue, newValue: deepClone(rootInfo.rootState.value) });
          }
          currentOnChange(oldValue, deepClone(rootInfo.rootState.value));
        }
        return result;
      },
      deleteProperty(target, property) {
        const oldValue = deepClone(rootInfo.rootState.value);
        const result = Reflect.deleteProperty(target, property);
        rootInfo.rootState.value = target;
        const currentOnChange = rootInfo.getOnChange();
        if (currentOnChange && !Object.is(oldValue, rootInfo.rootState.value)) {
          currentOnChange(oldValue, deepClone(rootInfo.rootState.value));
        }
        return result;
      },
      ownKeys(target) {
        return Reflect.ownKeys(target);
      },
      getOwnPropertyDescriptor(target, prop) {
        return Object.getOwnPropertyDescriptor(target, prop) || {
          configurable: true,
          enumerable: true,
          value: undefined,
          writable: true,
        };
      },
    };
    return new Proxy(obj, handler);
  }


  // Recursively proxy all nested objects/arrays at initialization
  function prepareInitialValue(val: any, rootInfo: { getOnChange: () => StateChangeHandler<any> | undefined, rootState: { value: any } }): any {
    if (isPrimitive(val) || val === null) return val;
    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        val[i] = prepareInitialValue(val[i], rootInfo);
      }
      return deepProxy(val, rootInfo);
    }
    if (typeof val === 'object') {
      for (const k in val) {
        val[k] = prepareInitialValue(val[k], rootInfo);
      }
      return deepProxy(val, rootInfo);
    }
    return val;
  }

  // Create the state object
  const state: State<T> = { value: undefined as any };

  // Attach rootInfo for the root value
  const rootInfo = { getOnChange: () => onchange, rootState: state };
  state.value = prepareInitialValue(initialState, rootInfo);

  // Proxy handler for the root state object
  const handler: ProxyHandler<AugmentedState<T>> = {
    get(target: State<T>, property: string | symbol, receiver: any) {
      try {
        if (property === "onchange") {
          return onchange;
        }
        if (property === "stator") {
          return target.value;
        }
        if (property === "toString") {
          return function () {
            return JSON.stringify(target.value);
          };
        }
        if (property === "valueOf") {
          return function () {
            return target.value;
          };
        }
        if (property === Symbol.toPrimitive) {
          return function (hint: string) {
            if (hint === "number") return Number(target.value);
            if (hint === "string") return JSON.stringify(target.value);
            return isPrimitive(target.value)
              ? target.value
              : JSON.stringify(target.value);
          };
        }
        if (property === Symbol.for('nodejs.util.inspect.custom')) {
          return () => target.value;
        }
        if (property === 'constructor') return target.value?.constructor;
        if (property === Symbol.iterator && Array.isArray(target.value)) {
          return target.value[Symbol.iterator].bind(target.value);
        }
        // For objects/arrays, return a deep proxy for deep reactivity
        const value = Reflect.get(target, "value", receiver);
        if (typeof value === "object" && value !== null) {
          // Always attach root info and proxy
          const rootInfo = { getOnChange: () => onchange, rootState: target };
          return deepProxy(value, rootInfo);
        }
        // For primitives, just return the value
        return value;
      } catch (error) {
        logError(`Error getting property ${String(property)}:`, error);
        throw error;
      }
    },
    set(
      target: State<T>,
      property: string | symbol,
      value: any,
      receiver: any,
    ) {
      if (property === "onchange") {
        if (typeof value !== "function") {
          throw new TypeError("onchange must be a function");
        }
        onchange = value as StateChangeHandler<T>;
        return true;
      }

      try {
        // Support setting .value for primitives and objects
        if (property === "value") {
          const oldValue = deepClone(target.value);
          target.value = value;
          if (onchange && !Object.is(oldValue, value)) {
            onchange(oldValue, deepClone(value));
          }
          return true;
        }
        // Support setting .stator for primitives and objects
        if (property === "stator") {
          const oldValue = deepClone(target.value);
          target.value = value;
          if (onchange && !Object.is(oldValue, value)) {
            onchange(oldValue, deepClone(value));
          }
          return true;
        }
        // For objects, allow property set
        if (typeof target.value === "object" && target.value !== null) {
          const oldValue = deepClone(target.value);
          Reflect.set(target.value, property, value);
          if (onchange && !Object.is(oldValue, target.value)) {
            onchange(oldValue, deepClone(target.value));
          }
          return true;
        }
        // For primitives, disallow setting arbitrary properties
        throw new Error("Cannot set property on primitive value");
      } catch (error) {
        logError(`Error setting property ${String(property)}:`, error);
        throw error;
      }
    },
    ownKeys(target) {
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(target, prop) {
      return Object.getOwnPropertyDescriptor(target, prop) || {
        configurable: true,
        enumerable: true,
        value: undefined,
        writable: true,
      };
    },
  };

  // Create and return the proxied state object
  return new Proxy(state, handler) as unknown as AugmentedState<T>;
}
