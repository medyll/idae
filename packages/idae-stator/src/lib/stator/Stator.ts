/** * Represents JavaScript primitive types 
 */
type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/**
 * Basic state wrapper structure
 */
type State<T> = { value: T };

/**
 * Callback function type for state changes
 */
type StateChangeHandler<T> = (newValue: T) => void;

/**
 * Augmented state type providing reactivity, event subscription, and utility methods
 */
type AugmentedState<T> = State<T> & {
  /** The callback triggered on any state mutation */
  onchange?: StateChangeHandler<T>;
  /** Standard event listener for 'change' events */
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
  /** Removes a previously attached 'change' event listener */
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
  /** Manually dispatches an event */
  triggerChange: (event: Event) => boolean;
  /** Returns a JSON string representation of the state */
  toString: () => string;
  /** Returns the raw underlying value */
  valueOf: () => T;
  /** Handles implicit type conversion (string/number) */
  [Symbol.toPrimitive]: (hint: string) => Primitive;
  /** Access to the raw state data */
  stator: T;
};

/**
 * Creates a deeply reactive state object.
 * * Features:
 * - Deep reactivity via Proxy (works with nested objects and arrays)
 * - EventTarget compatible (works in Browser and Node.js)
 * - No redundant notifications on array mutations
 * - Memory efficient using WeakMap for proxy tracking
 * * @param initialState The initial value to wrap
 * @returns A reactive Proxy object
 */
export function stator<T>(initialState: T): AugmentedState<T> {
  
  /**
   * Internal EventTarget polyfill to ensure cross-environment compatibility (Node/Browser)
   */
  class StatorEventTarget {
    private et: EventTarget;
    constructor() {
      if (typeof window !== 'undefined' && typeof window.EventTarget !== 'undefined') {
        this.et = new window.EventTarget();
      } else if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
        this.et = document.createElement('span');
      } else {
        // Fallback for Node.js environments without built-in EventTarget
        let listeners: Record<string, Set<EventListenerOrEventListenerObject>> = {};
        this.et = {
          addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
            if (!listeners[type]) listeners[type] = new Set();
            listeners[type].add(listener);
          },
          removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
            listeners[type]?.delete(listener);
          },
          dispatchEvent(event: Event) {
            const ls = listeners[event.type];
            if (!ls) return true;
            for (const l of Array.from(ls)) {
              if (typeof l === 'function') l.call(undefined, event);
              else if (l && typeof l.handleEvent === 'function') l.handleEvent(event);
            }
            return true;
          }
        } as unknown as EventTarget;
      }
    }
    addEventListener(...args: Parameters<EventTarget['addEventListener']>) { this.et.addEventListener(...args); }
    removeEventListener(...args: Parameters<EventTarget['removeEventListener']>) { this.et.removeEventListener(...args); }
    triggerChange(event: Event) { return this.et.dispatchEvent(event); }
  }

  const eventTarget = new StatorEventTarget();
  const proxyCache = new WeakMap<object, any>();
  
  let onchange: StateChangeHandler<T> | undefined;
  let onchangeListener: ((e: Event) => void) | undefined;

  /**
   * Type guard to check for primitive values
   */
  function isPrimitive(val: unknown): val is Primitive {
    return val === null || (typeof val !== "object" && typeof val !== "function");
  }

  /**
   * Dispatches the change event to all subscribers
   */
  function notify(newValue: any) {
    eventTarget.triggerChange(new CustomEvent('change', { detail: { newValue } }));
  }

  /**
   * Recursively creates a Proxy for nested objects or arrays
   */
  function deepProxy(obj: any, info: { getOnChange: () => any, rootState: any }): any {
    if (isPrimitive(obj)) return obj;
    if (proxyCache.has(obj)) return proxyCache.get(obj);

    const handler: ProxyHandler<any> = {
      get(target, property, receiver) {
        // Special internal property mapping
        const reserved: Record<string | symbol, any> = {
          onchange: info.getOnChange(),
          addEventListener: eventTarget.addEventListener.bind(eventTarget),
          removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
          triggerChange: eventTarget.triggerChange.bind(eventTarget),
          stator: target,
          valueOf: () => target,
          toString: () => JSON.stringify(target),
          [Symbol.for('nodejs.util.inspect.custom')]: () => target
        };

        if (property in reserved) return reserved[property];

        if (property === Symbol.toPrimitive) {
          return (hint: string) => hint === "number" ? Number(target) : JSON.stringify(target);
        }

        let value = Reflect.get(target, property, receiver);
        return isPrimitive(value) ? value : deepProxy(value, info);
      },

      set(target, property, value, receiver) {
        const oldValue = target[property];
        const proxiedValue = isPrimitive(value) ? value : deepProxy(value, info);
        const result = Reflect.set(target, property, proxiedValue, receiver);
        
        // Only notify if the value actually changed to prevent loops
        if (oldValue !== proxiedValue) {
          notify(info.rootState.value);
        }
        return result;
      },

      deleteProperty(target, property) {
        const result = Reflect.deleteProperty(target, property);
        notify(info.rootState.value);
        return result;
      }
    };

    const proxy = new Proxy(obj, handler);
    proxyCache.set(obj, proxy);
    return proxy;
  }

  const stateWrapper: State<T> = { value: undefined as any };
  const sharedInfo = { getOnChange: () => onchange, rootState: stateWrapper };

  // Initialize the state value
  stateWrapper.value = isPrimitive(initialState) ? initialState : deepProxy(initialState, sharedInfo);

  /**
   * Root Proxy Handler
   */
  const rootHandler: ProxyHandler<State<T>> = {
    get(target, property, receiver) {
      if (property === "value" || property === "stator") return target.value;
      if (property === "onchange") return onchange;
      if (property === "addEventListener") return eventTarget.addEventListener.bind(eventTarget);
      if (property === "removeEventListener") return eventTarget.removeEventListener.bind(eventTarget);
      
      // Allow direct property access on the state object (e.g., state.someProp)
      if (!isPrimitive(target.value)) {
        return Reflect.get(target.value as object, property, receiver);
      }
      return Reflect.get(target, property, receiver);
    },

    set(target, property, value) {
      // Logic for the onchange callback property
      if (property === "onchange") {
        if (onchangeListener) eventTarget.removeEventListener("change", onchangeListener);
        if (typeof value === "function") {
          onchange = value;
          onchangeListener = (e: any) => onchange?.(e.detail.newValue);
          eventTarget.addEventListener("change", onchangeListener);
        } else if (value == null) {
          onchange = undefined;
        } else {
          throw new TypeError("onchange must be a function or undefined");
        }
        return true;
      }

      // Logic for updating the core value
      if (property === "value" || property === "stator") {
        target.value = isPrimitive(value) ? value : deepProxy(value, sharedInfo);
        notify(target.value);
        return true;
      }
      return false;
    }
  };

  return new Proxy(stateWrapper, rootHandler) as unknown as AugmentedState<T>;
}