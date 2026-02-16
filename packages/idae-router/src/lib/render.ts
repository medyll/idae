import type { ActionResult } from './types';

export function cleanupOutlet(outlet: Element) {
	// remove all children
	while (outlet.firstChild) outlet.removeChild(outlet.firstChild);
}

export function mountResult(outlet: Element, result: ActionResult) {
	if (result === undefined) return;
	if (typeof result === 'string') {
		cleanupOutlet(outlet);
		outlet.innerHTML = result;
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
