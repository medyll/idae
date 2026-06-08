import { getConn } from '../middleware/dbRouter.js';
import { getCurrentOrg } from '../middleware/orgContext.js';
import { logger } from '../utils/logger.js';

export interface ImagePreset {
	code:    string;
	name:    string;
	width?:  number;
	height?: number;
	fit:     'cover' | 'inside' | 'contain' | 'fill';
	format:  'jpeg' | 'webp' | 'png' | 'auto';
	quality: number;
	auto:    boolean;
	scope:   string;
}

const cache = new Map<string, ImagePreset>();
let loaded = false;

async function getCollection() {
	const conn = await getConn(`${getCurrentOrg()}_machine_app`);
	return conn.collection('appimage_preset');
}

export async function loadAll(): Promise<void> {
	const coll = await getCollection();
	await coll.createIndex({ code: 1 }, { unique: true });
	const rows = await coll.find({}).toArray();
	cache.clear();
	for (const row of rows) {
		cache.set(row.code as string, row as unknown as ImagePreset);
	}
	loaded = true;
	logger.info(`ImagePresetRegistry loaded: ${cache.size} presets`);
}

export async function get(code: string): Promise<ImagePreset | null> {
	if (!loaded) await loadAll();
	return cache.get(code) ?? null;
}

export async function getAll(): Promise<ImagePreset[]> {
	if (!loaded) await loadAll();
	return Array.from(cache.values());
}

export async function insert(preset: ImagePreset): Promise<void> {
	const coll = await getCollection();
	await coll.insertOne(preset);
	cache.set(preset.code, preset);
}

export function invalidate(): void {
	cache.clear();
	loaded = false;
}

export function _testReset(): void {
	cache.clear();
	loaded = false;
}
