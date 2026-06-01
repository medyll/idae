import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { getConn } from '../middleware/dbRouter.js';
import * as Registry from '../services/ImagePresetRegistry.js';
import * as Resolver from '../services/ImageResolver.js';

const TEST_ORG = 'vitest';
const META_DB  = `${TEST_ORG}_machine_app`;

describe('ImageResolver', () => {
	beforeAll(async () => {
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(config.mongodbUri);
		}
		(config as any).org = TEST_ORG;
		(config as any).image = { minDim: 16, maxDim: 4096 };

		const conn = await getConn(META_DB);
		await conn.collection('appimage_preset').deleteMany({});
		await conn.collection('appimage_preset').createIndex({ code: 1 }, { unique: true });

		const defaults = [
			{ code: 'thumb', name: 'Vignette', width: 150, height: 150, fit: 'cover', format: 'auto', quality: 82, auto: false, scope: 'global' },
			{ code: 'small', name: 'Petit', width: 480, fit: 'inside', format: 'auto', quality: 82, auto: false, scope: 'global' },
		];
		for (const d of defaults) {
			await conn.collection('appimage_preset').insertOne(d);
		}
	});

	beforeEach(() => {
		Registry._testReset();
	});

	describe('resolve existing preset', () => {
		it('returns preset from DB', async () => {
			const preset = await Resolver.resolve('thumb');
			expect(preset).not.toBeNull();
			expect(preset?.code).toBe('thumb');
			expect(preset?.width).toBe(150);
			expect(preset?.height).toBe(150);
			expect(preset?.fit).toBe('cover');
		});
	});

	describe('getAll (cache content)', () => {
		it('returns at least the 2 inserted presets', async () => {
			const all = await Registry.getAll();
			expect(all.length).toBeGreaterThanOrEqual(2);
			const codes = all.map(p => p.code);
			expect(codes).toContain('thumb');
		});
	});

	describe('resolve free notation', () => {
		it('free-WxH → insert with auto=true, fit=cover', async () => {
			const preset = await Resolver.resolve('free-125x88');
			expect(preset.code).toBe('free-125x88');
			expect(preset.width).toBe(125);
			expect(preset.height).toBe(88);
			expect(preset.fit).toBe('cover');
			expect(preset.auto).toBe(true);
		});

		it('free-wW → fit=inside, height undefined', async () => {
			const preset = await Resolver.resolve('free-w800');
			expect(preset.width).toBe(800);
			expect(preset.height).toBeUndefined();
			expect(preset.fit).toBe('inside');
		});

		it('free-hH → fit=inside, width undefined', async () => {
			const preset = await Resolver.resolve('free-h420');
			expect(preset.height).toBe(420);
			expect(preset.width).toBeUndefined();
			expect(preset.fit).toBe('inside');
		});

		it('second call → cache hit, no new insert', async () => {
			await Resolver.resolve('free-300x200');
			const conn = await getConn(META_DB);
			const count1 = await conn.collection('appimage_preset').countDocuments({ code: 'free-300x200' });
			await Resolver.resolve('free-300x200');
			const count2 = await conn.collection('appimage_preset').countDocuments({ code: 'free-300x200' });
			expect(count1).toBe(1);
			expect(count2).toBe(1);
		});
	});

	describe('DOS bounds', () => {
		it('free-9999x9999 → 400 out of bounds', async () => {
			await expect(Resolver.resolve('free-9999x9999'))
				.rejects.toThrow('Dimension out of bounds');
		});

		it('free-1x1 → 400 below minDim', async () => {
			await expect(Resolver.resolve('free-1x1'))
				.rejects.toThrow('Dimension out of bounds');
		});

		it('free-15x15 → 400 below minDim (16)', async () => {
			await expect(Resolver.resolve('free-15x15'))
				.rejects.toThrow('Dimension out of bounds');
		});
	});

	describe('invalid codes', () => {
		it('empty string → 400', async () => {
			await expect(Resolver.resolve(''))
				.rejects.toThrow('Invalid preset code');
		});

		it('code > 64 chars → 400', async () => {
			await expect(Resolver.resolve('x'.repeat(65)))
				.rejects.toThrow('Invalid preset code');
		});

		it('unknown non-free → 404', async () => {
			await expect(Resolver.resolve('inexistant'))
				.rejects.toThrow('Unknown preset');
		});

		it('free-abc (regex no match) → 404', async () => {
			await expect(Resolver.resolve('free-abc'))
				.rejects.toThrow('Unknown preset');
		});
	});

	describe('PresetError', () => {
		it('has status property', async () => {
			try {
				await Resolver.resolve('');
			} catch (e) {
				expect(e).toBeInstanceOf(Resolver.PresetError);
				expect((e as Resolver.PresetError).status).toBe(400);
			}
		});
	});
});
