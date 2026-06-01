import { describe, it, expect } from 'vitest';
import { parseLink } from '../frame/linkParser.js';

describe('parseLink', () => {
	it('parses loadFrame with default zone', () => {
		expect(parseLink('loadFrame:explorer')).toEqual({ action: 'loadFrame', module: 'explorer', zone: 'main' });
	});

	it('parses loadIn with default zone', () => {
		expect(parseLink('loadIn:card.form')).toEqual({ action: 'loadIn', module: 'card.form', zone: 'main' });
	});

	it('parses custom zone', () => {
		expect(parseLink('loadFrame:explorer@main.modal')).toEqual({ action: 'loadFrame', module: 'explorer', zone: 'main.modal' });
	});

	it('parses loadIn with custom zone', () => {
		expect(parseLink('loadIn:explorer@main.panel')).toEqual({ action: 'loadIn', module: 'explorer', zone: 'main.panel' });
	});

	it('returns null when no colon', () => {
		expect(parseLink('loadFrame')).toBeNull();
		expect(parseLink('explorer')).toBeNull();
	});

	it('returns null for empty string', () => {
		expect(parseLink('')).toBeNull();
	});

	it('handles module with dots', () => {
		const r = parseLink('loadFrame:card.form@main.modal');
		expect(r?.module).toBe('card.form');
		expect(r?.zone).toBe('main.modal');
	});
});
