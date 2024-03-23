import { createIdbqDb } from "$lib/scripts/idbqlCore/idbqlCore.js";
import {
  createIdbqlState,
  stateIdbql,
} from "$lib/scripts/state/idbstate.svelte.js";

/** define the data typings to activate autocomplete feature */
export type Chat = {
  id?: number;
  chatId?: string;
  title?: string;
  models?: string[];
  created_at?: Date;
  dateLastMessage?: Date;
  context?: number[];
};

export type ChatMessage = {
  id?: string;
  chatId: string;
  messageId?: string;
  content?: string;
  images?: string[];
  status?: "done" | "sent" | "streaming" | "error";
  context?: number[];
  model?: string;
};

/**
 * Define a model for the IndexedDB database and forward the types to the IndexedDB wrapper.
 */
const idbqModel = {
  messages: {
    keyPath: "++id, chatId, created_at",
    model: {} as ChatMessage, // this will provide autocompletion
  },
  chat: {
    keyPath: "&chatId, created_at, dateLastMessage",
    model: {} as Chat,
  },
} as const;

const idbqStore = createIdbqDb<typeof idbqModel>(idbqModel, 3);

// export const dbase = idbqStore.create("oneDatabase");
// or
export const { idbql, idbqlState, idbDatabase } =
  idbqStore.create("oneDatabase");

/* console.log("results", { idbql, idbqlState, idbDatabase }); // the IDBDatabase instance
console.log("results", dbase.idbDatabase); // the IDBDatabase instance
console.log("results", dbase.idbql.chat); // indexed db collection, non reactive, can be used a non reactive way
setTimeout(() => {
  console.log("results", dbase.idbqlState); // state object, queryable, reactive
}, 2000);

let dbstate = createIdbqlState(dbase.idbDatabase);

let messages = dbstate.addCollection<ChatMessage>("messages");
let results = messages.where({ chatId: { eq: "35" } });
let all = messages.getAll();
 */
