// packages\idae-api\src\lib\middleware\databaseMiddleware.ts

import type { Request, Response, NextFunction } from "express";
import { requestDatabaseManager } from "$lib/server/engine/requestDatabaseManager.js";
import { IdaeDb } from "@medyll/idae-db";
import { idaeApi } from "../IdaeApi.js";

export const idaeDbMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { dbName, collectionName, dbUri } =
      requestDatabaseManager.fromReq(req);

    req.collectionName = collectionName;
    req.dbName = dbName;
    req.idaeDb = IdaeDb.init(dbUri, idaeApi.idaeApiOptions.idaeDbOptions);

    // create connection to db
    await req.idaeDb.db("app");

    req.connectedCollection = req.idaeDb.collection<any>(collectionName);

    console.log("Connected to collection", collectionName);
    if (req.query.params) {
      try {
        req.query.params = JSON.parse(
          decodeURIComponent(req.query.params as string),
        );
      } catch (error) {
        console.error(error);
      }
    }
    next();
  } catch (error) {
    console.error("Error in database connection middleware:", error);
    next(error);
  }
};
