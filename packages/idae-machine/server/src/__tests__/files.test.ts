import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import mongoose, { Schema } from 'mongoose';
import { config } from '../config.js';
import { uploadFiles, listFilesForRecord, getFileMeta, downloadFile, deleteFile, updateImageFocus } from '../routes/files.js';
import * as FileService from '../services/FileService.js';
import type { Request, Response } from 'express';
import { getConn } from '../middleware/dbRouter.js';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const TEST_ORG    = 'vitest';
const TEST_TABLE  = 'filescollection';
const TEST_BASE   = 'machine_base';
const META_DB     = `${TEST_ORG}_machine_app`;
const DATA_DB     = `${TEST_ORG}_${TEST_BASE}`;
const FILES_ROOT  = path.join(__dirname, '../../test-files');

function mockRes() {
	const res: any = { _status: 200, _headers: {} };
	res.json   = (b: any) => { res._body = b; return res; };
	res.status = (c: number) => { res._status = c; return res; };
	res.send   = () => res;
	res.setHeader = (k: string, v: string) => { res._headers[k] = v; return res; };
	return res;
}

function mockReq(opts: { params?: any; query?: any; body?: any; headers?: any; file?: any; user?: any } = {}): Request {
	return {
		params: opts.params ?? {},
		query: opts.query ?? {},
		body: opts.body ?? {},
		headers: opts.headers ?? {},
		file: opts.file,
		user: opts.user,
		socket: { remoteAddress: '127.0.0.1' }
	} as unknown as Request;
}

function getTestCollection() {
	const db = mongoose.connection.useDb(DATA_DB, { useCache: true });
	const schema = new Schema({}, { strict: false, collection: TEST_TABLE });
	const name = `${DATA_DB}__${TEST_TABLE}`;
	return db.models[name] ?? db.model(name, schema, TEST_TABLE);
}

