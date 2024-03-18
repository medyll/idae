import { idbqBase } from "$lib/scripts/idbq/idbq.js";

export type Chat = {
  id?: number;
  chatId?: string;
  title?: string;
  models?: string[];
  created_at?: Date;
  dateLastMessage?: Date;
  context?: number[];
};

export type Trash = {
  id?: number;
  chatId?: string;
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
  trash: {
    keyPath: "++id, chatId, created_at",
    model: {} as Trash,
  },
} as const;

const idbq = idbqBase<typeof idbqModel>(idbqModel, 1);

export const dbase = idbq("oneDatabase");

console.log(dbase.chat);
