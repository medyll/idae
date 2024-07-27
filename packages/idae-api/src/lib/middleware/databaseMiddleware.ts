// packages\idae-api\src\lib\middleware\databaseMiddleware.ts

import type { Request, Response, NextFunction } from 'express';
import databaseManager from '$lib/engine/DatabaseManager';

export const databaseMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	console.log('Middleware: Connect to database');
	console.log('Middleware: req.params', req.params);
	try {
		// Vérifiez si req.params.collectionName existe, sinon utilisez une valeur par défaut
		// const collectionName = req.params.collectionName || 'default';
		await databaseManager.connectToDatabase(req, res, next);
	} catch (error) {
		console.error('Error in database connection middleware:', error);
		next(error);
	}
};