describe('FileService', () => {
	beforeAll(async () => {
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(config.mongodbUri);
		}
		(config as any).org = TEST_ORG;
		(config as any).filesRoot = FILES_ROOT;
		fs.mkdirSync(FILES_ROOT, { recursive: true });

		const meta = mongoose.connection.useDb(META_DB, { useCache: true });
		await meta.collection('appscheme').updateOne(
			{ code: TEST_TABLE },
			{ $set: { code: TEST_TABLE, base: TEST_BASE } },
			{ upsert: true }
		);
	});

	afterAll(async () => {
		const meta = mongoose.connection.useDb(META_DB, { useCache: true });
		await meta.collection('appscheme').deleteOne({ code: TEST_TABLE });
		const db = mongoose.connection.useDb(DATA_DB, { useCache: true });
		await db.collection(TEST_TABLE).drop().catch(() => {});
		const conn = await getConn(`${TEST_ORG}_machine_user`);
		await conn.collection('appfile').drop().catch(() => {});
		fs.rmSync(FILES_ROOT, { recursive: true, force: true });
	});

	afterEach(async () => {
		const conn = await getConn(`${TEST_ORG}_machine_user`);
		await conn.collection('appfile').deleteMany({});
		fs.rmSync(FILES_ROOT, { recursive: true, force: true });
		fs.mkdirSync(FILES_ROOT, { recursive: true });
	});

	it('uploadFile creates metadata and writes file', async () => {
		const testDir = path.join(FILES_ROOT, TEST_ORG, TEST_TABLE, 'rec1');
		fs.mkdirSync(testDir, { recursive: true });
		const filePath = path.join(testDir, 'test.txt');
		fs.writeFileSync(filePath, 'hello world');

		const meta = await FileService.uploadFile({
			org: TEST_ORG,
			collection: TEST_TABLE,
			recordId: 'rec1',
			originalName: 'test.txt',
			mimetype: 'text/plain',
			size: 11,
			filePath,
		});

		expect(meta.fileId).toBeDefined();
		expect(meta.originalName).toBe('test.txt');
		expect(meta.size).toBe(11);

		const found = await FileService.getFileMeta(TEST_ORG, meta.fileId);
		expect(found).toBeDefined();
		expect(found?.originalName).toBe('test.txt');
	});

	it('listFiles returns files for a record', async () => {
		const testDir = path.join(FILES_ROOT, TEST_ORG, TEST_TABLE, 'rec2');
		fs.mkdirSync(testDir, { recursive: true });
		const filePath = path.join(testDir, 'doc.pdf');
		fs.writeFileSync(filePath, 'pdf content');

		await FileService.uploadFile({
			org: TEST_ORG, collection: TEST_TABLE, recordId: 'rec2',
			originalName: 'doc.pdf', mimetype: 'application/pdf', size: 11, filePath,
		});

		const files = await FileService.listFiles(TEST_ORG, TEST_TABLE, 'rec2');
		expect(files).toHaveLength(1);
		expect(files[0].originalName).toBe('doc.pdf');
	});

	it('streamFile returns stream and meta', async () => {
		const testDir = path.join(FILES_ROOT, TEST_ORG, TEST_TABLE, 'rec3');
		fs.mkdirSync(testDir, { recursive: true });
		const filePath = path.join(testDir, 'image.png');
		fs.writeFileSync(filePath, 'png data');

		const uploaded = await FileService.uploadFile({
			org: TEST_ORG, collection: TEST_TABLE, recordId: 'rec3',
			originalName: 'image.png', mimetype: 'image/png', size: 8, filePath,
		});

		const result = await FileService.streamFile(TEST_ORG, uploaded.fileId);
		expect(result).not.toBeNull();
		expect(result?.meta.originalName).toBe('image.png');
	});

	it('deleteFile soft delete excludes from list', async () => {
		const testDir = path.join(FILES_ROOT, TEST_ORG, TEST_TABLE, 'rec4');
		fs.mkdirSync(testDir, { recursive: true });
		const filePath = path.join(testDir, 'soft.txt');
		fs.writeFileSync(filePath, 'soft delete');

		const uploaded = await FileService.uploadFile({
			org: TEST_ORG, collection: TEST_TABLE, recordId: 'rec4',
			originalName: 'soft.txt', mimetype: 'text/plain', size: 11, filePath,
		});

		await FileService.deleteFile(TEST_ORG, uploaded.fileId, false);
		const files = await FileService.listFiles(TEST_ORG, TEST_TABLE, 'rec4');
		expect(files).toHaveLength(0);
	});

	it('deleteFile permanent removes file and metadata', async () => {
		const testDir = path.join(FILES_ROOT, TEST_ORG, TEST_TABLE, 'rec5');
		fs.mkdirSync(testDir, { recursive: true });
		const filePath = path.join(testDir, 'perm.txt');
		fs.writeFileSync(filePath, 'permanent');

		const uploaded = await FileService.uploadFile({
			org: TEST_ORG, collection: TEST_TABLE, recordId: 'rec5',
			originalName: 'perm.txt', mimetype: 'text/plain', size: 9, filePath,
		});

		await FileService.deleteFile(TEST_ORG, uploaded.fileId, true);
		expect(fs.existsSync(filePath)).toBe(false);

		const found = await FileService.getFileMeta(TEST_ORG, uploaded.fileId);
		expect(found).toBeNull();
	});

	it('getFileMeta returns null for non-existent file', async () => {
		const result = await FileService.getFileMeta(TEST_ORG, 'nonexistent');
		expect(result).toBeNull();
	});
});

