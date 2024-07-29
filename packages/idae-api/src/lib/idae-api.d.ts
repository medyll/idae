// packages\idae-api\src\lib\idae-api.d.ts

import mongoose from 'mongoose';

declare global {
	namespace Express {
		interface Request {
			dbConnection?: mongoose.Connection;
			collectionName?: string;
			dbName?: string;
		}
	}
}

export {};
