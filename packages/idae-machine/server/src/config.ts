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
	version:    '2.0.0'
};
