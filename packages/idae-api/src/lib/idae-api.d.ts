// packages\idae-api\src\lib\idae-api.d.ts
// Extend Express Request interface to include dbConnection

import mongoose from 'mongoose';

declare global {
	namespace Express {
		interface Request {
			dbConnection?: mongoose.Connection;
		}
	}
}

export {};
