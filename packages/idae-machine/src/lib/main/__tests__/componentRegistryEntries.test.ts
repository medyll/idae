import { describe, it, expect, beforeAll } from 'vitest';
import { componentRegistry } from '../router/componentRegistry.js';
import { IdaeFrameCatalog } from '$lib/idae/frames/FrameCatalog.js';

beforeAll(() => {
	new IdaeFrameCatalog().registerFrames(componentRegistry);
});

describe('Global componentRegistry entries', () => {
	it('has "explorer" registered', () => {
		expect(componentRegistry.has('explorer')).toBe(true);
	});

	it('has "explorer.content" registered (bare DataList loaded into Explorer zone)', () => {
		expect(componentRegistry.has('explorer.content')).toBe(true);
	});

	it('does NOT have "explorer.collections" (removed — CollectionNav handles sidebar nav)', () => {
		expect(componentRegistry.has('explorer.collections')).toBe(false);
	});

	it('has "form" registered pointing to DataForm', () => {
		expect(componentRegistry.has('form')).toBe(true);
	});

	it('has "fiche" registered pointing to Fiche.svelte', () => {
		expect(componentRegistry.has('fiche')).toBe(true);
	});

	it('does NOT have removed aliases', () => {
		expect(componentRegistry.has('card.create')).toBe(false);
		expect(componentRegistry.has('card.edit')).toBe(false);
		expect(componentRegistry.has('card.picker')).toBe(false);
	});

	it('does NOT have old explorer.* entries', () => {
		expect(componentRegistry.has('explorer.list')).toBe(false);
		expect(componentRegistry.has('explorer.table')).toBe(false);
		expect(componentRegistry.has('explorer.actions')).toBe(false);
		expect(componentRegistry.has('explorer.card')).toBe(false);
	});

	it('has "rbac.matrix" registered', () => {
		expect(componentRegistry.has('rbac.matrix')).toBe(true);
	});

	it('does NOT have "fullinfo" (removed — synthesis only)', () => {
		expect(componentRegistry.has('fullinfo')).toBe(false);
	});

	it('has "synthesis" registered (Synthesis.svelte)', () => {
		expect(componentRegistry.has('synthesis')).toBe(true);
	});

	it('has "fiche.update" and "login" registered', () => {
		expect(componentRegistry.has('fiche.update')).toBe(true);
		expect(componentRegistry.has('login')).toBe(true);
	});

	it('has "diagram" registered (DiagramEngine frame)', () => {
		expect(componentRegistry.has('diagram')).toBe(true);
	});

	it('has exactly 18 entries', () => {
		const keys = componentRegistry.keys();
		expect(keys).toHaveLength(18);
		expect(keys.sort()).toEqual([
			'ai.chat-session',
			'columner',
			'contextmenu',
			'dashboard',
			'diagram',
			'explorer',
			'explorer.content',
			'fiche',
			'fiche.update',
			'form',
			'list',
			'login',
			'main-menu-content',
			'rbac.matrix',
			'record',
			'space',
			'synthesis',
			'today'
		]);
	});
});
