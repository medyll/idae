import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import type { ImageMeta } from '../types/imageMeta.js';
import type { ImagePreset } from './ImagePresetRegistry.js';

export async function probe(filePath: string): Promise<ImageMeta | null> {
	try {
		const meta = await sharp(filePath).metadata();
		return {
			width:    meta.width ?? 0,
			height:   meta.height ?? 0,
			format:   meta.format ?? 'unknown',
			hasAlpha: !!meta.hasAlpha,
		};
	} catch { return null; }
}

function cachePath(storedPath: string, preset: ImagePreset, fmt: 'jpeg' | 'webp' | 'png'): string {
	const ext = fmt === 'webp' ? 'webp' : fmt === 'png' ? 'png' : 'jpg';
	return `${storedPath}.${preset.code}.${ext}`;
}

function resolveFormat(preset: ImagePreset, override?: 'webp' | 'jpeg', hasAlpha = false): 'jpeg' | 'webp' | 'png' {
	if (override) return override;
	if (preset.format === 'jpeg' || preset.format === 'webp' || preset.format === 'png') return preset.format;
	return hasAlpha ? 'png' : 'jpeg';
}

export async function getVariant(
	storedPath: string,
	preset: ImagePreset,
	override?: 'webp' | 'jpeg'
): Promise<string> {
	const meta = await sharp(storedPath).metadata();
	const fmt  = resolveFormat(preset, override, !!meta.hasAlpha);
	const target = cachePath(storedPath, preset, fmt);

	if (fs.existsSync(target)) return target;

	let pipeline = sharp(storedPath).resize({
		width:              preset.width,
		height:             preset.height,
		fit:                preset.fit,
		withoutEnlargement: true,
	});

	const q = preset.quality ?? 82;
	if (fmt === 'webp') pipeline = pipeline.webp({ quality: q });
	else if (fmt === 'png') pipeline = pipeline.png({ quality: q });
	else pipeline = pipeline.jpeg({ quality: q, mozjpeg: true });

	await pipeline.toFile(target);
	return target;
}

export function invalidateCache(storedPath: string): void {
	const dir = path.dirname(storedPath);
	const base = path.basename(storedPath);
	if (!fs.existsSync(dir)) return;
	for (const entry of fs.readdirSync(dir)) {
		if (!entry.startsWith(`${base}.`)) continue;
		if (!/\.(jpg|webp|png)$/.test(entry)) continue;
		try { fs.unlinkSync(path.join(dir, entry)); } catch { /* ignore */ }
	}
}
