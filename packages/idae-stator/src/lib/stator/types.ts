/**
 * Represents JavaScript primitive types
 */
export type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/**
 * Internal state wrapper structure (uses _value to avoid conflicts with user objects)
 */
export type StateWrapper<T> = { _value: T };

/**
 * Callback function type for state changes
 */
export type StateChangeHandler<T> = (oldValue: T, newValue: T) => void;

/**
 * Augmented state type providing reactivity, event subscription, and utility methods
 */
export type AugmentedState<T> = {
  /** Access to the current state value */
  value: T;
  /** Access to the raw state data (alias for value) */
  stator: T;
  /** The callback triggered on any state mutation */
  onchange?: StateChangeHandler<T>;
  /** Standard event listener for 'stator:change' events */
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
  /** Removes a previously attached event listener */
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
  /** Manually dispatches an event */
  triggerChange: (event: Event) => boolean;
  /** Returns a JSON string representation of the state */
  toString: () => string;
  /** Returns the raw underlying value */
  valueOf: () => T;
  /** Handles implicit type conversion (string/number) */
  [Symbol.toPrimitive]: (hint: string) => Primitive;
  /**
   * Subscribe to state changes. Returns an unsubscribe function.
   * @example
   * const unsub = state.subscribe((newVal, oldVal) => console.log(newVal));
   * unsub(); // stop listening
   */
  subscribe: (listener: StateChangeHandler<T>) => () => void;
  /**
   * Batch multiple mutations into a single change notification.
   * @example
   * state.batch(() => {
   *   state.value.x = 1;
   *   state.value.y = 2;
   * }); // only one 'stator:change' event fired
   */
  batch: (fn: () => void) => void;
};

/**
 * Configuration for the unified handler factory
 */
export interface HandlerContext<T> {
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
