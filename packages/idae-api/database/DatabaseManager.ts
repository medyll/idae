import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

const defaultDbName: string = "idaenext_sitebase_base";

// this is my middleware to connect to the appropriate database
class DatabaseManager {
  private static instance: DatabaseManager;

  constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async connectToDatabase(
    req: Request<{ dbName: string; collectionName: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { collectionName } = req.params;
    let dbName: string;
    let collection: string;
    //
    if (collectionName.includes(".")) {
      dbName = collectionName.split(".")[0];
    } else {
      dbName = defaultDbName;
    }

    const dbUri = `mongodb://localhost:27017/${dbName}`;

    try {
      if (!mongoose.connection.readyState) {
        await mongoose.connect(dbUri, {
          autoIndex: true,
          dbName,
        });
      } else if (mongoose.connection.name !== dbName) {
        await mongoose.disconnect();
        await mongoose.connect(dbUri, {
          autoIndex: true,
          dbName,
        });
      }
      console.log("connected to db", `${dbName}`);
      next();
    } catch (error: any) {
      /** @ts-ignore */
      res
        .status(500)
        .send(`Failed to connect to database ${dbName}: ${error.message}`);
    }
  }
}
// i can call it as a normal class or as a singleton
export default DatabaseManager.getInstance();
export { DatabaseManager, defaultDbName };
