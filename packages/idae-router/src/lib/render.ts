import type { ActionResult } from './types';

/**
 * Optional error handler invoked when navigation fails.
 * If not provided, errors are logged to console.error.
 */
export type ErrorHandler = (error: Error, path: string) => void;

/**
 * Remove all child nodes from the outlet element.
 *
 * @public
 * @param outlet - The container element to empty.
 * @since 0.1.0
 * @example
 * ```ts
 * cleanupOutlet(document.getElementById('app')!);
 * ```
 */
export function cleanupOutlet(outlet: Element) {
	// remove all children
	while (outlet.firstChild) outlet.removeChild(outlet.firstChild);
}

/**
 * Safely mount content to an outlet element.
 * - Strings are sanitized to prevent XSS; falls back to `textContent` if DOMPurify is unavailable.
 * - `Node` and `DocumentFragment` values are appended directly (assumed safe).
 * - Cleanup functions are ignored here; the router handles them before the next navigation.
 *
 * @public
 * @param outlet - The DOM element to render into.
 * @param result - The value returned by a route `action` (string, Node, DocumentFragment, or void).
 * @since 0.1.0
 * @example
 * ```ts
 * mountResult(document.getElementById('app')!, '<h1>Hello</h1>');
 * ```
 */
export function mountResult(outlet: Element, result: ActionResult) {
	if (result === undefined) return;
	if (typeof result === 'string') {
		cleanupOutlet(outlet);
		// Check if content looks like HTML; if so, attempt sanitization
		if (result.includes('<')) {
			try {
				// Try to use DOMPurify if globally available
				const sanitized = (globalThis as any).DOMPurify?.sanitize?.(result) ?? result;
				outlet.innerHTML = sanitized;
			} catch {
				// Fallback to textContent if sanitization fails or DOMPurify unavailable
				outlet.textContent = result;
			}
		} else {
			// Plain text: safe to render via textContent
			outlet.textContent = result;
		}
		return;
	}
	if (result instanceof DocumentFragment) {
		cleanupOutlet(outlet);
		outlet.appendChild(result);
		return;
	}
	if (result instanceof Node) {
		cleanupOutlet(outlet);
		outlet.appendChild(result);
		return;
	}
	// function (cleanup) is handled by router; do not mount
}

/**
 * Find the nearest `[data-idae-outlet]` element within `root`, or return `root`
 * itself when it matches the selector.
 *
 * Used internally to locate a child outlet within a parent route's rendered tree
 * for nested routing.
 *
 * @public
 * @param root - The element to search within.
 * @param selector - CSS selector for the outlet element. Defaults to `'[data-idae-outlet]'`.
 * @returns The outlet element, or `null` if not found.
 * @since 0.1.0
 * @example
 * ```ts
 * const outlet = findOutlet(parentEl);
 * if (outlet) mountResult(outlet, childContent);
 * ```
 */
export function findOutlet(root: Element, selector = '[data-idae-outlet]'): Element | null {
	if (!root) return null;
	if (root.matches && root.matches(selector)) return root;
	return root.querySelector(selector);
}
