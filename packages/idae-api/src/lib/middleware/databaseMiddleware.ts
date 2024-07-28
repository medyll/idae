// packages\idae-api\src\lib\middleware\databaseMiddleware.ts

import type { Request, Response, NextFunction } from 'express';
import databaseManager from '$lib/engine/DatabaseManager';

export const databaseMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { collectionName, dbName, connection } = await databaseManager.connectToDatabase(req);

		req.collectionName = collectionName;
		req.dbConnection = connection;
		req.dbName = dbName;
		next();
	} catch (error) {
		console.error('Error in database connection middleware:', error);
		next(error);
	}
};
