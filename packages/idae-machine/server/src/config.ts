import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server directory
dotenv.config({ path: join(__dirname, '../.env') });

export const config = {
	port:       parseInt(process.env.PORT || '3000', 10),
	mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
	nodeEnv:    process.env.NODE_ENV || 'development',
	corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
	org:        process.env.ORG || 'test',
	jwtSecret:  process.env.JWT_SECRET || 'change-me-in-production',
	jwtTtl:     process.env.JWT_TTL    || '8h',
	filesRoot:  process.env.FILES_ROOT ?? join(__dirname, '../../data/files'),
	maxFileSize: Number(process.env.MAX_FILE_SIZE ?? 25 * 1024 * 1024),
	allowedMimeTypes: process.env.ALLOWED_MIMES ? process.env.ALLOWED_MIMES.split(',') : undefined,
	mail: {
		enabled:  process.env.MAIL_ENABLED === 'true',
		from:     process.env.MAIL_FROM ?? 'noreply@example.com',
		smtp: {
			host:   process.env.SMTP_HOST ?? 'localhost',
			port:   Number(process.env.SMTP_PORT ?? 587),
			secure: process.env.SMTP_SECURE === 'true',
			user:   process.env.SMTP_USER,
			pass:   process.env.SMTP_PASS,
		},
		templatesDir: process.env.MAIL_TEMPLATES_DIR ?? join(__dirname, './services/templates'),
	},
	image: {
		minDim: Number(process.env.IMG_MIN_DIM ?? 16),
		maxDim: Number(process.env.IMG_MAX_DIM ?? 4096),
	},
	version:    '2.0.0'
};
