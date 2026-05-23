import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { config } from '../config.js';

const storage = multer.diskStorage({
	destination(req, _file, cb) {
		const { collection, recordId } = req.params as { collection: string; recordId: string };
		const org = (req as any).org ?? 'default';
		const dir = path.join(config.filesRoot, org, collection, recordId);
		fs.mkdirSync(dir, { recursive: true });
		cb(null, dir);
	},
	filename(_req, file, cb) {
		const fileId = randomUUID();
		(file as any).fileId = fileId;
		cb(null, `${fileId}-${file.originalname}`);
	},
});

export const uploadMiddleware = multer({
	storage,
	limits: { fileSize: config.maxFileSize },
	fileFilter(_req, file, cb) {
		if (!config.allowedMimeTypes) return cb(null, true);
		cb(null, config.allowedMimeTypes.includes(file.mimetype));
	},
});
