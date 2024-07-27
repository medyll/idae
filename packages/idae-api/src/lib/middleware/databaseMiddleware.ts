// packages\idae-api\src\lib\middleware\databaseMiddleware.ts

import type { Request, Response, NextFunction } from 'express';
import databaseManager from '$lib/engine/DatabaseManager';

export const connectToDatabase = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await databaseManager.connectToDatabase(req, res, next);
	} catch (error) {
		next(error);
	}
};
