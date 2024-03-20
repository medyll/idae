import { createIdbqDb } from "$lib/scripts/idbqlCore/idbqlCore.js";
import { idbqlState, stateIdbql } from "$lib/scripts/state/idbstate.svelte.js";

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

const idbqModel = {
  messages: {
    keyPath: "++id, chatId, created_at",
    model: {} as ChatMessage,
  },
  chat: {
    keyPath: "&chatId, created_at, dateLastMessage" as Chat,
    model: {} as Chat,
  },
} as const;

const idbqStore = createIdbqDb<typeof idbqModel>(idbqModel, 3);
export const dbase = idbqStore.create("oneDatabase");

console.log("results", dbase.db);
console.log("results", dbase.model.chat);
console.log("results", dbase.idbqlState.chat);

// create the state from the idbq database
let dbstate = idbqlState(dbase.db);

let messages = dbstate.addCollection<ChatMessage>("messages");
let results = messages.where({ chatId: { eq: "35" } });
let all = messages.getAll();
