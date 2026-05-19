import { describe, it, expect } from 'vitest';
import { field } from '$lib/main/machine/fieldBuilder.js';
import { MachineParserForge } from '$lib/main/machineParserForge.js';

describe('field builder — image type', () => {
	it('field("image", { presets }) → correct MachineFieldDef', () => {
		const def = field('image', { presets: ['thumb', 'banner'] });
		expect(def.type).toBe('image');
		expect(def.presets).toEqual(['thumb', 'banner']);
		expect(def.free).toBe(false);
	});

	it('field("image", { preset }) → correct MachineFieldDef', () => {
		const def = field('image', { preset: 'avatar' });
		expect(def.type).toBe('image');
		expect(def.preset).toBe('avatar');
		expect(def.free).toBe(false);
	});

	it('field("image", { preset, presets }) → throw', () => {
		expect(() => field('image', { preset: 'a', presets: ['b'] }))
			.toThrow('Use preset OR presets, not both');
	});

	it('field("image") → free=true', () => {
		const def = field('image');
		expect(def.type).toBe('image');
		expect(def.free).toBe(true);
		expect(def.presets).toBeUndefined();
	});

	it('field("image", { free: true }) → explicit free', () => {
		const def = field('image', { free: true });
		expect(def.free).toBe(true);
	});

	it('field("image", { maxSize }) → maxSize propagated', () => {
		const def = field('image', { maxSize: 5_000_000 });
		expect(def.maxSize).toBe(5_000_000);
	});
});

describe('MachineParserForge — image type', () => {
	const forge = new MachineParserForge();

	it('parses image field → fieldType=image, accept=image/*', () => {
		const rule = { type: 'image', presets: ['thumb', 'banner'], free: false };
		const result = forge.testIs('primitive', rule as any);
		expect(result?.fieldType).toBe('image');
		expect((result as any).presets).toEqual(['thumb', 'banner']);
		expect((result as any).free).toBe(false);
	});

	it('forge includes image options', () => {
		const forged = forge.forge({
			collection: 'photos',
			fieldName: 'cover',
			fieldType: 'image',
			fieldArgs: ['required'],
			is: 'primitive',
			presets: ['thumb'],
			free: false,
			accept: 'image/*',
		});
		expect(forged.fieldType).toBe('image');
		expect(forged.presets).toEqual(['thumb']);
		expect(forged.accept).toBe('image/*');
	});
});
