// packages\idae-api\src\lib\idae-api.d.ts

import mongoose from "mongoose";
import { IdaeDb, IdaeDbAdapter } from "@medyll/idae-db";

declare global {
  namespace Express {
    interface Request {
      dbConnection?: mongoose.Connection;
      collectionName?: string;
      dbName?: string;
      idaeDb?: IdaeDb;
      connectedCollection: IdaeDbAdapter;
    }
  }
}

export {};
