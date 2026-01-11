// packages\idae-api\src\lib\middleware\databaseMiddleware.ts

import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import requestDatabaseManager from "$lib/server/engine/requestDatabaseManager.js";
import { IdaeDb } from "@medyll/idae-db";

const inMemoryStores = new Map<string, Map<string, any>>();

const getInMemoryAdapter = (dbName: string, collectionName: string) => {
  const key = `${dbName}:${collectionName}`;
  let store = inMemoryStores.get(key);
  if (!store) {
    store = new Map<string, any>();
    inMemoryStores.set(key, store);
  }

  return {
    async find() {
      return Array.from(store.values());
    },
    async findById(id: string) {
      return store.get(id) ?? null;
    },
    async create(body: any) {
      const id = body?._id ?? randomUUID();
      const doc = { ...body, _id: id };
      store.set(id, doc);
      return doc;
    },
    async update(id: string, body: any) {
      const existing = store.get(id) ?? {};
      const updated = { ...existing, ...body };
      store.set(id, updated);
      return updated;
    },
    async deleteById(id: string) {
      store.delete(id);
      return;
    },
    async deleteWhere() {
      const count = store.size;
      store.clear();
      return count;
    },
  } as any;
};

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

    const useMemoryDb =
      req.app?.locals?.useMemoryDb === true ||
      process.env.IDAE_USE_MEMORY_DB === "true";

    if (useMemoryDb) {
      const adapter = getInMemoryAdapter(dbName, collectionName);
      req.idaeDb = {
        collection: () => adapter,
      } as any;
      req.connectedCollection = adapter;
      if (req.query.params) {
        try {
          const raw = req.query.params;
          const decoded = typeof raw === "string" ? decodeURIComponent(raw) : raw;
          req.query.params = typeof decoded === "string" ? JSON.parse(decoded) : decoded;
        } catch (error) {
          console.error(error);
        }
      }
      next();
      return;
    }

    const dbOptions = req.app?.locals?.idaeDbOptions ?? {};
    req.idaeDb = IdaeDb.init(dbUri, dbOptions);

    await req.idaeDb.db("app");

    req.connectedCollection = req.idaeDb.collection<any>(collectionName);

    console.log("Connected to collection", collectionName);
    if (req.query.params) {
      try {
        const raw = req.query.params;
        const decoded = typeof raw === "string" ? decodeURIComponent(raw) : raw;
        req.query.params = typeof decoded === "string" ? JSON.parse(decoded) : decoded;
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
