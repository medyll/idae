import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { idaeApi } from '@medyll/idae-api';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';
import { requireDroit } from '../middleware/permission.js';
import { uploadMiddleware } from '../middleware/upload.js';
import * as FileService from '../services/FileService.js';
import * as ImageService from '../services/ImageService.js';
import * as ImageResolver from '../services/ImageResolver.js';
import { validateTableName } from './data.js';
import { dispatch } from '../hooks/HooksRegistry.js';
import { extractAuditContext } from '../services/AuditService.js';

function getOrg(req: Request): string {
	return (req as any).org ?? 'default';
}

export async function uploadFiles(req: Request, res: Response): Promise<void> {
	try {
		const { collection, recordId } = req.params;
		const org = getOrg(req);

		if (!validateTableName(collection)) {
			res.status(400).json({ error: 'Invalid collection name' });
			return;
		}

		const file = (req as any).file;
		if (!file) {
			res.status(400).json({ error: 'No file uploaded' });
			return;
		}

		const meta = await FileService.uploadFile({
			org,
			collection,
			recordId,
			originalName: file.originalname,
			mimetype: file.mimetype,
			size: file.size,
			filePath: file.path,
			uploadedBy: req.user?.userId,
		});

		await dispatch('post:create', {
			event:      'post:create',
			collection: '_files',
			data:       meta,
			user:       req.user,
			req:        extractAuditContext(req),
		});

		res.status(201).json(meta);
	} catch (error) {
		if ((error as any).code === 'LIMIT_FILE_SIZE') {
			res.status(413).json({ error: 'File too large' });
			return;
		}
		logger.error('Error uploading file:', error);
		res.status(500).json({ error: 'Failed to upload file' });
	}
}

export async function listFilesForRecord(req: Request, res: Response): Promise<void> {
	try {
		const { collection, recordId } = req.params;
		const org = getOrg(req);

		if (!validateTableName(collection)) {
			res.status(400).json({ error: 'Invalid collection name' });
			return;
		}

		const files = await FileService.listFiles(org, collection, recordId);
		res.json(files);
	} catch (error) {
		logger.error('Error listing files:', error);
		res.status(500).json({ error: 'Failed to list files' });
	}
}

export async function getFileMeta(req: Request, res: Response): Promise<void> {
	try {
		const { fileId } = req.params;
		const org = getOrg(req);

		const meta = await FileService.getFileMeta(org, fileId);
		if (!meta) {
			res.status(404).json({ error: 'File not found' });
			return;
		}
		res.json(meta);
	} catch (error) {
		logger.error('Error getting file meta:', error);
		res.status(500).json({ error: 'Failed to get file metadata' });
	}
}

export async function downloadFile(req: Request, res: Response): Promise<void> {
	try {
		const { fileId } = req.params;
		const org = getOrg(req);

		const result = await FileService.streamFile(org, fileId);
		if (!result) {
			res.status(404).json({ error: 'File not found' });
			return;
		}

		res.setHeader('Content-Type', result.meta.mimetype);
		res.setHeader('Content-Disposition', `attachment; filename="${result.meta.originalName}"`);
		result.stream.pipe(res);
	} catch (error) {
		logger.error('Error downloading file:', error);
		res.status(500).json({ error: 'Failed to download file' });
	}
}

export async function deleteFile(req: Request, res: Response): Promise<void> {
	try {
		const { fileId } = req.params;
		const org = getOrg(req);
		const permanent = req.query.permanent === 'true';

		const meta = await FileService.getFileMetaById(org, fileId);
		if (!meta) {
			res.status(404).json({ error: 'File not found' });
			return;
		}

		await FileService.deleteFile(org, fileId, permanent);

		await dispatch('post:delete', {
			event:      'post:delete',
			collection: '_files',
			recordId:   fileId,
			data:       meta,
			details:    { permanent },
			user:       req.user,
			req:        extractAuditContext(req),
		});

		res.status(204).send();
	} catch (error) {
		logger.error('Error deleting file:', error);
		res.status(500).json({ error: 'Failed to delete file' });
	}
}

export async function updateImageFocus(req: Request, res: Response): Promise<void> {
	try {
		const { fileId } = req.params;
		const org = getOrg(req);
		const { x, y } = req.body;

		if (typeof x !== 'number' || typeof y !== 'number') {
			res.status(400).json({ error: 'Focus requires numeric x and y' });
			return;
		}

		const meta = await FileService.updateImageFocus(org, fileId, { x, y });
		if (!meta) {
			res.status(404).json({ error: 'Image file not found' });
			return;
		}

		res.json(meta);
	} catch (error) {
		if ((error as Error).message === 'Focus coordinates must be 0..1') {
			res.status(400).json({ error: (error as Error).message });
			return;
		}
		logger.error('Error updating image focus:', error);
		res.status(500).json({ error: 'Failed to update focus' });
	}
}

export async function getImageVariant(req: Request, res: Response): Promise<void> {
	try {
		const { fileId, variant } = req.params;
		const org = getOrg(req);

		const preset = await ImageResolver.resolve(variant);

		const meta = await FileService.getFileMetaById(org, fileId);
		if (!meta || !meta.image) {
			res.status(404).json({ error: 'Image not found' });
			return;
		}

		const fmt = req.query.fmt === 'webp' ? 'webp' : undefined;
		const absolutePath = path.join(config.filesRoot, org, meta.storedPath);
		const variantPath = await ImageService.getVariant(absolutePath, preset, fmt);

		const ext = variantPath.endsWith('.webp') ? 'webp' : variantPath.endsWith('.png') ? 'png' : 'jpeg';
		res.type(`image/${ext}`);
		fs.createReadStream(variantPath).pipe(res);
	} catch (error) {
		if (error instanceof ImageResolver.PresetError) {
			res.status(error.status).json({ error: error.message });
			return;
		}
		logger.error('Error serving image variant:', error);
		res.status(500).json({ error: 'Failed to serve image' });
	}
}

export function registerFileRoutes(): void {
	idaeApi.router.addRoute({
		method: 'post',
		path:   '/api/files/:collection/:recordId',
		handler: uploadFiles,
		middleware: [requireDroit('U'), uploadMiddleware.single('file')],
	});

	idaeApi.router.addRoute({
		method: 'get',
		path:   '/api/files/:collection/:recordId',
		handler: listFilesForRecord,
		middleware: [requireDroit('R')],
	});

	idaeApi.router.addRoute({
		method: 'get',
		path:   '/api/files/:fileId/meta',
		handler: getFileMeta,
		middleware: [requireDroit('R')],
	});

	idaeApi.router.addRoute({
		method: 'get',
		path:   '/api/files/:fileId/download',
		handler: downloadFile,
		middleware: [requireDroit('R')],
	});

	idaeApi.router.addRoute({
		method: 'delete',
		path:   '/api/files/:fileId',
		handler: deleteFile,
		middleware: [requireDroit('D')],
	});

	idaeApi.router.addRoute({
		method: 'get',
		path:   '/api/files/:fileId/image/:variant',
		handler: getImageVariant,
		middleware: [requireDroit('R')],
	});

	idaeApi.router.addRoute({
		method: 'patch',
		path:   '/api/files/:fileId/focus',
		handler: updateImageFocus,
		middleware: [requireDroit('U')],
	});

	logger.info('File routes registered: upload/download/delete endpoints');
}
