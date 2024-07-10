import mongoose from 'mongoose';
import type { Request, Response, NextFunction } from 'express';

const defaultDbName: string = 'idae';

// this is my middleware to connect to the appropriate database
class DBaseManager {
	private static instance: DBaseManager;
	public static port = 27017;

	constructor() {}

	public static getInstance(): DBaseManager {
		if (!DBaseManager.instance) {
			DBaseManager.instance = new DBaseManager();
		}
		return DBaseManager.instance;
	}

	public async connectToDatabase(
		req: Request<{ dbName: string; collectionName: string }>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const { collectionName } = req.params;
		let dbName: string;
		//
		if (collectionName.includes('.')) {
			dbName = collectionName.split('.')[0];
		} else {
			dbName = defaultDbName;
		}

		const dbUri = `mongodb://localhost:${DBaseManager.port}/${dbName}`;

		try {
			if (!mongoose.connection.readyState) {
				await mongoose.connect(dbUri, {
					autoIndex: true,
					dbName
				});
			} else if (mongoose.connection.name !== dbName) {
				await mongoose.disconnect();
				await mongoose.connect(dbUri, {
					autoIndex: true,
					dbName
				});
			}
			console.log('connected to db', `${dbName}`);
			next();
		} catch (error: any) {
			/** @ts-ignore */
			res.status(500).send(`Failed to connect to database ${dbName}: ${error.message}`);
		}
	}
}
// i can call it as a normal class or as a singleton
export default DBaseManager.getInstance();
export { DBaseManager as DatabaseManager, defaultDbName };
