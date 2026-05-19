import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { probe, getVariant, invalidateCache } from '../services/ImageService.js';
import * as FileService from '../services/FileService.js';
import { config } from '../config.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import type { ImagePreset } from '../services/ImagePresetRegistry.js';

const TEST_ORG = 'vitest';
const FILES_ROOT = path.join(__dirname, '../../test-files-img');

const PRESET_THUMB: ImagePreset = { code: 'thumb', name: 'Thumb', width: 150, height: 150, fit: 'cover', format: 'auto', quality: 82, auto: false, scope: 'global' };
const PRESET_SMALL: ImagePreset = { code: 'small', name: 'Small', width: 480, fit: 'inside', format: 'auto', quality: 82, auto: false, scope: 'global' };
const PRESET_MEDIUM: ImagePreset = { code: 'medium', name: 'Medium', width: 1024, fit: 'inside', format: 'auto', quality: 82, auto: false, scope: 'global' };
const PRESET_FREE: ImagePreset = { code: 'free-200x100', name: 'Auto free-200x100', width: 200, height: 100, fit: 'cover', format: 'auto', quality: 82, auto: true, scope: 'global' };

describe('ImageService', () => {
	let pngPath: string;
	let jpegPath: string;

	beforeAll(async () => {
		fs.mkdirSync(FILES_ROOT, { recursive: true });
		(config as any).filesRoot = FILES_ROOT;

		pngPath = path.join(FILES_ROOT, 'test.png');
		await sharp({ create: { width: 200, height: 100, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 0.5 } } })
			.png()
			.toFile(pngPath);

		jpegPath = path.join(FILES_ROOT, 'test.jpg');
		await sharp({ create: { width: 1920, height: 1080, channels: 3, background: { r: 0, g: 0, b: 255 } } })
			.jpeg()
			.toFile(jpegPath);
	});

	afterAll(() => {
		fs.rmSync(FILES_ROOT, { recursive: true, force: true });
	});

	describe('probe', () => {
		it('returns correct metadata for PNG', async () => {
			const meta = await probe(pngPath);
			expect(meta).not.toBeNull();
			expect(meta?.width).toBe(200);
			expect(meta?.height).toBe(100);
			expect(meta?.format).toBe('png');
			expect(meta?.hasAlpha).toBe(true);
		});

		it('returns correct metadata for JPEG', async () => {
			const meta = await probe(jpegPath);
			expect(meta).not.toBeNull();
			expect(meta?.width).toBe(1920);
			expect(meta?.height).toBe(1080);
			expect(meta?.format).toBe('jpeg');
			expect(meta?.hasAlpha).toBe(false);
		});

		it('returns null for corrupt file', async () => {
			const corrupt = path.join(FILES_ROOT, 'corrupt.png');
			fs.writeFileSync(corrupt, 'not an image');
			const meta = await probe(corrupt);
			expect(meta).toBeNull();
		});
	});

	describe('getVariant', () => {
		it('creates thumb variant (150x150 cover)', async () => {
			const variantPath = await getVariant(jpegPath, PRESET_THUMB);
			expect(fs.existsSync(variantPath)).toBe(true);
			expect(variantPath).toMatch(/\.thumb\.jpg$/);
			const meta = await sharp(variantPath).metadata();
			expect(meta.width).toBeLessThanOrEqual(150);
			expect(meta.height).toBeLessThanOrEqual(150);
		});

		it('serves from cache on second call (mtime unchanged)', async () => {
			const v1 = await getVariant(jpegPath, PRESET_SMALL);
			const stat1 = fs.statSync(v1);
			await new Promise(r => setTimeout(r, 100));
			const v2 = await getVariant(jpegPath, PRESET_SMALL);
			const stat2 = fs.statSync(v2);
			expect(stat1.mtimeMs).toBe(stat2.mtimeMs);
		});

		it('creates webp override', async () => {
			const variantPath = await getVariant(jpegPath, PRESET_MEDIUM, 'webp');
			expect(fs.existsSync(variantPath)).toBe(true);
			expect(variantPath).toMatch(/\.webp$/);
		});

		it('creates free preset variant with correct cache path', async () => {
			const variantPath = await getVariant(jpegPath, PRESET_FREE);
			expect(fs.existsSync(variantPath)).toBe(true);
			expect(variantPath).toMatch(/\.free-200x100\.jpg$/);
		});

		it('PNG alpha + format=auto → output png', async () => {
			const presetPng: ImagePreset = { code: 'png-test', name: 'PNG', width: 100, fit: 'inside', format: 'auto', quality: 82, auto: false, scope: 'global' };
			const variantPath = await getVariant(pngPath, presetPng);
			expect(fs.existsSync(variantPath)).toBe(true);
			expect(variantPath).toMatch(/\.png-test\.png$/);
		});

		it('preset format=webp → output webp', async () => {
			const presetWebp: ImagePreset = { code: 'webp-test', name: 'WebP', width: 100, fit: 'inside', format: 'webp', quality: 82, auto: false, scope: 'global' };
			const variantPath = await getVariant(jpegPath, presetWebp);
			expect(fs.existsSync(variantPath)).toBe(true);
			expect(variantPath).toMatch(/\.webp-test\.webp$/);
		});
	});

	describe('invalidateCache', () => {
		it('removes all variant cache files', async () => {
			await getVariant(jpegPath, PRESET_THUMB);
			await getVariant(jpegPath, PRESET_SMALL, 'webp');
			invalidateCache(jpegPath);
			expect(fs.existsSync(`${jpegPath}.thumb.jpg`)).toBe(false);
			expect(fs.existsSync(`${jpegPath}.small.webp`)).toBe(false);
		});

		it('does not touch original file', async () => {
			invalidateCache(jpegPath);
			expect(fs.existsSync(jpegPath)).toBe(true);
		});
	});
});

