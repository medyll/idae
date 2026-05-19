import * as Registry from './ImagePresetRegistry.js';
import type { ImagePreset } from './ImagePresetRegistry.js';
import { config } from '../config.js';

const FREE_RE = /^free-(?:(\d+)x(\d+)|w(\d+)|h(\d+))$/;

export class PresetError extends Error {
	constructor(message: string, public status: 400 | 404) { super(message); }
}

export async function resolve(code: string): Promise<ImagePreset> {
	if (!code || code.length > 64) throw new PresetError('Invalid preset code', 400);

	const existing = await Registry.get(code);
	if (existing) return existing;

	const m = FREE_RE.exec(code);
	if (!m) throw new PresetError(`Unknown preset: ${code}`, 404);

	const [, wxh1, wxh2, wOnly, hOnly] = m;
	let width: number | undefined;
	let height: number | undefined;
	let fit: ImagePreset['fit'];

	if (wxh1 && wxh2) {
		width  = Number(wxh1);
		height = Number(wxh2);
		fit    = 'cover';
	} else if (wOnly) {
		width  = Number(wOnly);
		fit    = 'inside';
	} else if (hOnly) {
		height = Number(hOnly);
		fit    = 'inside';
	} else {
		throw new PresetError(`Invalid free notation: ${code}`, 400);
	}

	const { minDim, maxDim } = config.image;
	for (const dim of [width, height]) {
		if (dim === undefined) continue;
		if (dim < minDim || dim > maxDim) {
			throw new PresetError(`Dimension out of bounds [${minDim}..${maxDim}]: ${dim}`, 400);
		}
	}

	const preset: ImagePreset = {
		code,
		name:    `Auto ${code}`,
		width,
		height,
		fit,
		format:  'auto',
		quality: 82,
		auto:    true,
		scope:   'global',
	};

	try {
		await Registry.insert(preset);
	} catch {
		const retry = await Registry.get(code);
		if (retry) return retry;
		throw new PresetError(`Failed to create preset: ${code}`, 500);
	}

	return preset;
}
