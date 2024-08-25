// packages\idae-api\src\lib\middleware\databaseMiddleware.ts

import type { Request, Response, NextFunction } from "express";
import databaseManager from "$lib/server/engine/DatabaseManager.js";
import { IdaeDb, DbType } from "@medyll/idae-db";

export const databaseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { dbName, collectionName, dbUri } = databaseManager.fromReq(req);

    console.log(
      "------------------------- Middleware called -----------------------",
    );
    console.log({ dbName, collectionName, dbUri });
    console.log("body :", req.body);
    console.log("params :", req.params);

    req.collectionName = collectionName;
    //req.dbConnection = connection;
    req.dbName = dbName;

    req.idaeDb = IdaeDb.init(dbUri, {
      dbType: DbType.MONGODB,
      dbScope: "a_idae_db_sitebase",
      dbScopeSeparator: "_",
      idaeModelOptions: {
        autoIncrementFormat: (collection: string) => `id${collection}`,
        autoIncrementDbCollection: "auto_increment",
      },
    });

    // create connection to db
    await req.idaeDb.db("app");

    req.connectedCollection = req.idaeDb.collection<any>(collectionName);

    console.log("Connected to collection", collectionName);

    next();
  } catch (error) {
    console.error("Error in database connection middleware:", error);
    next(error);
  }
};
