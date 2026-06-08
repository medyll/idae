export type LinkAction = 'loadFrame' | 'loadIn' | 'loadInDialog';
/** Typed link string — format: `"action:module"` or `"action:module@zone"`. */
export type LinkString = `${LinkAction}:${string}` | `${LinkAction}:${string}@${string}`;

export interface ParsedLink {
	action: LinkAction;
	module: string;
	zone: string;
}

export function parseLink(link: string): ParsedLink | null {
	const atIdx = link.indexOf('@');
	const zone = atIdx !== -1 ? link.slice(atIdx + 1) : 'main';
	const base = atIdx !== -1 ? link.slice(0, atIdx) : link;
	const colonIdx = base.indexOf(':');
	if (colonIdx === -1) return null;
	const action = base.slice(0, colonIdx);
	if (action !== 'loadFrame' && action !== 'loadIn' && action !== 'loadInDialog') return null;
	const module = base.slice(colonIdx + 1);
	if (!module) return null;
	return { action, module, zone };
}
