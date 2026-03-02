import type { ActionResult } from './types';

/**
 * Optional error handler invoked when navigation fails.
 * If not provided, errors are logged to console.error.
 */
export type ErrorHandler = (error: Error, path: string) => void;

export function cleanupOutlet(outlet: Element) {
	// remove all children
	while (outlet.firstChild) outlet.removeChild(outlet.firstChild);
}

/**
 * Safely mount content to an outlet element.
 * - Strings are sanitized to prevent XSS; falls back to textContent if untrusted.
 * - Nodes and DocumentFragments are appended directly (assumed safe).
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

export function findOutlet(root: Element, selector = '[data-idae-outlet]'): Element | null {
	if (!root) return null;
	if (root.matches && root.matches(selector)) return root;
	return root.querySelector(selector);
}
