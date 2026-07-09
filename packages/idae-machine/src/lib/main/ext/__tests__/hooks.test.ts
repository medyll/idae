// main/ext/__tests__/hooks.test.ts
// Unit tests for engine domain bridge hooks

import { describe, it, expect, beforeEach } from 'vitest';
import {
	registerRelationResolver,
	registerMetaCollectionResolver,
	registerCodeFieldConvention,
	registerGrantDecoder,
	getRelationResolver,
	getMetaCollectionResolver,
	getCodeFieldConvention,
	getGrantDecoder
} from '$lib/main/ext/hooks.js';
import type { RelationResolver, MetaCollectionResolver, CodeFieldConvention, GrantDecoder } from '$lib/main/ext/hooks.js';

describe('Engine domain bridge hooks', () => {
	beforeEach(() => {
		registerRelationResolver(null as unknown as RelationResolver);
		registerMetaCollectionResolver(null as unknown as MetaCollectionResolver);
		registerCodeFieldConvention(null as unknown as CodeFieldConvention);
		registerGrantDecoder(null as unknown as GrantDecoder);
	});

	describe('RelationResolver', () => {
		it('returns null before registration', () => {
			expect(getRelationResolver()).toBeNull();
		});

		it('returns registered resolver', () => {
			const resolver: RelationResolver = {
				getRelations: () => undefined,
				getAllCollections: () => []
			};
			registerRelationResolver(resolver);
			expect(getRelationResolver()).toBe(resolver);
		});
	});

	describe('MetaCollectionResolver', () => {
		it('returns null before registration', () => {
			expect(getMetaCollectionResolver()).toBeNull();
		});

		it('returns registered resolver', () => {
			const resolver: MetaCollectionResolver = {
				isMetaCollection: () => false,
				getSchemaCriticalCollections: () => []
			};
			registerMetaCollectionResolver(resolver);
			expect(getMetaCollectionResolver()).toBe(resolver);
		});
	});

	describe('CodeFieldConvention', () => {
		it('returns null before registration', () => {
			expect(getCodeFieldConvention()).toBeNull();
		});

		it('returns registered convention', () => {
			const convention: CodeFieldConvention = {
				codeFieldName: 'code',
				ensureCodeField: (m) => m
			};
			registerCodeFieldConvention(convention);
			expect(getCodeFieldConvention()).toBe(convention);
		});
	});

	describe('GrantDecoder', () => {
		it('returns null before registration', () => {
			expect(getGrantDecoder()).toBeNull();
		});

		it('returns registered decoder', () => {
			const decoder: GrantDecoder = {
				decodeSchemeCode: () => undefined
			};
			registerGrantDecoder(decoder);
			expect(getGrantDecoder()).toBe(decoder);
		});
	});
});
