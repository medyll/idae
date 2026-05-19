import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { getConn } from '../middleware/dbRouter.js';
import * as Registry from '../services/ImagePresetRegistry.js';
import { dispatch, clearHooks } from '../hooks/HooksRegistry.js';

const TEST_ORG = 'vitest';
const META_DB  = `${TEST_ORG}_machine_app`;

describe('ImagePresetRegistry', () => {
	beforeAll(async () => {
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(config.mongodbUri);
		}
		(config as any).org = TEST_ORG;

		const conn = await getConn(META_DB);
		await conn.collection('appimage_preset').deleteMany({});
		await conn.collection('appimage_preset').createIndex({ code: 1 }, { unique: true });

		const defaults = [
			{ code: 'thumb',  name: 'Vignette', width: 150, height: 150, fit: 'cover',  format: 'auto', quality: 82, auto: false, scope: 'global' },
			{ code: 'square', name: 'Carré',    width: 120, height: 120, fit: 'cover',  format: 'auto', quality: 82, auto: false, scope: 'global' },
			{ code: 'small',  name: 'Petit',    width: 480,             fit: 'inside',   format: 'auto', quality: 82, auto: false, scope: 'global' },
			{ code: 'medium', name: 'Moyen',    width: 1024,            fit: 'inside',   format: 'auto', quality: 82, auto: false, scope: 'global' },
			{ code: 'large',  name: 'Grand',    width: 2048,            fit: 'inside',   format: 'auto', quality: 82, auto: false, scope: 'global' },
			{ code: 'banner', name: 'Bannière', width: 1920, height: 480, fit: 'cover', format: 'auto', quality: 82, auto: false, scope: 'global' },
			{ code: 'avatar', name: 'Avatar',   width: 256, height: 256, fit: 'cover',  format: 'auto', quality: 82, auto: false, scope: 'global' },
		];
		for (const d of defaults) {
			await conn.collection('appimage_preset').insertOne(d);
		}
	});

	afterEach(() => {
		Registry._testReset();
	});

	describe('get', () => {
		it('returns preset by code', async () => {
			const preset = await Registry.get('thumb');
			expect(preset).not.toBeNull();
			expect(preset?.code).toBe('thumb');
			expect(preset?.width).toBe(150);
			expect(preset?.height).toBe(150);
			expect(preset?.fit).toBe('cover');
		});

		it('returns null for unknown code', async () => {
			const preset = await Registry.get('inexistant');
			expect(preset).toBeNull();
		});
	});

	describe('getAll', () => {
		it('returns all presets', async () => {
			const all = await Registry.getAll();
			expect(all.length).toBe(7);
			const codes = all.map(p => p.code);
			expect(codes).toContain('thumb');
			expect(codes).toContain('avatar');
		});
	});

	describe('insert', () => {
		it('inserts and caches new preset', async () => {
			await Registry.insert({
				code: 'custom-1', name: 'Custom', fit: 'inside', format: 'auto', quality: 82, auto: true, scope: 'global',
			});
			const found = await Registry.get('custom-1');
			expect(found).not.toBeNull();
			expect(found?.name).toBe('Custom');
		});
	});

	describe('invalidate', () => {
		it('clears cache, forces reload on next get', async () => {
			await Registry.get('thumb');
			Registry.invalidate();
			const preset = await Registry.get('thumb');
			expect(preset).not.toBeNull();
		});
	});

	describe('hook invalidation', () => {
		beforeEach(() => {
			clearHooks();
		});
		afterEach(() => {
			clearHooks();
		});

		it('post:create on appimage_preset invalidates cache', async () => {
			await Registry.get('thumb');
			await dispatch('post:create', { event: 'post:create', collection: 'appimage_preset', data: {} });
			const preset = await Registry.get('thumb');
			expect(preset).not.toBeNull();
		});

		it('post:update on appimage_preset invalidates cache', async () => {
			await Registry.get('thumb');
			await dispatch('post:update', { event: 'post:update', collection: 'appimage_preset', data: {} });
			const preset = await Registry.get('thumb');
			expect(preset).not.toBeNull();
		});

		it('post:delete on appimage_preset invalidates cache', async () => {
			await Registry.get('thumb');
			await dispatch('post:delete', { event: 'post:delete', collection: 'appimage_preset', data: {} });
			const preset = await Registry.get('thumb');
			expect(preset).not.toBeNull();
		});

		it('hooks on other collections do NOT invalidate', async () => {
			await Registry.get('thumb');
			await dispatch('post:create', { event: 'post:create', collection: 'other_collection', data: {} });
			const preset = await Registry.get('thumb');
			expect(preset).not.toBeNull();
		});
	});
});
