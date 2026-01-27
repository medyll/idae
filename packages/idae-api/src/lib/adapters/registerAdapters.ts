import { IdaeDbAdapter } from "@medyll/idae-db";
import { DbType } from "$lib/@types/types.js";
import { PostgreSQLAdapter, SQLiteAdapter, PouchDBAdapter } from "./multiAdapters.js";

// Register new adapters
IdaeDbAdapter.addAdapter(DbType.POSTGRESQL, PostgreSQLAdapter);
IdaeDbAdapter.addAdapter(DbType.SQLITE, SQLiteAdapter);
IdaeDbAdapter.addAdapter(DbType.POUCHDB, PouchDBAdapter);