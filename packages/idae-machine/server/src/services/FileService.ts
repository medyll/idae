import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { getConn } from '../middleware/dbRouter.js';
import { config } from '../config.js';
import type { ImageMeta } from '../types/imageMeta.js';
import * as ImageService from './ImageService.js';

export interface UploadFileInput {
	org:          string;
	collection:   string;
	recordId:     string;
	originalName: string;
	mimetype:     string;
	size:         number;
	filePath:     string;
	uploadedBy?:  string;
}

export interface FileMeta {
	fileId:       string;
	collection:   string;
	recordId:     string;
	originalName: string;
	storedPath:   string;
	size:         number;
	mimetype:     string;
	uploadedAt:   string;
	uploadedBy?:  string;
	deletedAt?:   string | null;
	image?:       ImageMeta;
}

async function getFileCollection(org: string) {
	const conn = await getConn(`${org}_machine_user`);
	return conn.collection('appfile');
}

export async function uploadFile(input: UploadFileInput): Promise<FileMeta> {
	const org = input.org;
	const relPath = path.relative(path.join(config.filesRoot, org), input.filePath);
	const fileId = (path.basename(input.filePath).split('-')[0]) as string;

	const meta: FileMeta = {
		fileId,
		collection:   input.collection,
		recordId:     input.recordId,
		originalName: input.originalName,
		storedPath:   relPath,
		size:         input.size,
		mimetype:     input.mimetype,
		uploadedAt:   new Date().toISOString(),
		uploadedBy:   input.uploadedBy,
		deletedAt:    null,
	};

	if (input.mimetype.startsWith('image/')) {
		const imgMeta = await ImageService.probe(input.filePath);
		if (imgMeta) meta.image = imgMeta;
	}

	const coll = await getFileCollection(org);
	await coll.insertOne(meta);
	return meta;
}

export async function getFileMeta(org: string, fileId: string): Promise<FileMeta | null> {
	const coll = await getFileCollection(org);
	return coll.findOne({ fileId, deletedAt: null }) as Promise<FileMeta | null>;
}

export async function getFileMetaById(org: string, fileId: string, includeDeleted = false): Promise<FileMeta | null> {
	const coll = await getFileCollection(org);
	const query: Record<string, unknown> = { fileId };
	if (!includeDeleted) query.deletedAt = null;
	return coll.findOne(query) as Promise<FileMeta | null>;
}

export async function streamFile(org: string, fileId: string): Promise<{ stream: fs.ReadStream; meta: FileMeta } | null> {
	const meta = await getFileMeta(org, fileId);
	if (!meta) return null;
	const absolutePath = path.join(config.filesRoot, org, meta.storedPath);
	if (!fs.existsSync(absolutePath)) return null;
	return { stream: fs.createReadStream(absolutePath), meta };
}

export async function deleteFile(org: string, fileId: string, permanent = false): Promise<boolean> {
	const meta = await getFileMetaById(org, fileId, true);
	if (!meta) return false;

	if (permanent) {
		const absolutePath = path.join(config.filesRoot, org, meta.storedPath);
		if (fs.existsSync(absolutePath)) {
			ImageService.invalidateCache(absolutePath);
			fs.unlinkSync(absolutePath);
		}
		const coll = await getFileCollection(org);
		await coll.deleteOne({ fileId });
		return true;
	}

	const coll = await getFileCollection(org);
	await coll.updateOne({ fileId }, { $set: { deletedAt: new Date().toISOString() } });
	return true;
}

export async function listFiles(org: string, collection: string, recordId: string): Promise<FileMeta[]> {
	const coll = await getFileCollection(org);
	return coll.find({ collection, recordId, deletedAt: null }).toArray() as unknown as Promise<FileMeta[]>;
}

export async function updateImageFocus(
	org: string,
	fileId: string,
	focus: { x: number; y: number }
): Promise<FileMeta | null> {
	if (focus.x < 0 || focus.x > 1 || focus.y < 0 || focus.y > 1) {
		throw new Error('Focus coordinates must be 0..1');
	}
	const coll = await getFileCollection(org);
	const result = await coll.findOneAndUpdate(
		{ fileId, deletedAt: null, image: { $exists: true } },
		{ $set: { 'image.focus': focus } },
		{ returnDocument: 'after' }
	);
	return result as FileMeta | null;
}
