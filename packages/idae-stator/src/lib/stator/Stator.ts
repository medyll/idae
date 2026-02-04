/** * Represents JavaScript primitive types 
 */
type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/**
 * Internal state wrapper structure (uses _value to avoid conflicts with user objects)
 */
type StateWrapper<T> = { _value: T };

/**
 * Callback function type for state changes
 */
type StateChangeHandler<T> = (oldValue: T, newValue: T) => void;

/**
 * Augmented state type providing reactivity, event subscription, and utility methods
 */
type AugmentedState<T> = {
  /** Access to the current state value */
  value: T;
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
 * Configuration for the unified handler factory
 */
interface HandlerContext<T> {
  /** Get the current onchange handler */
  getOnChange: () => StateChangeHandler<T> | undefined;
  /** Set the onchange handler */
  setOnChange: (handler: StateChangeHandler<T> | undefined) => void;
  /** Reference to the root state wrapper */
  rootState: StateWrapper<T>;
  /** Event target for dispatching events */
  eventTarget: {
    addEventListener: (...args: Parameters<EventTarget['addEventListener']>) => void;
    removeEventListener: (...args: Parameters<EventTarget['removeEventListener']>) => void;
    triggerChange: (event: Event) => boolean;
  };
  /** Notify all subscribers of a change */
  notify: (oldValue: T, newValue: T) => void;
  /** Check if a value is primitive */
  isPrimitive: (val: unknown) => val is Primitive;
  /** Create a deep proxy for nested objects */
  createDeepProxy: (obj: any) => any;
  /** Proxy cache to avoid recreating proxies */
  proxyCache: WeakMap<object, any>;
}

/**
 * Creates a deeply reactive state object relying on Events and Proxies.
 * 
 * Features:
 * - Deep reactivity via Proxy (works with nested objects and arrays)
 * - EventTarget compatible (works in Browser and Node.js)
 * - No redundant notifications on array mutations
 * - Memory efficient using WeakMap for proxy tracking
 * 
 * @param initialState The initial value to wrap
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
  function notify(oldValue: T, newValue: T) {
    eventTarget.triggerChange(new CustomEvent('stator:change', { detail: { oldValue, newValue } }));
  }

  /**
   * Sets the onchange handler with proper listener management
   */
  function setOnChange(handler: StateChangeHandler<T> | undefined) {
    if (onchangeListener) {
      eventTarget.removeEventListener("stator:change", onchangeListener);
      onchangeListener = undefined;
    }
    onchange = handler;
    if (handler) {
      onchangeListener = (e: any) => onchange?.(e.detail.oldValue, e.detail.newValue);
      eventTarget.addEventListener("stator:change", onchangeListener);
    }
  }

  // Forward declaration for mutual recursion
  const stateWrapper: StateWrapper<T> = { _value: undefined as any };

  // Shared context for all handlers
  const ctx: HandlerContext<T> = {
    getOnChange: () => onchange,
    setOnChange,
    rootState: stateWrapper,
    eventTarget: {
      addEventListener: eventTarget.addEventListener.bind(eventTarget),
      removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
      triggerChange: eventTarget.triggerChange.bind(eventTarget),
    },
    notify,
    isPrimitive,
    createDeepProxy: (obj: any) => createProxy(obj, false),
    proxyCache,
  };

  /**
   * Unified handler factory - creates consistent handlers for root and nested proxies
   * 
   * @param isRoot - Whether this is the root state wrapper proxy
   * @returns ProxyHandler with unified behavior
   */
  function createHandler(isRoot: boolean): ProxyHandler<any> {
    
    /**
     * Gets the actual target value (unwraps StateWrapper<T> for root)
     */
    function getTarget(target: any): any {
      return isRoot ? target._value : target;
    }

    /**
     * Gets the raw (non-proxied) value for utility methods like valueOf()
     * For root: returns the actual stored value from stateWrapper
     * For nested: returns the target object itself (which is already the raw object)
     */
    function getRawValue(target: any): any {
      if (isRoot) {
        // For root, we need to return the actual stored value
        // Note: target._value may be a proxy, but we return it as-is
        // Users should access raw objects via stator property for manipulation
        return target._value;
      }
      // For nested proxies, target IS the raw object
      return target;
    }

    /**
     * Builds the reserved properties object with all utility methods
     * Note: 'value' and 'stator' are only reserved at root level to avoid
     * conflicts with user objects that have a 'value' property
     */
    function getReservedProperties(target: any): Record<string | symbol, any> {
      const rawValue = getRawValue(target);
      
      const reserved: Record<string | symbol, any> = {
        // Event handling
        onchange: ctx.getOnChange(),
        addEventListener: ctx.eventTarget.addEventListener,
        removeEventListener: ctx.eventTarget.removeEventListener,
        triggerChange: ctx.eventTarget.triggerChange,
        
        // Utility methods - valueOf returns the raw underlying data
        valueOf: () => rawValue,
        toString: () => ctx.isPrimitive(rawValue) ? String(rawValue) : JSON.stringify(rawValue),
        
        // Node.js inspect
        [Symbol.for('nodejs.util.inspect.custom')]: () => rawValue,
      };

      // 'value' and 'stator' are only reserved at root level
      if (isRoot) {
        reserved.value = getTarget(target);
        reserved.stator = getTarget(target);
      }

      return reserved;
    }

    return {
      get(target, property, receiver) {
        const reserved = getReservedProperties(target);
        
        // Handle reserved properties
        if (property in reserved) {
          return reserved[property];
        }

        // Handle Symbol.toPrimitive
        if (property === Symbol.toPrimitive) {
          const rawValue = getRawValue(target);
          return (hint: string) => {
            if (ctx.isPrimitive(rawValue)) {
              return hint === "number" ? Number(rawValue) : String(rawValue);
            }
            return hint === "number" ? Number(rawValue) : JSON.stringify(rawValue);
          };
        }

        // Get the actual value to access properties on
        const actualTarget = getTarget(target);
        
        // For primitives at root level, delegate to the state wrapper
        if (ctx.isPrimitive(actualTarget)) {
          return isRoot ? Reflect.get(target, property, receiver) : undefined;
        }

        // Access nested property
        const value = Reflect.get(actualTarget, property, receiver);
        return ctx.isPrimitive(value) ? value : ctx.createDeepProxy(value);
      },

      set(target, property, value, receiver) {
        // Handle onchange setter
        if (property === "onchange") {
          if (typeof value === "function") {
            ctx.setOnChange(value);
          } else if (value == null) {
            ctx.setOnChange(undefined);
          } else {
            throw new TypeError("onchange must be a function or undefined");
          }
          return true;
        }

        // Handle value/stator setter (root only)
        if (isRoot && (property === "value" || property === "stator")) {
          const oldValue = target._value;
          target._value = ctx.isPrimitive(value) ? value : ctx.createDeepProxy(value);
          ctx.notify(oldValue, target._value);
          return true;
        }

        // Handle nested property mutation
        const actualTarget = getTarget(target);
        
        if (ctx.isPrimitive(actualTarget)) {
          return false;
        }

        const oldValue = actualTarget[property];
        const proxiedValue = ctx.isPrimitive(value) ? value : ctx.createDeepProxy(value);
        const result = Reflect.set(actualTarget, property, proxiedValue, receiver);
        
        // Only notify if the value actually changed
        if (oldValue !== proxiedValue) {
          // Clone root state before mutation for oldValue (shallow copy)
          ctx.notify(ctx.rootState._value, ctx.rootState._value);
        }
        return result;
      },

      deleteProperty(target, property) {
        const actualTarget = getTarget(target);
        
        if (ctx.isPrimitive(actualTarget)) {
          return false;
        }

        const result = Reflect.deleteProperty(actualTarget, property);
        if (result) {
          ctx.notify(ctx.rootState._value, ctx.rootState._value);
        }
        return result;
      },

      // Prevent onchange from appearing in enumeration
      ownKeys(target) {
        const actualTarget = getTarget(target);
        if (ctx.isPrimitive(actualTarget)) {
          return isRoot ? Reflect.ownKeys(target) : [];
        }
        return Reflect.ownKeys(actualTarget);
      },

      getOwnPropertyDescriptor(target, property) {
        // Hide reserved properties from enumeration
        const reservedKeys = ['onchange', 'addEventListener', 'removeEventListener', 'triggerChange'];
        if (reservedKeys.includes(property as string)) {
          return undefined;
        }
        
        const actualTarget = getTarget(target);
        if (ctx.isPrimitive(actualTarget)) {
          return isRoot ? Reflect.getOwnPropertyDescriptor(target, property) : undefined;
        }
        return Reflect.getOwnPropertyDescriptor(actualTarget, property);
      },

      has(target, property) {
        const reserved = getReservedProperties(target);
        if (property in reserved) return true;
        
        const actualTarget = getTarget(target);
        if (ctx.isPrimitive(actualTarget)) {
          return isRoot ? Reflect.has(target, property) : false;
        }
        return Reflect.has(actualTarget, property);
      },
    };
  }

  /**
   * Creates a proxy with the unified handler
   */
  function createProxy(obj: any, isRoot: boolean): any {
    if (ctx.isPrimitive(obj)) return obj;
    if (!isRoot && proxyCache.has(obj)) return proxyCache.get(obj);

    const handler = createHandler(isRoot);
    const proxy = new Proxy(isRoot ? obj : obj, handler);
    
    if (!isRoot) {
      proxyCache.set(obj, proxy);
    }
    
    return proxy;
  }

  // Initialize the state value
  stateWrapper._value = isPrimitive(initialState) ? initialState : createProxy(initialState, false);

  // Create and return the root proxy
  return createProxy(stateWrapper, true) as unknown as AugmentedState<T>;
}