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

  // Create the state object
  const state: State<T> = { value: initialState };

  // Default onchange handler
  let onchange: StateChangeHandler<T> | undefined;

  // Proxy handler to intercept property access and modifications
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
            return String(target.value);
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
            if (hint === "string") return String(target.value);
            return isPrimitive(target.value)
              ? target.value
              : String(target.value);
          };
        }
        return Reflect.get(target.value, property, receiver);
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
        const oldValue = target.value;
        let newValue: T;

        if (property === "stator") {
          newValue = value;
          target.value = value;
        } else if (typeof target.value === "object" && target.value !== null) {
          Reflect.set(target.value, property, value);
          newValue = { ...target.value };
        } else {
          throw new Error("Cannot set property on primitive value");
        }

        if (onchange && !Object.is(oldValue, newValue)) {
          onchange(oldValue, newValue);
        }

        return true;
      } catch (error) {
        logError(`Error setting property ${String(property)}:`, error);
        throw error;
      }
    },
    // ... (other methods unchanged)
  };

  // Create and return the proxied state object
  return new Proxy(state, handler) as unknown as AugmentedState<T>;
}