describe('FileService image enrichment', () => {
	beforeAll(() => {
		(config as any).filesRoot = path.join(__dirname, '../../test-files-img2');
		fs.mkdirSync((config as any).filesRoot, { recursive: true });
	});

	afterAll(() => {
		fs.rmSync((config as any).filesRoot, { recursive: true, force: true });
	});

	it('enriches metadata with image info for image uploads', async () => {
		const imgPath = path.join((config as any).filesRoot, 'img-123-photo.jpg');
		await sharp({ create: { width: 800, height: 600, channels: 3, background: { r: 128, g: 128, b: 128 } } })
			.jpeg()
			.toFile(imgPath);

		const meta = await FileService.uploadFile({
			org: TEST_ORG, collection: 'photos', recordId: 'rec1',
			originalName: 'photo.jpg', mimetype: 'image/jpeg', size: 1000, filePath: imgPath,
		});
		expect(meta.image).toBeDefined();
		expect(meta.image?.width).toBe(800);
		expect(meta.image?.height).toBe(600);
		expect(meta.image?.format).toBe('jpeg');
	});

	it('does not enrich for non-image uploads', async () => {
		const txtPath = path.join((config as any).filesRoot, 'txt-456-doc.txt');
		fs.writeFileSync(txtPath, 'text content');

		const meta = await FileService.uploadFile({
			org: TEST_ORG, collection: 'docs', recordId: 'rec2',
			originalName: 'doc.txt', mimetype: 'text/plain', size: 12, filePath: txtPath,
		});
		expect(meta.image).toBeUndefined();
	});

	it('delete permanent removes image variants cache', async () => {
		const root = (config as any).filesRoot;
		const baseDir = path.join(root, TEST_ORG, 'photos', 'rec4');
		fs.mkdirSync(baseDir, { recursive: true });
		const imgPath = path.join(baseDir, 'img-789-del.jpg');
		await sharp({ create: { width: 400, height: 300, channels: 3, background: { r: 0, g: 255, b: 0 } } })
			.jpeg()
			.toFile(imgPath);

		const conn = await (await import('../middleware/dbRouter.js')).getConn(`${TEST_ORG}_machine_user`);
		await conn.collection('appfile').deleteMany({});

		const meta = await FileService.uploadFile({
			org: TEST_ORG, collection: 'photos', recordId: 'rec4',
			originalName: 'del.jpg', mimetype: 'image/jpeg', size: 500, filePath: imgPath,
		});

		await getVariant(imgPath, PRESET_THUMB);
		expect(fs.existsSync(`${imgPath}.thumb.jpg`)).toBe(true);

		await FileService.deleteFile(TEST_ORG, meta.fileId, true);
		expect(fs.existsSync(imgPath)).toBe(false);
		expect(fs.existsSync(`${imgPath}.thumb.jpg`)).toBe(false);
	});
});