describe('File routes', () => {
	beforeAll(async () => {
		(config as any).org = TEST_ORG;
		(config as any).filesRoot = FILES_ROOT;
		fs.mkdirSync(FILES_ROOT, { recursive: true });
	});

	afterAll(() => {
		fs.rmSync(FILES_ROOT, { recursive: true, force: true });
	});

	it('uploadFiles returns 400 for invalid collection name', async () => {
		const req = mockReq({ params: { collection: '../etc', recordId: '1' } });
		const res = mockRes();
		await uploadFiles(req, res);
		expect(res._status).toBe(400);
	});

	it('getFileMeta returns 404 for missing file', async () => {
		const req = mockReq({ params: { fileId: 'nonexistent' } });
		const res = mockRes();
		await getFileMeta(req, res);
		expect(res._status).toBe(404);
	});

	it('deleteFile returns 404 for missing file', async () => {
		const req = mockReq({ params: { fileId: 'nonexistent' } });
		const res = mockRes();
		await deleteFile(req, res);
		expect(res._status).toBe(404);
	});
});

describe('updateImageFocus', () => {
	beforeAll(async () => {
		(config as any).org = TEST_ORG;
		(config as any).filesRoot = FILES_ROOT;
		fs.mkdirSync(FILES_ROOT, { recursive: true });
	});

	afterEach(async () => {
		const conn = await getConn(`${TEST_ORG}_machine_user`);
		await conn.collection('appfile').deleteMany({});
	});

	it('updateImageFocus valid → meta.image.focus set', async () => {
		const coll = (await getConn(`${TEST_ORG}_machine_user`)).collection('appfile');
		await coll.insertOne({
			fileId: 'focus-1', collection: 'photos', recordId: 'r1',
			originalName: 'photo.jpg', storedPath: 'photos/r1/focus-1.jpg',
			size: 1000, mimetype: 'image/jpeg', uploadedAt: new Date().toISOString(),
			image: { width: 800, height: 600, format: 'jpeg', hasAlpha: false },
		});

		const meta = await FileService.updateImageFocus(TEST_ORG, 'focus-1', { x: 0.4, y: 0.2 });
		expect(meta).not.toBeNull();
		expect(meta?.image?.focus).toEqual({ x: 0.4, y: 0.2 });
	});

	it('updateImageFocus invalid coords → throw', async () => {
		await expect(FileService.updateImageFocus(TEST_ORG, 'any', { x: -1, y: 0 }))
			.rejects.toThrow('Focus coordinates must be 0..1');
	});

	it('updateImageFocus on non-image → null', async () => {
		const coll = (await getConn(`${TEST_ORG}_machine_user`)).collection('appfile');
		await coll.insertOne({
			fileId: 'noimg-1', collection: 'docs', recordId: 'r1',
			originalName: 'doc.txt', storedPath: 'docs/r1/noimg-1.txt',
			size: 100, mimetype: 'text/plain', uploadedAt: new Date().toISOString(),
		});

		const meta = await FileService.updateImageFocus(TEST_ORG, 'noimg-1', { x: 0.5, y: 0.5 });
		expect(meta).toBeNull();
	});

	it('updateImageFocus smoke → returns meta with focus', async () => {
		const coll = (await getConn(`${TEST_ORG}_machine_user`)).collection('appfile');
		await coll.insertOne({
			fileId: 'ep-1', collection: 'photos', recordId: 'r1',
			originalName: 'ep.jpg', storedPath: 'photos/r1/ep-1.jpg',
			size: 1000, mimetype: 'image/jpeg', uploadedAt: new Date().toISOString(),
			image: { width: 800, height: 600, format: 'jpeg', hasAlpha: false },
		});

		const meta = await FileService.updateImageFocus(TEST_ORG, 'ep-1', { x: 0.3, y: 0.7 });
		expect(meta).not.toBeNull();
		expect(meta?.image?.focus).toEqual({ x: 0.3, y: 0.7 });
	});

	it('PATCH endpoint invalid body → 400', async () => {
		const req = mockReq({ params: { fileId: 'any' }, body: { x: 'bad' } });
		const res = mockRes();
		await updateImageFocus(req, res);
		expect(res._status).toBe(400);
	});
});
