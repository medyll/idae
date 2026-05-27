export interface ParsedLink {
	action: 'loadFrame' | 'loadIn';
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
	if (action !== 'loadFrame' && action !== 'loadIn') return null;
	const module = base.slice(colonIdx + 1);
	if (!module) return null;
	return { action, module, zone };
}
