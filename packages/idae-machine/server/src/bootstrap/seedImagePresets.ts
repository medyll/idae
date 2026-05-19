import type { Connection } from 'mongoose';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

interface PresetSeed {
	code:    string;
	name:    string;
	width?:  number;
	height?: number;
	fit:     'cover' | 'inside' | 'contain' | 'fill';
	format:  'jpeg' | 'webp' | 'png' | 'auto';
	quality: number;
}

const DEFAULT_PRESETS: PresetSeed[] = [
	{ code: 'thumb',  name: 'Vignette',   width: 150,  height: 150, fit: 'cover',  format: 'auto', quality: 82 },
	{ code: 'square', name: 'Carré',      width: 120,  height: 120, fit: 'cover',  format: 'auto', quality: 82 },
	{ code: 'small',  name: 'Petit',      width: 480,               fit: 'inside', format: 'auto', quality: 82 },
	{ code: 'medium', name: 'Moyen',      width: 1024,              fit: 'inside', format: 'auto', quality: 82 },
	{ code: 'large',  name: 'Grand',      width: 2048,              fit: 'inside', format: 'auto', quality: 82 },
	{ code: 'banner', name: 'Bannière',   width: 1920, height: 480, fit: 'cover',  format: 'auto', quality: 82 },
	{ code: 'avatar', name: 'Avatar',     width: 256,  height: 256, fit: 'cover',  format: 'auto', quality: 82 },
];

export async function seedImagePresets(conn: Connection): Promise<void> {
	const coll = conn.collection('appimage_preset');

	await coll.createIndex({ code: 1 }, { unique: true });

	let seeded = 0;
	for (const seed of DEFAULT_PRESETS) {
		const existing = await coll.findOne({ code: seed.code });
		if (existing) continue;
		await coll.insertOne({ ...seed, auto: false, scope: 'global' });
		seeded++;
	}

	if (seeded > 0) {
		logger.info(`Seeded ${seeded} image presets in ${config.org}_machine_app.appimage_preset`);
	}
}
