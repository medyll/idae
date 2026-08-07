/**
 * Runtime class-definition helpers (PrototypeJS-style `Class.create`).
 *
 * Tradeoff to consider before using `createClass`: native ES `class` syntax
 * covers the same need directly, with better typing, tooling and performance:
 *
 * ```ts
 * class Animal { constructor(public name: string) {} speak() {} }
 * class Dog extends Animal { speak() { return 'woof'; } }
 * ```
 *
 * `createClass` is only worth it when the spec object itself is dynamic —
 * e.g. built at runtime from configuration or migrated legacy code that
 * composes behavior objects. For static class hierarchies, prefer real
 * `class` syntax.
 */

/**
 * Builds an ES class at runtime from a spec object. If the spec contains an
 * `initialize` method it acts as the constructor body; `Base` is used as the
 * superclass when provided.
 * @param spec - An object of methods to assign on the prototype. A function
 *   named `initialize` is treated as the constructor.
 * @param Base - Optional base constructor to extend.
 * @returns A new constructor.
 * @example
 * const Animal = createClass({
 *   initialize(name: string) { this.name = name; },
 *   speak() { return `${this.name} makes a sound`; }
 * });
 * const Dog = createClass({ speak() { return 'woof'; } }, Animal);
 * new (Dog as any)('rex').speak(); // 'woof'
 */
export function createClass(
	spec: Record<string, Function>,
	Base?: new (...args: unknown[]) => unknown
): new (...args: unknown[]) => object {
	const Parent = Base ?? Object;

	const Klass = class extends (Parent as new (...args: unknown[]) => object) {
		constructor(...args: unknown[]) {
			super(...args);
			(spec.initialize as ((...a: unknown[]) => void) | undefined)?.apply(this, args);
		}
	};

	Object.assign(Klass.prototype, spec);

	return Klass as new (...args: unknown[]) => object;
}

/**
 * Shallow-merges `source` into `target` and returns `target`.
 * A one-line re-export of `Object.assign` semantics, kept for API parity —
 * prefer `Object.assign` (or object spread) directly in new code.
 */
export function extendObject<T extends object, S extends object>(target: T, source: S): T & S {
	return Object.assign(target, source);
}
