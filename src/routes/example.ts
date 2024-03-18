import { idbqBase } from "$lib/scripts/idbq/idbq.js";
import { stateIdbql } from "$lib/scripts/state/idbstate.svelte.js";

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
  chat: {
    keyPath: "&chatId, created_at, dateLastMessage" as Chat,
    model: {} as Chat,
  },
  messages: {
    keyPath: "++id, chatId, created_at",
    model: {} as ChatMessage,
  },
} as const;

const idbq = idbqBase<typeof idbqModel>(idbqModel, 3);
export const dbase = idbq("oneDatabase");

let dbstate = stateIdbql({}, dbase);

let messages = dbstate.onCollection<ChatMessage>("messages");
let results = messages.where({ chatId: { eq: "35" } });
let all = messages.getAll();
